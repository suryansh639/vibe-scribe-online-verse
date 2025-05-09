
import { articles } from "@/data/mockData";
import { findMockArticleById, getRelatedArticlesFromMock, getPopularTagsFromMock } from "@/utils/articleUtils";
import { ArticleDetailData, RelatedArticle } from "./types/articleTypes";

export const useMockArticle = (id: string) => {
  console.log("Fetching mock article with ID:", id);
  
  // First try to find the article in our mock data directly
  let article = articles.find(article => article.id === id);
  
  // If not found, try using the helper function that might have additional logic
  if (!article) {
    article = findMockArticleById(id);
  }
  
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
  
  // Ensure the article has all required properties
  const completeArticle: ArticleDetailData = {
    id: article.id,
    title: article.title,
    content: article.content || "",
    excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "", // Ensure excerpt is always defined
    coverImage: article.coverImage,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    tags: article.tags,
    likes: article.likes,
    comments: article.comments,
    featured: article.featured,
    author: article.author
  };
  
  return {
    article: completeArticle,
    relatedArticles,
    popularTags,
    error: null
  };
};
