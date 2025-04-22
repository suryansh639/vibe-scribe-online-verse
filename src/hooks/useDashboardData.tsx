
import { useState, useEffect, useCallback } from "react";
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

  // Optimize the profile fetching
  const fetchProfile = useCallback(async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    return data;
  }, [user]);

  // Optimize the articles fetching
  const fetchMyArticles = useCallback(async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, cover_image, published_at, created_at, 
        read_time, tags, likes, comments,
        author:profiles(id, full_name, username, avatar_url)
      `)
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10); // Limit to improve performance
    
    if (error || !data) {
      console.error("Error fetching articles:", error);
      return [];
    }
    
    return data.map(article => ({
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
  }, [user]);

  // Optimize bookmarks fetching
  const fetchBookmarkedArticles = useCallback(async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        article_id,
        articles!inner(
          id, title, excerpt, cover_image, published_at, created_at,
          read_time, tags, likes, comments,
          profiles(id, full_name, username, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      .limit(10); // Limit to improve performance
    
    if (error || !data) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }
    
    return data.map(bookmark => {
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
  }, [user]);

  // Optimize likes fetching
  const fetchLikedArticles = useCallback(async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('article_likes')
      .select(`
        article_id,
        articles!inner(
          id, title, excerpt, cover_image, published_at, created_at,
          read_time, tags, likes, comments,
          profiles(id, full_name, username, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      .limit(10); // Limit to improve performance
    
    if (error || !data) {
      console.error("Error fetching likes:", error);
      return [];
    }
    
    return data.map(like => {
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
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch all data in parallel for better performance
        const [profileData, myArticlesData, bookmarksData, likesData] = await Promise.all([
          fetchProfile(),
          fetchMyArticles(),
          fetchBookmarkedArticles(),
          fetchLikedArticles()
        ]);
        
        setProfile(profileData);
        setMyArticles(myArticlesData);
        setBookmarkedArticles(bookmarksData);
        setLikedArticles(likesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, fetchProfile, fetchMyArticles, fetchBookmarkedArticles, fetchLikedArticles]);

  return {
    profile,
    myArticles,
    bookmarkedArticles,
    likedArticles,
    loading
  };
};

export default useDashboardData;
