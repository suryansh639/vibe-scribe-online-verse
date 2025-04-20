
import { Link } from "react-router-dom";

interface ArticleContentProps {
  content: string;
  excerpt?: string;
  tags?: string[];
}

const ArticleContent = ({ content, excerpt, tags }: ArticleContentProps) => {
  return (
    <>
      <div className="prose prose-lg max-w-none mb-8">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
        ) : (
          <p className="text-lg">{excerpt}</p>
        )}
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/all-articles?tag=${tag}`}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default ArticleContent;
