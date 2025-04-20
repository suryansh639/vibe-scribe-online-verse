import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";

const AllArticles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get tag and search from URL params
  const tagFilter = searchParams.get("tag");
  const searchFilter = searchParams.get("search");
  
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      let query = supabase
        .from("articles")
        .select(`
          *,
          profiles(*)
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
      
      const { data: articlesData, error } = await query;
      
      if (error) {
        console.error("Error fetching articles:", error);
        setLoading(false);
        return;
      }
      
      const formattedArticles = articlesData.map(article => ({
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
      setLoading(false);
    };
    
    const fetchPopularTags = async () => {
      const { data: articlesData, error } = await supabase
        .from("articles")
        .select("tags")
        .eq("status", "published");
      
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
      }, {});
      
      // Sort tags by count and take top 10
      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);
      
      setPopularTags(sortedTags);
    };
    
    fetchArticles();
    fetchPopularTags();
  }, [tagFilter, searchFilter]);
  
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
              
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full md:w-64"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  {(searchFilter || searchTerm) && (
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 p-0 mr-1" onClick={clearSearch}>
                      <X size={14} />
                    </Button>
                  )}
                  <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Search size={14} />
                  </Button>
                </div>
              </form>
            </div>
            
            {loading ? (
              // Loading skeleton
              <div className="space-y-8">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="hidden md:block h-32 w-32" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-gray-600">
                  {tagFilter 
                    ? `No articles with the tag "${tagFilter}" were found.` 
                    : searchFilter 
                    ? `No articles match your search for "${searchFilter}".`
                    : "No articles are available."}
                </p>
                {(tagFilter || searchFilter) && (
                  <Button 
                    onClick={clearSearch}
                    className="mt-4"
                  >
                    View all articles
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 rounded-lg p-6 mb-8 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer ${tagFilter === tag ? 'bg-brand-orange text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllArticles;
