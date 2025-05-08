
import { articles } from "@/data/mockData";
import { findMockArticleById, getRelatedArticlesFromMock, getPopularTagsFromMock } from "@/utils/articleUtils";
import { ArticleDetailData, RelatedArticle } from "./types/articleTypes";

export const useMockArticle = (id: string) => {
  console.log("Fetching mock article with ID:", id);
  
  try {
    const article = findMockArticleById(id);
    
    if (!article) {
      console.log("Mock article not found for ID:", id);
      return { 
        article: null, 
        relatedArticles: [], 
        popularTags: [], 
        error: "Article not found in mock data" 
      };
    }
    
    console.log("Found mock article:", article.title);
    
    // Get related articles
    const relatedArticles = getRelatedArticlesFromMock(id);
    
    // Get popular tags
    const popularTags = getPopularTagsFromMock();
    
    return {
      article,
      relatedArticles,
      popularTags,
      error: null
    };
  } catch (error) {
    console.error("Error in useMockArticle:", error);
    return {
      article: null,
      relatedArticles: [],
      popularTags: [],
      error: "An error occurred while fetching the article from mock data"
    };
  }
};
