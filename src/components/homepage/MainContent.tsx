
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
  
  // Display articles in a grid for better visual presentation
  const renderArticleGrid = (articlesList: Article[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articlesList.map(article => (
          <Suspense 
            key={article.id}
            fallback={
              <div className="border border-gray-200 rounded-lg p-4 flex justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
              {article.coverImage && (
                <Link to={`/article/${article.id}`} className="block h-40 overflow-hidden">
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                    {article.author.avatar ? (
                      <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white text-xs">
                        {article.author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <Link to={`/profile/${article.author.id}`} className="text-sm font-medium hover:text-brand-orange">
                    {article.author.name}
                  </Link>
                </div>
                
                <Link to={`/article/${article.id}`} className="block mb-2">
                  <h3 className="text-lg font-bold hover:text-brand-orange transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {article.tags.slice(0, 2).map(tag => (
                    <Link
                      key={tag}
                      to={`/tag/${tag}`}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Suspense>
        ))}
      </div>
    );
  };

  return (
    <div className="lg:col-span-2">
      {/* Display some articles before the tabs section */}
      {!loading && otherArticles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          {renderArticleGrid(otherArticles.slice(0, 4))}
        </div>
      )}
      
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
