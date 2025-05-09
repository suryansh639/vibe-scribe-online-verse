
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
    excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
    coverImage: article.coverImage || "/placeholder.svg", // Provide default value
    publishedAt: article.publishedAt || new Date().toISOString(), // Provide default value
    readTime: article.readTime || "5 min read", // Ensure readTime always has a value
    tags: article.tags || [],
    likes: article.likes || 0,
    comments: article.comments || 0,
    featured: article.featured || false, // Ensure featured always has a value
    author: article.author || {
      id: "mock-author",
      name: "Mock Author",
      avatar: "/placeholder.svg",
      bio: "This is a mock author bio for demonstration purposes."
    }
  };
  
  return {
    article: completeArticle,
    relatedArticles,
    popularTags,
    error: null
  };
};
