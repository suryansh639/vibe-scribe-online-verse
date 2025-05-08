
import { useState, useEffect } from "react";
import { isValidUUID } from "@/utils/articleUtils";
import { useSupabaseArticle } from "./useSupabaseArticle";
import { useMockArticle } from "./useMockArticle";
import { UseArticleDetailResult } from "./types/articleTypes";

// Change to use 'export type' syntax for TypeScript types
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
      
      console.log("Fetching article with ID:", id);
      
      try {
        // Check if the ID is a valid UUID format for Supabase
        const validUUID = isValidUUID(id);
        
        if (!validUUID) {
          // If it's not a UUID, try to get from mock data
          const { article, relatedArticles, popularTags, error } = useMockArticle(id);
          
          setResult({
            article,
            relatedArticles: relatedArticles || [],
            popularTags: popularTags || [],
            loading: false,
            error: article ? null : (error || "Article not found - Invalid ID format")
          });
          setLoading(false);
          return;
        }
        
        // If it's a valid UUID, try to get from Supabase
        const { article, relatedArticles, popularTags, error } = useSupabaseArticle(id);
        
        if (article) {
          setResult({
            article,
            relatedArticles: relatedArticles || [],
            popularTags: popularTags || [],
            loading: false,
            error: null
          });
          setLoading(false);
          return;
        }
        
        // If not found in Supabase, try mock data as fallback
        if (error) {
          const mockResult = useMockArticle(id);
          
          setResult({
            article: mockResult.article,
            relatedArticles: mockResult.relatedArticles || [],
            popularTags: mockResult.popularTags || [],
            loading: false,
            error: mockResult.article ? null : (mockResult.error || "Article not found")
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error fetching article:", error);
        setResult({
          article: null,
          relatedArticles: [],
          popularTags: [],
          loading: false,
          error: "An error occurred while fetching the article"
        });
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  return { ...result, loading };
};
