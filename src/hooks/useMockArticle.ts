
import { useState, useEffect } from "react";
import { findMockArticleById, getRelatedArticlesFromMock, getPopularTagsFromMock } from "@/utils/articleUtils";
import { ArticleDetailData, RelatedArticle } from "./types/articleTypes";

export const useMockArticle = (id: string) => {
  const [article, setArticle] = useState<ArticleDetailData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFromMockData = () => {
      console.log("Fetching from mock data for ID:", id);
      
      const mockArticle = findMockArticleById(id);
      
      if (mockArticle) {
        console.log("Found in mock data:", mockArticle);
        setArticle(mockArticle);
        
        // Set related articles from mock data
        setRelatedArticles(getRelatedArticlesFromMock(id));
        
        // Set popular tags from mock data
        setPopularTags(getPopularTagsFromMock());
        
        return true;
      } else {
        setError("Article not found in mock data");
        return false;
      }
    };

    fetchFromMockData();
  }, [id]);

  return { article, relatedArticles, popularTags, error };
};
