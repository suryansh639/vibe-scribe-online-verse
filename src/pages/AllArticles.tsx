
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import PopularTopicsSidebar from "@/components/articles/PopularTopicsSidebar";
import ArticleSearchBar from "@/components/articles/ArticleSearchBar";
import ArticlesList from "@/components/articles/ArticlesList";
import { ArticleListItem } from "@/components/articles/ArticleCard";

const AllArticles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
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
      let query = supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          cover_image,
          published_at,
          created_at,
          read_time,
          tags,
          likes,
          comments,
          profiles(id, full_name, username, avatar_url)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      // Apply tag filter if present
      if (tagFilter) {
        query = query.contains("tags", [tagFilter]);
      }

      // Apply search filter if present
      if (searchFilter) {
        query = query.or(
          `title.ilike.%${searchFilter}%,excerpt.ilike.%${searchFilter}%,tags.cs.{%${searchFilter}%}`
        );
      }

      // Set a reasonable limit to improve performance
      query = query.limit(50);

      const { data: articlesData, error } = await query;

      if (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
        return;
      }

      if (!articlesData || articlesData.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      const formattedArticles: ArticleListItem[] = articlesData.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || "",
        coverImage: article.cover_image,
        author: {
          id: article.profiles.id,
          name: article.profiles.full_name || article.profiles.username || "Anonymous",
          avatar: article.profiles.avatar_url
        },
        publishedAt: article.published_at || article.created_at,
        readTime: article.read_time || "5 min read",
        tags: article.tags || [],
        likes: article.likes || 0,
        comments: article.comments || 0
      }));

      setArticles(formattedArticles);
    } catch (err) {
      console.error("Error in fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, [tagFilter, searchFilter]);

  // Optimize popular tags fetching
  const fetchPopularTags = useCallback(async () => {
    try {
      const { data: articlesData, error } = await supabase
        .from("articles")
        .select("tags")
        .eq("status", "published")
        .limit(100); // Limit to improve performance

      if (error || !articlesData) {
        console.error("Error fetching tags:", error);
        return;
      }

      // Count tag occurrences
      const tagCounts = articlesData.reduce((counts: Record<string, number>, article) => {
        if (!article.tags) return counts;

        article.tags.forEach((tag: string) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });

        return counts;
      }, {} as Record<string, number>);

      // Sort tags by count and take top 10
      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);

      setPopularTags(sortedTags);
    } catch (err) {
      console.error("Error in fetching popular tags:", err);
    }
  }, []);

  useEffect(() => {
    // Load articles and tags in parallel
    Promise.all([fetchArticles(), fetchPopularTags()]);
  }, [fetchArticles, fetchPopularTags]);

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
