
import { useState, useEffect } from "react";
import { isValidUUID } from "@/utils/articleUtils";
import { useMockArticle } from "./useMockArticle";
import { useSupabaseArticle } from "./useSupabaseArticle";
import { UseArticleDetailResult } from "./types/articleTypes";
import { articles } from "@/data/mockData";

// Export types directly from the types file
export type { ArticleAuthor, RelatedArticle, ArticleDetailData } from "./types/articleTypes";

export const useArticleDetail = (id: string | undefined): UseArticleDetailResult => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<UseArticleDetailResult>({
    article: null,
    relatedArticles: [],
    popularTags: [],
    loading: true,
    error: null
  });
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setResult({
          article: null,
          relatedArticles: [],
          popularTags: [],
          loading: false,
          error: "Article ID is missing"
        });
        setLoading(false);
        return;
      }
      
      console.log("Attempting to fetch article with ID:", id);
      
      // First, try to get the article from mock data
      const mockResult = useMockArticle(id);
      
      if (mockResult.article) {
        console.log("Successfully found article in mock data:", mockResult.article.title);
        setResult({
          article: mockResult.article,
          relatedArticles: mockResult.relatedArticles || [],
          popularTags: mockResult.popularTags || [],
          loading: false,
          error: null
        });
        setLoading(false);
        return;
      }
      
      console.log("Article not found in mock data, searching by ID directly in articles array");
      
      // Try to find the article directly in the articles array (fallback)
      const directArticle = articles.find(article => article.id === id);
      
      if (directArticle) {
        console.log("Found article directly in articles array:", directArticle.title);
        
        setResult({
          article: {
            id: directArticle.id,
            title: directArticle.title,
            content: directArticle.content || "",
            excerpt: directArticle.excerpt || directArticle.content?.substring(0, 150) + "..." || "",
            coverImage: directArticle.coverImage || "/placeholder.svg",
            publishedAt: directArticle.publishedAt || new Date().toISOString(),
            readTime: directArticle.readTime || "5 min read",
            tags: directArticle.tags || [], // Ensure tags always has a value (empty array if undefined)
            likes: directArticle.likes || 0,
            comments: directArticle.comments || 0,
            featured: directArticle.featured || false,
            author: directArticle.author || {
              id: "mock-author",
              name: "Mock Author",
              avatar: "/placeholder.svg",
              bio: "This is a mock author bio for demonstration purposes."
            }
          },
          relatedArticles: articles
            .filter(a => a.id !== id)
            .slice(0, 3)
            .map(a => ({
              id: a.id,
              title: a.title,
              coverImage: a.coverImage,
              author: a.author || {
                id: "mock-author",
                name: "Mock Author",
                avatar: "/placeholder.svg"
              }
            })),
          popularTags: [...new Set(articles.flatMap(a => a.tags || []))].slice(0, 12),
          loading: false,
          error: null
        });
        
        setLoading(false);
        return;
      }
      
      // If not found in mock data and it's a valid UUID, try Supabase
      if (isValidUUID(id)) {
        console.log("Article not found in mock data, trying Supabase");
        const supabaseResult = useSupabaseArticle(id);
        
        if (supabaseResult.article) {
          console.log("Found article in Supabase");
          setResult({
            article: supabaseResult.article,
            relatedArticles: supabaseResult.relatedArticles || [],
            popularTags: supabaseResult.popularTags || [],
            loading: false,
            error: null
          });
        } else {
          // Not found in Supabase either
          console.error("Article not found in any data source");
          setResult({
            article: null,
            relatedArticles: [],
            popularTags: [],
            loading: false,
            error: supabaseResult.error || "Article not found"
          });
        }
      } else {
        // Not a valid UUID, and not found in mock data
        console.error("Article not found in mock data and ID is not a valid UUID");
        setResult({
          article: null,
          relatedArticles: [],
          popularTags: [],
          loading: false,
          error: "Article not found"
        });
      }
      
      setLoading(false);
    };
    
    fetchArticle();
  }, [id]);
  
  return { ...result, loading };
};
