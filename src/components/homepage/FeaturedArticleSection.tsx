
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

// Lazy load components for better performance
const FeaturedArticle = lazy(() => import("@/components/articles/FeaturedArticle"));

interface FeaturedArticleSectionProps {
  article: ArticleDetailData | undefined;
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
          <FeaturedArticle 
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            coverImage={article.coverImage}
            author={article.author}
            publishedAt={article.publishedAt}
            readTime={article.readTime}
            tags={article.tags}
            likes={article.likes || 0}
            comments={article.comments || 0}
          />
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
