
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

// Lazy load components for better performance
const ArticleCard = lazy(() => import("@/components/articles/ArticleCard"));

interface ArticleTabsProps {
  articles: ArticleDetailData[];
  loading: boolean;
}

const ArticleTabs = ({ articles, loading }: ArticleTabsProps) => {
  const { user } = useAuth();
  
  return (
    <Tabs defaultValue="latest">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <TabsList>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        <Link to="/all-articles">
          <Button variant="ghost" className="text-brand-orange">View All</Button>
        </Link>
      </div>
      
      <TabsContent value="latest">
        {loading ? (
          <ArticleLoadingState />
        ) : articles.length > 0 ? (
          <Suspense fallback={<ArticleLoadingState />}>
            <div>
              {articles.map(article => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </Suspense>
        ) : (
          <EmptyArticlesState user={user} />
        )}
      </TabsContent>
      
      <TabsContent value="popular">
        {loading ? (
          <ArticleLoadingState />
        ) : articles.length > 0 ? (
          <Suspense fallback={<ArticleLoadingState />}>
            <div>
              {/* For demo, we'll use the same articles but sorted by likes */}
              {[...articles]
                .sort((a, b) => b.likes - a.likes)
                .map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
            </div>
          </Suspense>
        ) : (
          <EmptyArticlesState user={user} />
        )}
      </TabsContent>
    </Tabs>
  );
};

// Helper components for loading and empty states
const ArticleLoadingState = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    ))}
  </div>
);

interface EmptyArticlesStateProps {
  user: any;
}

const EmptyArticlesState = ({ user }: EmptyArticlesStateProps) => (
  <div className="text-center py-12">
    <p className="text-gray-500 mb-4">No articles published yet</p>
    {user && (
      <Link to="/new-story">
        <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
          Write your first article
        </Button>
      </Link>
    )}
  </div>
);

export default ArticleTabs;
