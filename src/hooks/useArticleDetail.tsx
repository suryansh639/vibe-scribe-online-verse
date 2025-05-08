
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
