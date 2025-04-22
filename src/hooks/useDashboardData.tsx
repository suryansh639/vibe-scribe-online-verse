
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ArticleListItem } from "@/components/articles/ArticlesList";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useDashboardData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myArticles, setMyArticles] = useState<ArticleListItem[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<ArticleListItem[]>([]);
  const [likedArticles, setLikedArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(profile);
    };

    const fetchMyArticles = async () => {
      if (!user) return;
      
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching articles:", error);
        return;
      }
      
      const formattedArticles = articles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || "",
        coverImage: article.cover_image,
        author: {
          id: article.author.id,
          name: article.author.full_name || article.author.username || "Anonymous",
          avatar: article.author.avatar_url
        },
        publishedAt: article.published_at || article.created_at,
        readTime: article.read_time || "5 min read",
        tags: article.tags || [],
        likes: article.likes || 0,
        comments: article.comments || 0
      }));
      
      setMyArticles(formattedArticles);
    };

    const fetchBookmarkedArticles = async () => {
      if (!user) return;
      
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select(`
          article_id,
          articles!inner(
            *,
            profiles(*)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching bookmarks:", error);
        return;
      }
      
      const formattedArticles = bookmarks.map(bookmark => {
        const article = bookmark.articles;
        return {
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
        };
      });
      
      setBookmarkedArticles(formattedArticles);
    };

    const fetchLikedArticles = async () => {
      if (!user) return;
      
      const { data: likes, error } = await supabase
        .from('article_likes')
        .select(`
          article_id,
          articles!inner(
            *,
            profiles(*)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching likes:", error);
        return;
      }
      
      const formattedArticles = likes.map(like => {
        const article = like.articles;
        return {
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
        };
      });
      
      setLikedArticles(formattedArticles);
    };

    Promise.all([
      fetchProfile(),
      fetchMyArticles(),
      fetchBookmarkedArticles(),
      fetchLikedArticles()
    ]).finally(() => setLoading(false));

  }, [user]);

  return {
    profile,
    myArticles,
    bookmarkedArticles,
    likedArticles,
    loading
  };
};
