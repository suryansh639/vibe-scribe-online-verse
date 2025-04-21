
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ArticleActionsProps {
  articleId: string;
  initialLikes: number;
  initialComments: number;
}

const ArticleActions = ({ articleId, initialLikes, initialComments }: ArticleActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isLiked, 
    isBookmarked, 
    likesCount, 
    loading, 
    toggleLike, 
    toggleBookmark 
  } = useArticleInteractions({ articleId });

  const handleBookmarkClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }
    
    await toggleBookmark();
    
    toast({
      title: isBookmarked ? "Bookmark removed" : "Article bookmarked",
      description: isBookmarked 
        ? "Article has been removed from your bookmarks" 
        : "Article has been added to your bookmarks",
    });
  };

  return (
    <div className="flex items-center justify-between mb-10 py-4 border-t border-b border-gray-200">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          onClick={toggleLike}
          disabled={loading === "like"}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{likesCount || initialLikes || 0}</span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
          <MessageSquare size={20} />
          <span>{initialComments || 0}</span>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className={isBookmarked ? 'text-brand-orange' : 'text-gray-600'}
          onClick={handleBookmarkClick}
          disabled={loading === "bookmark"}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Share2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ArticleActions;
