
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

  // Always fetch up-to-date like/bookmark data from Supabase
  useEffect(() => {
    if (!articleId) return;

    const checkInteractions = async () => {
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

        // The DB trigger will decrement likes in "articles", so fetch updated count:
        const { data: article } = await supabase
          .from("articles")
          .select("likes")
          .eq("id", articleId)
          .maybeSingle();
        setLikesCount(article?.likes ?? 0);
      } else {
        // Add like
        await supabase
          .from("article_likes")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        setIsLiked(true);

        // DB trigger will increment likes, fetch latest:
        const { data: article } = await supabase
          .from("articles")
          .select("likes")
          .eq("id", articleId)
          .maybeSingle();
        setLikesCount(article?.likes ?? 0);
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

  return {
    isLiked,
    isBookmarked,
    likesCount,
    loading,
    toggleLike,
    toggleBookmark,
  };
};
