
import { articles } from "@/data/mockData";
import { ArticleDetailData, RelatedArticle } from "@/hooks/types/articleTypes";

/**
 * Check if a string is a valid UUID
 */
export const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

/**
 * Find an article in mock data by its ID
 */
export const findMockArticleById = (id: string): ArticleDetailData | null => {
  const mockArticle = articles.find(article => article.id === id);
  
  if (!mockArticle) {
    return null;
  }
  
  return {
    id: mockArticle.id,
    title: mockArticle.title,
    content: mockArticle.content || "",
    excerpt: mockArticle.excerpt || mockArticle.content?.substring(0, 150) + "..." || "", 
    coverImage: mockArticle.coverImage || "/placeholder.svg", // Provide default value
    publishedAt: mockArticle.publishedAt || new Date().toISOString(), // Provide default value
    readTime: mockArticle.readTime || "5 min read",
    tags: mockArticle.tags || [],
    likes: mockArticle.likes || 0,
    comments: mockArticle.comments || 0,
    featured: mockArticle.featured || false, // Ensure featured always has a value
    author: mockArticle.author || {
      id: "mock-author",
      name: "Mock Author",
      avatar: "/placeholder.svg",
      bio: "This is a mock author bio for demonstration purposes."
    }
  };
};

/**
 * Get related articles from mock data
 */
export const getRelatedArticlesFromMock = (articleId: string): RelatedArticle[] => {
  return articles
    .filter(article => article.id !== articleId)
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
    }));
};

/**
 * Extract popular tags from mock articles
 */
export const getPopularTagsFromMock = (): string[] => {
  const allTags = articles.flatMap(article => article.tags || []);
  const uniqueTags = [...new Set(allTags)] as string[];
  return uniqueTags.slice(0, 12);
};
