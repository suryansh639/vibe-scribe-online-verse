
import { useState, useEffect } from "react";
import { isValidUUID } from "@/utils/articleUtils";
import { useSupabaseArticle } from "./useSupabaseArticle";
import { useMockArticle } from "./useMockArticle";
import { UseArticleDetailResult } from "./types/articleTypes";

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
      
      try {
        // Try mock data first for any ID format
        const mockResult = useMockArticle(id);
        
        if (mockResult.article) {
          console.log("Found article in mock data:", mockResult.article.title);
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
        
        // If not found in mock data and it's a valid UUID, try Supabase
        const validUUID = isValidUUID(id);
        if (validUUID) {
          const supabaseResult = useSupabaseArticle(id);
          
          if (supabaseResult.article) {
            console.log("Found article in Supabase:", supabaseResult.article.title);
            setResult({
              article: supabaseResult.article,
              relatedArticles: supabaseResult.relatedArticles || [],
              popularTags: supabaseResult.popularTags || [],
              loading: false,
              error: null
            });
            setLoading(false);
            return;
          }
          
          // Not found in Supabase either
          if (supabaseResult.error) {
            console.error("Supabase error:", supabaseResult.error);
            setResult({
              article: null,
              relatedArticles: [],
              popularTags: [],
              loading: false,
              error: supabaseResult.error
            });
            setLoading(false);
            return;
          }
        } else {
          console.warn("Invalid UUID format:", id);
        }
        
        // If we reach here, the article was not found in either source
        console.error("Article not found in any data source");
        setResult({
          article: null,
          relatedArticles: [],
          popularTags: [],
          loading: false,
          error: "Article not found"
        });
        setLoading(false);
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
