
export interface ArticleAuthor {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ArticleDetailData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;  // Changed from optional to required
  comments: number;  // Changed from optional to required
  featured: boolean;
  author: ArticleAuthor;
}

export interface UseArticleDetailResult {
  article: ArticleDetailData | null;
  relatedArticles: RelatedArticle[];
  popularTags: string[];
  loading: boolean;
  error: string | null;
}
