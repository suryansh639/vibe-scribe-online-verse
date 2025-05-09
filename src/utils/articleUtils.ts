
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
    excerpt: mockArticle.excerpt || mockArticle.content?.substring(0, 150) + "..." || "", // Ensure excerpt is always defined
    coverImage: mockArticle.coverImage,
    publishedAt: mockArticle.publishedAt,
    readTime: mockArticle.readTime,
    tags: mockArticle.tags,
    likes: mockArticle.likes,
    comments: mockArticle.comments,
    featured: mockArticle.featured,
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
