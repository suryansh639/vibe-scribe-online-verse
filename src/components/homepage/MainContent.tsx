
import { Suspense, lazy, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load components for better performance
const ArticleCard = lazy(() => import("@/components/articles/ArticleCard"));

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

interface MainContentProps {
  articles: Article[];
  loading: boolean;
}

const MainContent = ({ articles, loading }: MainContentProps) => {
  const { user } = useAuth();
  
  // Get the other articles (non-featured)
  const otherArticles = articles.filter(article => !article.featured);

  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="latest">
        <div className="flex justify-between items-center mb-6">
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
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ))}
            </div>
          ) : otherArticles.length > 0 ? (
            <Suspense fallback={
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ))}
              </div>
            }>
              <div>
                {otherArticles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            </Suspense>
          ) : (
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
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ))}
            </div>
          ) : otherArticles.length > 0 ? (
            <Suspense fallback={
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ))}
              </div>
            }>
              <div>
                {/* For demo, we'll use the same articles but sorted by likes */}
                {[...otherArticles]
                  .sort((a, b) => b.likes - a.likes)
                  .map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
              </div>
            </Suspense>
          ) : (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainContent;
