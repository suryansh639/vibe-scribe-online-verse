
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

      let filteredArticles = combinedArticles;

      // Apply tag filter if present
      if (tagFilter) {
        filteredArticles = filteredArticles.filter(article => 
          article.tags && article.tags.includes(tagFilter)
        );
      }

      // Apply search filter if present
      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower) ||
          article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Ensure all properties are present for ArticleDetailData
      const processedArticles: ArticleDetailData[] = filteredArticles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content || "",
        excerpt: article.excerpt || "",
        coverImage: article.coverImage || "/placeholder.svg",
        author: {
          id: article.author.id,
          name: article.author.name || "Anonymous",
          avatar: article.author.avatar || "/placeholder.svg",
          bio: article.author.bio || "No bio available"
        },
        publishedAt: article.publishedAt || article.created_at || new Date().toISOString(),
        readTime: article.readTime || "5 min read",
        tags: article.tags || [],
        likes: article.likes || 0,
        comments: article.comments || 0,
        featured: article.featured || false
      }));

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
