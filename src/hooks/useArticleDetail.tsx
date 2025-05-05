
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { articles } from "@/data/mockData";

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ArticleDetailData {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  readTime?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  author: ArticleAuthor;
}

export const useArticleDetail = (id: string | undefined) => {
  const [article, setArticle] = useState<ArticleDetailData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        console.log("Fetching article with ID:", id);
        
        // First try to get the article from Supabase
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
        } else if (!data) {
          console.log("No article found in Supabase, checking mock data");
          
          // If not found in Supabase, check mock data
          const mockArticle = articles.find(article => article.id === id);
          
          if (mockArticle) {
            console.log("Found in mock data:", mockArticle);
            
            // Make sure we satisfy the ArticleDetailData interface
            const articleData: ArticleDetailData = {
              id: mockArticle.id,
              title: mockArticle.title,
              content: mockArticle.content || "", // Ensure content is always provided
              excerpt: mockArticle.excerpt,
              coverImage: mockArticle.coverImage,
              publishedAt: mockArticle.publishedAt,
              readTime: mockArticle.readTime,
              tags: mockArticle.tags,
              likes: mockArticle.likes,
              comments: mockArticle.comments,
              author: mockArticle.author || {
                id: "mock-author",
                name: "Mock Author",
                avatar: "/placeholder.svg",
                bio: "This is a mock author bio for demonstration purposes."
              }
            };
            
            setArticle(articleData);
            
            // Set related articles from mock data
            setRelatedArticles(
              articles
                .filter(article => article.id !== id)
                .slice(0, 3)
                .map(article => ({
                  id: article.id,
                  title: article.title,
                  coverImage: article.coverImage,
                  author: article.author || {
                    id: "mock-author",
                    name: "Mock Author",
                    avatar: "/placeholder.svg"
                  }
                }))
            );
            
            // Set popular tags from mock data
            const allTags = articles.flatMap(article => article.tags || []);
            const uniqueTags = [...new Set(allTags)] as string[];
            setPopularTags(uniqueTags.slice(0, 12));
            
            setLoading(false);
            return;
          } else {
            setError("Article not found");
          }
        } else {
          // Article found in Supabase
          console.log("Article found in Supabase:", data);
          
          const articleData: ArticleDetailData = {
            id: data.id,
            title: data.title,
            content: data.content || "", // Ensure content is always provided
            excerpt: data.excerpt,
            coverImage: data.cover_image,
            publishedAt: data.published_at || data.created_at,
            readTime: data.read_time || "5 min read",
            tags: data.tags,
            likes: data.likes || 0,
            comments: data.comments || 0,
            author: {
              id: data.author.id,
              name: data.author.full_name || data.author.username || "Anonymous",
              avatar: data.author.avatar_url,
              bio: data.author.bio
            }
          };
          
          setArticle(articleData);
          
          // Fetch related articles based on tags
          if (data.tags && data.tags.length > 0) {
            try {
              const { data: relatedData, error: relatedError } = await supabase
                .from("articles")
                .select(`
                  id,
                  title,
                  cover_image,
                  profiles!articles_author_id_fkey(id, full_name, username, avatar_url)
                `)
                .neq("id", id)
                .eq("status", "published")
                .overlaps("tags", data.tags)
                .limit(3);
                
              if (relatedError) {
                console.error("Error fetching related articles:", relatedError);
              } else if (relatedData && relatedData.length > 0) {
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
              console.error("Error in related articles fetch:", error);
            }
          }
          
          // Fetch popular tags
          try {
            const { data: tagsData, error: tagsError } = await supabase
              .from("articles")
              .select("tags")
              .eq("status", "published");
              
            if (tagsError) {
              console.error("Error fetching tags:", tagsError);
            } else if (tagsData) {
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
            console.error("Error in tags fetch:", error);
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching article:", error);
        setError("An error occurred while fetching the article");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  return { article, relatedArticles, popularTags, loading, error };
};
