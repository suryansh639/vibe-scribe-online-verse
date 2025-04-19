
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleProps } from "./ArticleCard";

const FeaturedArticle = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readTime,
  tags,
  likes,
  comments
}: ArticleProps) => {
  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  return (
    <article className="bg-gray-50 rounded-xl overflow-hidden mb-12 lg:grid lg:grid-cols-2 lg:gap-8">
      <div className="h-64 lg:h-full">
        <Link to={`/article/${id}`}>
          <img
            src={coverImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      
      <div className="p-6 lg:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white text-sm">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <Link to={`/profile/${author.id}`} className="text-sm font-medium hover:text-brand-orange">
              {author.name}
            </Link>
            <div className="text-gray-500 text-xs">
              {formattedDate} · {readTime}
            </div>
          </div>
        </div>
        
        <Link to={`/article/${id}`}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 hover:text-brand-orange transition-colors">
            {title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-5 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="text-xs px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-600"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-orange p-1 h-auto">
              <Heart size={18} className="mr-1" />
              <span className="text-xs">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-orange p-1 h-auto">
              <MessageSquare size={18} className="mr-1" />
              <span className="text-xs">{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-orange p-1 h-auto">
              <Bookmark size={18} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
