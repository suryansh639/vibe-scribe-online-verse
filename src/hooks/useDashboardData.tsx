import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArticleListItem } from "@/components/articles/ArticleCard";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useDashboardData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myArticles, setMyArticles] = useState<ArticleListItem[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<ArticleListItem[]>([]);
  const [likedArticles, setLikedArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    return data;
  }, [user]);

  // Fetch articles authored by the user
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
      .order('created_at', { ascending: false });
    
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

  // Fetch bookmarked articles
  const fetchBookmarkedArticles = useCallback(async () => {
    if (!user) return [];
    
    // First get all bookmark IDs
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('article_id')
      .eq('user_id', user.id);
    
    if (bookmarksError || !bookmarks || bookmarks.length === 0) {
      console.error("Error fetching bookmarks or no bookmarks found:", bookmarksError);
      return [];
    }
    
    // Get the article IDs from bookmarks
    const articleIds = bookmarks.map(bookmark => bookmark.article_id);
    
    // Fetch the full article data using those IDs
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, cover_image, published_at, created_at, 
        read_time, tags, likes, comments,
        profiles!articles_author_id_fkey(id, full_name, username, avatar_url)
      `)
      .in('id', articleIds);
    
    if (articlesError || !articles) {
      console.error("Error fetching bookmarked articles:", articlesError);
      return [];
    }
    
    return articles.map(article => ({
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
  }, [user]);

  // Fetch liked articles
  const fetchLikedArticles = useCallback(async () => {
    if (!user) return [];
    
    // First get all article IDs the user has liked
    const { data: likes, error: likesError } = await supabase
      .from('article_likes')
      .select('article_id')
      .eq('user_id', user.id);
    
    if (likesError || !likes || likes.length === 0) {
      console.error("Error fetching likes or no likes found:", likesError);
      return [];
    }
    
    // Get the article IDs from likes
    const articleIds = likes.map(like => like.article_id);
    
    // Fetch the full article data using those IDs
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, cover_image, published_at, created_at, 
        read_time, tags, likes, comments,
        profiles!articles_author_id_fkey(id, full_name, username, avatar_url)
      `)
      .in('id', articleIds);
    
    if (articlesError || !articles) {
      console.error("Error fetching liked articles:", articlesError);
      return [];
    }
    
    return articles.map(article => ({
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
    
    // Set up a subscription to refresh data when auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchData();
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
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
