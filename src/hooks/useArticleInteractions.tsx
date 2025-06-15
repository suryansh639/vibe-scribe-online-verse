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

  // Utility to refresh like count and bookmark/like status from Supabase
  const refreshState = async () => {
    if (!articleId) return;

    // Fetch current like count from the article row
    const { data: articleData, error: articleError } = await supabase
      .from("articles")
      .select("likes")
      .eq("id", articleId)
      .maybeSingle();

    if (!articleError && articleData) {
      setLikesCount(articleData.likes ?? 0);
    }

    if (user) {
      // Check if user has liked/bookmarked
      const { data: likeData } = await supabase
        .from("article_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .maybeSingle();
      setIsLiked(!!likeData);

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .maybeSingle();
      setIsBookmarked(!!bookmarkData);
    } else {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  };

  // Fetch initial interaction state
  useEffect(() => {
    if (!articleId) return;
    
    const checkInteractions = async () => {
      try {
        // Get article likes count
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select("likes")
          .eq("id", articleId)
          .maybeSingle();

        if (articleError) {
          console.error("Error fetching article data:", articleError);
          return;
        }

        if (articleData) {
          setLikesCount(articleData.likes || 0);
        }

        if (user) {
          // Check if user has liked the article
          const { data: likeData, error: likeError } = await supabase
            .from("article_likes")
            .select("*")
            .eq("user_id", user.id)
            .eq("article_id", articleId)
            .maybeSingle();

          if (likeError) {
            console.error("Error checking like status:", likeError);
          } else {
            setIsLiked(!!likeData);
          }

          // Check if user has bookmarked the article
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .eq("article_id", articleId)
            .maybeSingle();

          if (bookmarkError) {
            console.error("Error checking bookmark status:", bookmarkError);
          } else {
            setIsBookmarked(!!bookmarkData);
          }
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
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);
        toast({
          title: "Bookmark removed",
          description: "Article has been removed from your bookmarks",
        });
      } else {
        await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });
        toast({
          title: "Article bookmarked",
          description: "Article has been added to your bookmarks",
        });
      }
      await refreshState(); // always re-fetch state
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
        await supabase
          .from("article_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);
        toast({
          title: "Like removed",
          description: "Your like has been removed from the article",
        });
      } else {
        await supabase
          .from("article_likes")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });
        toast({
          title: "Article liked",
          description: "You have liked this article",
        });
      }
      await refreshState(); // always re-fetch state!
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
