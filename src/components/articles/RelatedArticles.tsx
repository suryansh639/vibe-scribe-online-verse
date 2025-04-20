
import { Link } from "react-router-dom";

interface RelatedArticle {
  id: string;
  title: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4">Related Articles</h3>
      <div className="space-y-6">
        {articles.length > 0 ? (
          articles.map(article => (
            <div key={article.id} className="border-b border-gray-100 pb-6">
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
              
              <Link to={`/article/${article.id}`}>
                <h4 className="font-bold mb-2 hover:text-brand-orange transition-colors">
                  {article.title}
                </h4>
              </Link>
              
              {article.coverImage && (
                <Link to={`/article/${article.id}`}>
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                </Link>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No related articles found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedArticles;
