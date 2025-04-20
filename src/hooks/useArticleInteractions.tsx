
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

  useEffect(() => {
    if (!user || !articleId) return;

    const checkInteractions = async () => {
      // Check if user has liked the article
      const { data: likeData } = await supabase
        .from("article_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .single();

      setIsLiked(!!likeData);

      // Check if user has bookmarked the article
      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .single();

      setIsBookmarked(!!bookmarkData);

      // Get article likes count
      const { data: articleData } = await supabase
        .from("articles")
        .select("likes")
        .eq("id", articleId)
        .single();

      if (articleData) {
        setLikesCount(articleData.likes || 0);
      }
    };

    checkInteractions();
  }, [user, articleId]);

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
        await supabase
          .from("article_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Add like
        await supabase
          .from("article_likes")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Action failed",
        description: "Failed to like article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

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
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        setIsBookmarked(false);
      } else {
        // Add bookmark
        await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Action failed",
        description: "Failed to bookmark article. Please try again.",
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
