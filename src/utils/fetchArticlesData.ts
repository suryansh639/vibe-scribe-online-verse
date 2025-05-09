
import { supabase } from "@/integrations/supabase/client";
import { ArticleDetailData, RelatedArticle } from "@/hooks/types/articleTypes";

/**
 * Fetch all published articles from Supabase
 */
export const fetchArticlesFromSupabase = async (): Promise<ArticleDetailData[]> => {
  try {
    const { data: articlesData, error } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        content,
        excerpt,
        cover_image,
        published_at,
        created_at,
        read_time,
        tags,
        likes,
        comments,
        featured,
        author_id,
        profiles!articles_author_id_fkey(id, full_name, username, avatar_url, bio)
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles from Supabase:", error);
      return [];
    }

    if (!articlesData || articlesData.length === 0) {
      return [];
    }

    // Transform Supabase data to match our ArticleDetailData type
    const formattedArticles = articlesData.map(article => ({
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
        id: article.profiles?.id || "unknown",
        name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
        avatar: article.profiles?.avatar_url || "/placeholder.svg",
        bio: article.profiles?.bio || ""
      }
    }));

    return formattedArticles;
  } catch (err) {
    console.error("Error in fetchArticlesFromSupabase:", err);
    return [];
  }
};

/**
 * Fetch featured articles from Supabase
 */
export const fetchFeaturedArticlesFromSupabase = async (): Promise<ArticleDetailData[]> => {
  try {
    const { data: articlesData, error } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        content,
        excerpt,
        cover_image,
        published_at,
        created_at,
        read_time,
        tags,
        likes,
        comments,
        featured,
        author_id,
        profiles!articles_author_id_fkey(id, full_name, username, avatar_url, bio)
      `)
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured articles from Supabase:", error);
      return [];
    }

    if (!articlesData || articlesData.length === 0) {
      return [];
    }

    // Transform Supabase data to match our ArticleDetailData type
    const formattedArticles = articlesData.map(article => ({
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
        id: article.profiles?.id || "unknown",
        name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
        avatar: article.profiles?.avatar_url || "/placeholder.svg",
        bio: article.profiles?.bio || ""
      }
    }));

    return formattedArticles;
  } catch (err) {
    console.error("Error in fetchFeaturedArticlesFromSupabase:", err);
    return [];
  }
};

/**
 * Get popular tags from all articles
 */
export const fetchPopularTagsFromSupabase = async (): Promise<string[]> => {
  try {
    const { data: tagsData, error } = await supabase
      .from("articles")
      .select("tags")
      .eq("status", "published");

    if (error) {
      console.error("Error fetching tags:", error);
      return [];
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

      return sortedTags;
    }

    return [];
  } catch (error) {
    console.error("Error in fetchPopularTagsFromSupabase:", error);
    return [];
  }
};
