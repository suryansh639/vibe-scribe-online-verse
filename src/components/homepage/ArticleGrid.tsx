
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { slugify } from "@/lib/utils";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

// Lazy load components for better performance
const ArticleCard = lazy(() => import("@/components/articles/ArticleCard"));

interface ArticleGridProps {
  articles: ArticleDetailData[];
}

const ArticleGrid = ({ articles }: ArticleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map(article => (
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
              <Link 
                to={`/article/${article.id}/${slugify(article.title)}`}
                className="block h-40 overflow-hidden"
              >
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
              
              <Link 
                to={`/article/${article.id}/${slugify(article.title)}`}
                className="block mb-2"
              >
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

export default ArticleGrid;
