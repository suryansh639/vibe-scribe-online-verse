import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleDetailData, RelatedArticle } from "./types/articleTypes";

export const useSupabaseArticle = (id: string) => {
  const [article, setArticle] = useState<ArticleDetailData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleFromSupabase = async () => {
      try {
        // Fetch article from Supabase
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:profiles(*)
          `)
          .eq("id", id)
          .eq("status", "published")
          .maybeSingle();
          
        if (error) {
          console.log("Supabase error:", error);
          setError(error.message);
          return null;
        }
        
        if (!data) {
          setError("Article not found in database");
          return null;
        }
        
        // Transform article data
        const articleData: ArticleDetailData = {
          id: data.id,
          title: data.title,
          content: data.content || "",
          excerpt: data.excerpt || data.content?.substring(0, 150) + "..." || "",
          coverImage: data.cover_image || "/placeholder.svg",
          publishedAt: data.published_at || data.created_at || new Date().toISOString(),
          readTime: data.read_time || "5 min read", // Ensure readTime is always provided
          tags: data.tags || [],
          likes: data.likes || 0,
          comments: data.comments || 0,
          featured: data.featured || false, // Make sure featured is provided
          author: {
            id: data.author.id,
            name: data.author.full_name || data.author.username || "Anonymous",
            avatar: data.author.avatar_url || "/placeholder.svg",
            bio: data.author.bio || ""
          }
        };
        
        setArticle(articleData);
        
        // Fetch related articles if this article has tags
        if (data.tags && data.tags.length > 0) {
          await fetchRelatedArticles(id, data.tags);
        }
        
        // Fetch popular tags
        await fetchPopularTags();
        
        return articleData;
      } catch (error) {
        console.error("Error in fetchArticleFromSupabase:", error);
        setError("An error occurred while fetching the article from database");
        return null;
      }
    };

    const fetchRelatedArticles = async (articleId: string, tags: string[]) => {
      try {
        const { data: relatedData, error: relatedError } = await supabase
          .from("articles")
          .select(`
            id,
            title,
            cover_image,
            profiles!articles_author_id_fkey(id, full_name, username, avatar_url)
          `)
          .neq("id", articleId)
          .eq("status", "published")
          .overlaps("tags", tags)
          .limit(3);
          
        if (relatedError) {
          console.error("Error fetching related articles:", relatedError);
          return;
        }
        
        if (relatedData && relatedData.length > 0) {
          setRelatedArticles(relatedData.map(article => ({
            id: article.id,
            title: article.title,
            coverImage: article.cover_image,
            author: {
              id: article.profiles?.id || "unknown",
              name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
              avatar: article.profiles?.avatar_url
            }
          })));
        }
      } catch (error) {
        console.error("Error in fetchRelatedArticles:", error);
      }
    };

    const fetchPopularTags = async () => {
      try {
        const { data: tagsData, error: tagsError } = await supabase
          .from("articles")
          .select("tags")
          .eq("status", "published");
          
        if (tagsError) {
          console.error("Error fetching tags:", tagsError);
          return;
        }
        
        if (tagsData) {
          const tagCounts: Record<string, number> = {};
          tagsData.forEach(article => {
            if (!article.tags) return;
            article.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          });
          
          const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([tag]) => tag);
            
          setPopularTags(sortedTags);
        }
      } catch (error) {
        console.error("Error in fetchPopularTags:", error);
      }
    };

    fetchArticleFromSupabase();
    return () => {
      // Cleanup if needed
    };
  }, [id]);

  return { article, relatedArticles, popularTags, error, loading };
};
