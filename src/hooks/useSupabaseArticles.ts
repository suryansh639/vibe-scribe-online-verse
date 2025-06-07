
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleDetailData } from "./types/articleTypes";

export const useSupabaseArticles = () => {
  const [articles, setArticles] = useState<ArticleDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        console.log("Fetching articles from Supabase...");
        
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:profiles(*)
          `)
          .eq("status", "published")
          .order("published_at", { ascending: false });
          
        if (error) {
          console.error("Supabase error:", error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (!data || data.length === 0) {
          console.log("No articles found in database");
          setArticles([]);
          setLoading(false);
          return;
        }
        
        console.log("Articles data from Supabase:", data);
        
        // Transform articles data
        const transformedArticles: ArticleDetailData[] = data.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "",
          excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
          coverImage: article.cover_image || "/placeholder.svg",
          publishedAt: article.published_at || article.created_at || new Date().toISOString(),
          readTime: article.read_time || "5 min read",
          tags: article.tags || [],
          likes: article.likes || 0,
          comments: article.comments || 0,
          featured: article.featured || false,
          author: {
            id: article.author?.id || "unknown",
            name: article.author?.full_name || article.author?.username || "Anonymous",
            avatar: article.author?.avatar_url || "/placeholder.svg",
            bio: article.author?.bio || ""
          }
        }));
        
        setArticles(transformedArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("An error occurred while fetching articles");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading, error };
};
