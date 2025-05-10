
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import PopularTopicsSidebar from "@/components/articles/PopularTopicsSidebar";
import ArticleSearchBar from "@/components/articles/ArticleSearchBar";
import ArticlesList from "@/components/articles/ArticlesList";
import { ArticleDetailData } from "@/hooks/types/articleTypes";
import { articles as mockArticles } from "@/data/mockData";

const AllArticles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<ArticleDetailData[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get tag and search from URL params
  const tagFilter = searchParams.get("tag");
  const searchFilter = searchParams.get("search");

  // Memoize fetchArticles to prevent unnecessary re-renders
  const fetchArticles = useCallback(async () => {
    setLoading(true);

    try {
      // First try to fetch from Supabase
      let { data: supabaseArticles, error } = await supabase
        .from('articles')
        .select(`
          id, title, content, excerpt, cover_image, published_at, read_time, tags, likes, comments, featured,
          author_id, profiles(id, full_name, username, avatar_url, bio)
        `)
        .order('published_at', { ascending: false });

      // If there's an error or no data, fall back to localStorage and mockData
      if (error || !supabaseArticles || supabaseArticles.length === 0) {
        console.log("Falling back to localStorage and mockData", error);
        
        // Get user articles from localStorage
        const userArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
        
        // Combine with mock articles, ensuring no duplicates by id
        const combinedArticles = [...userArticles];
        
        // Add mock articles that don't exist in user articles
        mockArticles.forEach(mockArticle => {
          if (!combinedArticles.some(article => article.id === mockArticle.id)) {
            combinedArticles.push(mockArticle);
          }
        });

        supabaseArticles = combinedArticles;
      }

      let filteredArticles = supabaseArticles || [];

      // Apply tag filter if present
      if (tagFilter) {
        filteredArticles = filteredArticles.filter((article: any) => 
          article && article.tags && article.tags.includes(tagFilter)
        );
      }

      // Apply search filter if present
      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        filteredArticles = filteredArticles.filter((article: any) => 
          article && (
            (article.title && article.title.toLowerCase().includes(searchLower)) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(searchLower)) ||
            (article.tags && article.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
          )
        );
      }

      // Transform all articles to match ArticleDetailData exactly
      const processedArticles: ArticleDetailData[] = (filteredArticles || []).map((article: any) => {
        // Case 1: Handle articles from Supabase with profiles nested
        if (article && 'profiles' in article) {
          const profiles = article.profiles as Record<string, any> | null | undefined;
          
          return {
            id: article.id || "",
            title: article.title || "",
            content: article.content || "", // Ensure content is never undefined
            excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
            coverImage: article.cover_image || "/placeholder.svg",
            publishedAt: article.published_at || new Date().toISOString(),
            readTime: article.read_time || "5 min read",
            tags: Array.isArray(article.tags) ? article.tags : [],
            likes: typeof article.likes === 'number' ? article.likes : 0,
            comments: typeof article.comments === 'number' ? article.comments : 0,
            featured: !!article.featured,
            author: {
              id: profiles?.id || article.author_id || "anonymous",
              name: profiles?.full_name || profiles?.username || "Anonymous",
              avatar: profiles?.avatar_url || "/placeholder.svg",
              bio: profiles?.bio || "No bio available"
            }
          };
        }
        // Case 2: Handle mock articles or localStorage articles with different structure
        else if (article && 'author' in article) {
          return {
            id: article.id || "",
            title: article.title || "",
            content: article.content || "", // Ensure content is never undefined
            excerpt: article.excerpt || "",
            coverImage: article.coverImage || "/placeholder.svg",
            publishedAt: article.publishedAt || new Date().toISOString(),
            readTime: article.readTime || "5 min read",
            tags: Array.isArray(article.tags) ? article.tags : [],
            likes: typeof article.likes === 'number' ? article.likes : 0,
            comments: typeof article.comments === 'number' ? article.comments : 0,
            featured: !!article.featured,
            author: {
              id: article.author?.id || "anonymous",
              name: article.author?.name || "Anonymous",
              avatar: article.author?.avatar || "/placeholder.svg",
              bio: article.author?.bio || "No bio available"
            }
          };
        }
        // Case 3: Fallback for any other structure to ensure it matches ArticleDetailData
        else if (article) {
          return {
            id: article.id || "",
            title: article.title || "",
            content: article.content || "", // Ensure content is never undefined
            excerpt: article.excerpt || "",
            coverImage: article.coverImage || article.cover_image || "/placeholder.svg",
            publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
            readTime: article.readTime || article.read_time || "5 min read",
            tags: Array.isArray(article.tags) ? article.tags : [],
            likes: typeof article.likes === 'number' ? article.likes : 0,
            comments: typeof article.comments === 'number' ? article.comments : 0,
            featured: !!article.featured,
            author: {
              id: article.author_id || "anonymous",
              name: "Anonymous",
              avatar: "/placeholder.svg",
              bio: "No bio available"
            }
          };
        } else {
          // If article is somehow null or undefined, return a default article
          return {
            id: "default-id",
            title: "Default Title",
            content: "",
            excerpt: "Default excerpt",
            coverImage: "/placeholder.svg",
            publishedAt: new Date().toISOString(),
            readTime: "5 min read",
            tags: [],
            likes: 0,
            comments: 0,
            featured: false,
            author: {
              id: "anonymous",
              name: "Anonymous",
              avatar: "/placeholder.svg",
              bio: "No bio available"
            }
          };
        }
      });

      setArticles(processedArticles);

      // Extract and count tags from all articles for popular tags
      const allTags = processedArticles.flatMap(article => article.tags || []);
      const tagCounts = allTags.reduce((counts: Record<string, number>, tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      // Sort tags by count and take top 10
      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);

      setPopularTags(sortedTags);
    } catch (err) {
      console.error("Error in fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, [tagFilter, searchFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm });
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setSearchTerm("");
  };

  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold">
                {tagFilter ? `Articles tagged "${tagFilter}"` :
                  searchFilter ? `Search results for "${searchFilter}"` :
                    "All Articles"}
              </h1>

              <ArticleSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchFilter={searchFilter}
                onSubmit={handleSearchSubmit}
                clearSearch={clearSearch}
              />
            </div>

            <ArticlesList
              articles={articles}
              loading={loading}
              tagFilter={tagFilter}
              searchFilter={searchFilter}
              clearSearch={clearSearch}
            />
          </div>

          {/* Sidebar */}
          <div className="md:w-1/4">
            <PopularTopicsSidebar
              tags={popularTags}
              tagFilter={tagFilter}
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllArticles;
