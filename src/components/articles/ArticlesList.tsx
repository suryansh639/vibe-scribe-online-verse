
import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

// Lazy load ArticleCard for better performance
const ArticleCard = lazy(() => import("@/components/articles/ArticleCard"));

interface ArticlesListProps {
  articles: ArticleDetailData[];
  loading: boolean;
  tagFilter?: string | null;
  searchFilter?: string | null;
  clearSearch: () => void;
}

const ArticlesList = ({
  articles,
  loading,
  tagFilter,
  searchFilter,
  clearSearch
}: ArticlesListProps) => {
  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-6">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
            <Skeleton className="hidden md:block h-32 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold mb-2">No articles found</h3>
        <p className="text-gray-600">
          {tagFilter
            ? `No articles with the tag "${tagFilter}" were found.`
            : searchFilter
            ? `No articles match your search for "${searchFilter}".`
            : "No articles are available."}
        </p>
        {(tagFilter || searchFilter) && (
          <Button onClick={clearSearch} className="mt-4">
            View all articles
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map(article => (
        <Suspense 
          key={article.id}
          fallback={
            <div className="border-b border-gray-200 py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <ArticleCard 
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            coverImage={article.coverImage}
            author={article.author}
            publishedAt={article.publishedAt}
            readTime={article.readTime}
            tags={article.tags}
            likes={article.likes}
            comments={article.comments}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default ArticlesList;
