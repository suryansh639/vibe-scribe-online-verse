
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import { slugify } from "@/lib/utils";

// Types
export interface ArticleProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
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

const ArticleCard = ({
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
  // Use the article interactions hook
  const { 
    isLiked, 
    isBookmarked, 
    likesCount, 
    loading, 
    toggleLike, 
    toggleBookmark 
  } = useArticleInteractions({ articleId: id });

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  // Create slug for article URL
  const titleSlug = slugify(title);
  const articleUrl = `/article/${id}/${titleSlug}`;

  return (
    <article className="border-b border-gray-200 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white text-xs">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <Link to={`/profile/${author.id}`} className="text-sm font-medium hover:text-brand-orange">
              {author.name}
            </Link>
            <span className="text-gray-500 text-xs">·</span>
            <span className="text-gray-500 text-xs">{formattedDate}</span>
            <span className="text-gray-500 text-xs">·</span>
            <span className="text-gray-500 text-xs">{readTime}</span>
          </div>
          
          <a href={articleUrl} target="_blank" rel="noopener noreferrer">
            <h2 className="text-xl font-bold mb-2 hover:text-brand-orange transition-colors">
              {title}
            </h2>
          </a>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  to={`/tag/${tag}`}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-gray-500 hover:text-brand-orange p-1 h-auto",
                  isLiked && "text-red-500 hover:text-red-600"
                )}
                onClick={toggleLike}
                disabled={loading === "like"}
              >
                <Heart size={18} className="mr-1" fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs">{likesCount || likes}</span>
              </Button>
              <a href={articleUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-orange p-1 h-auto">
                  <MessageSquare size={18} className="mr-1" />
                  <span className="text-xs">{comments}</span>
                </Button>
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-gray-500 hover:text-brand-orange p-1 h-auto",
                  isBookmarked && "text-brand-orange hover:text-brand-orangeDark"
                )}
                onClick={toggleBookmark}
                disabled={loading === "bookmark"}
              >
                <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>
        
        {coverImage && (
          <div className="md:w-1/4">
            <a href={articleUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-32 md:h-24 lg:h-32 object-cover rounded"
              />
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
