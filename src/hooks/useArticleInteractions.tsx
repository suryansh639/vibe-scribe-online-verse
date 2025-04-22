
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type InteractionType = "like" | "bookmark";

interface UseArticleInteractionsProps {
  articleId: string;
}

export const useArticleInteractions = ({ articleId }: UseArticleInteractionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState<InteractionType | null>(null);

  // Fetch initial interaction state
  useEffect(() => {
    if (!articleId) return;

    const checkInteractions = async () => {
      try {
        // Get article likes count
        const { data: articleData } = await supabase
          .from("articles")
          .select("likes")
          .eq("id", articleId)
          .maybeSingle();

        if (articleData) {
          setLikesCount(articleData.likes || 0);
        }

        if (user) {
          // Check if user has liked the article
          const { data: likeData } = await supabase
            .from("article_likes")
            .select("*")
            .eq("user_id", user.id)
            .eq("article_id", articleId)
            .maybeSingle();

          setIsLiked(!!likeData);

          // Check if user has bookmarked the article
          const { data: bookmarkData } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .eq("article_id", articleId)
            .maybeSingle();

          setIsBookmarked(!!bookmarkData);
        } else {
          setIsLiked(false);
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error("Error checking interactions:", error);
      }
    };

    checkInteractions();
  }, [user, articleId]);

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }

    setLoading("bookmark");

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        if (error) throw error;
        setIsBookmarked(false);
        
        toast({
          title: "Bookmark removed",
          description: "Article has been removed from your bookmarks",
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        if (error) throw error;
        setIsBookmarked(true);
        
        toast({
          title: "Article bookmarked",
          description: "Article has been added to your bookmarks",
        });
      }
    } catch (error: any) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Action failed",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    setLoading("like");

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from("article_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Like removed",
          description: "Your like has been removed from the article",
        });
      } else {
        // Add like
        const { error } = await supabase
          .from("article_likes")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        if (error) throw error;
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
        toast({
          title: "Article liked",
          description: "You have liked this article",
        });
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast({
        title: "Action failed",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return {
    isLiked,
    isBookmarked,
    likesCount,
    loading,
    toggleLike,
    toggleBookmark,
  };
};
