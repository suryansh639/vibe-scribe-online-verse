
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load components for better performance
const FeaturedArticle = lazy(() => import("@/components/articles/FeaturedArticle"));

interface Article {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  featured?: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;
  comments: number;
}

interface FeaturedArticleSectionProps {
  article: Article | undefined;
  loading: boolean;
}

const FeaturedArticleSection = ({ article, loading }: FeaturedArticleSectionProps) => {
  const { user } = useAuth();
  
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold mb-8">Featured Story</h2>
      
      {loading ? (
        <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : article ? (
        <Suspense fallback={
          <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <FeaturedArticle {...article} />
        </Suspense>
      ) : (
        <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64 text-center">
          <div>
            <p className="text-lg font-medium mb-2">No featured articles yet</p>
            {user && (
              <Link to="/new-story">
                <Button size="sm" className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                  Write the first featured article
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedArticleSection;
