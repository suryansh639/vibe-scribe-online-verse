
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import PopularTopicsSidebar from "@/components/articles/PopularTopicsSidebar";
import ArticleSearchBar from "@/components/articles/ArticleSearchBar";
import ArticlesList from "@/components/articles/ArticlesList";
import { ArticleDetailData } from "@/hooks/types/articleTypes";
import { articles as mockArticles } from "@/data/mockData"; // Keep for fallback

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
      // Build query based on filters
      let query = supabase
        .from('articles')
        .select(`
          id, 
          title, 
          content, 
          excerpt, 
          cover_image, 
          published_at, 
          read_time, 
          tags, 
          likes, 
          comments, 
          featured,
          profiles:author_id (id, full_name, username, avatar_url, bio)
        `)
        .eq('published', true);

      // Apply tag filter if present
      if (tagFilter) {
        // Using contains() for array search
        query = query.contains('tags', [tagFilter]);
      }

      // Apply search filter if present
      if (searchFilter) {
        // Using ilike for case-insensitive search in text fields
        query = query.or(`title.ilike.%${searchFilter}%,excerpt.ilike.%${searchFilter}%,content.ilike.%${searchFilter}%`);
      }

      // Execute the query
      const { data, error } = await query.order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Map database results to ArticleDetailData
      let processedArticles: ArticleDetailData[] = [];
      
      if (data && data.length > 0) {
        processedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "",
          excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
          coverImage: article.cover_image || "/placeholder.svg",
          publishedAt: article.published_at || new Date().toISOString(),
          readTime: article.read_time || "5 min read",
          tags: article.tags || [],
          likes: article.likes || 0,
          comments: article.comments || 0,
          featured: article.featured || false,
          author: {
            id: article.profiles?.id || "unknown",
            name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
            avatar: article.profiles?.avatar_url || "/placeholder.svg",
            bio: article.profiles?.bio || "No bio available"
          }
        }));
      } else {
        // Fallback to mock data if filters match
        let filteredMockArticles = mockArticles;
        
        if (tagFilter) {
          filteredMockArticles = filteredMockArticles.filter(article => 
            article.tags && article.tags.includes(tagFilter)
          );
        }

        if (searchFilter) {
          const searchLower = searchFilter.toLowerCase();
          filteredMockArticles = filteredMockArticles.filter(article => 
            article.title.toLowerCase().includes(searchLower) ||
            article.excerpt?.toLowerCase().includes(searchLower) ||
            article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        processedArticles = filteredMockArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "",
          excerpt: article.excerpt || "",
          coverImage: article.coverImage || "/placeholder.svg",
          author: {
            id: article.author?.id || "unknown",
            name: article.author?.name || "Anonymous",
            avatar: article.author?.avatar || "/placeholder.svg",
            bio: article.author?.bio || "No bio available"  // Added bio property to match the expected type
          },
          publishedAt: article.publishedAt || new Date().toISOString(), // Using publishedAt instead of created_at
          readTime: article.readTime || "5 min read",
          tags: article.tags || [],
          likes: article.likes || 0,
          comments: article.comments || 0,
          featured: article.featured || false
        }));
      }

      setArticles(processedArticles);

      // Fetch popular tags
      await fetchPopularTags();
    } catch (err) {
      console.error("Error fetching articles:", err);
      
      // Fallback to mock data with filtering
      let filteredMockArticles = mockArticles;
      
      if (tagFilter) {
        filteredMockArticles = filteredMockArticles.filter(article => 
          article.tags && article.tags.includes(tagFilter)
        );
      }

      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        filteredMockArticles = filteredMockArticles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower) ||
          article.content?.toLowerCase().includes(searchLower) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      const processedArticles = filteredMockArticles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content || "",
        excerpt: article.excerpt || "",
        coverImage: article.coverImage || "/placeholder.svg",
        author: {
          id: article.author?.id || "unknown", 
          name: article.author?.name || "Anonymous",
          avatar: article.author?.avatar || "/placeholder.svg",
          bio: article.author?.bio || "No bio available"  // Added bio property
        },
        publishedAt: article.publishedAt || new Date().toISOString(),  // Using publishedAt instead of created_at
        readTime: article.readTime || "5 min read",
        tags: article.tags || [],
        likes: article.likes || 0,
        comments: article.comments || 0,
        featured: article.featured || false
      }));
      
      setArticles(processedArticles);
      
      // Extract tags from mock articles
      const allTags = processedArticles.flatMap(article => article.tags || []);
      const tagCounts = allTags.reduce((counts: Record<string, number>, tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);

      setPopularTags(sortedTags);
    } finally {
      setLoading(false);
    }
  }, [tagFilter, searchFilter]);

  const fetchPopularTags = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('published', true);

      if (error) throw error;

      if (data) {
        const tagCounts: Record<string, number> = {};
        data.forEach(article => {
          if (!article.tags) return;
          article.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });
        
        const sortedTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([tag]) => tag);
          
        setPopularTags(sortedTags);
      }
    } catch (error) {
      console.error("Error fetching popular tags:", error);
    }
  };

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
