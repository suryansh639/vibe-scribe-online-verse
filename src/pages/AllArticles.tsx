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

  const fetchArticles = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch all published articles from Supabase
      const { data: supaArticles, error } = await supabase
        .from('articles')
        .select(`
          id, title, excerpt, content, cover_image, published_at, created_at,
          read_time, tags, likes, comments, featured,
          author:profiles(id, full_name, username, avatar_url, bio)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Prepare Supabase articles
      let processedArticles: ArticleDetailData[] = (supaArticles || []).map(article => ({
        id: article.id,
        title: article.title,
        content: article.content || "",
        excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
        coverImage: article.cover_image || "/placeholder.svg",
        author: {
          id: article.author.id,
          name: article.author.full_name || article.author.username || "Anonymous",
          avatar: article.author.avatar_url || "/placeholder.svg",
          bio: article.author.bio || "No bio available"
        },
        publishedAt: article.published_at || article.created_at || new Date().toISOString(),
        readTime: article.read_time || "5 min read",
        tags: article.tags || [],
        likes: article.likes || 0,
        comments: article.comments || 0,
        featured: article.featured || false
      }));

      // (Optional) Merge with mock/local articles here if you want to show them as drafts

      // Apply tag filter if present
      if (tagFilter) {
        processedArticles = processedArticles.filter(article => article.tags && article.tags.includes(tagFilter));
      }

      // Apply search filter if present
      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        processedArticles = processedArticles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

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
    } catch (err: any) {
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
