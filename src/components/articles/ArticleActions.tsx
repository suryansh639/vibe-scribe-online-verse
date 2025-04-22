
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ArticleActionsProps {
  articleId: string;
  initialLikes: number;
  initialComments: number;
}

const ArticleActions = ({ articleId, initialLikes, initialComments }: ArticleActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    isLiked, 
    isBookmarked, 
    likesCount, 
    loading, 
    toggleLike, 
    toggleBookmark 
  } = useArticleInteractions({ articleId });

  const handleInteraction = async (type: 'like' | 'bookmark') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to interact with articles",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    if (type === 'like') {
      await toggleLike();
    } else {
      await toggleBookmark();
    }
  };

  return (
    <div className="flex items-center justify-between mb-10 py-4 border-t border-b border-gray-200">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          onClick={() => handleInteraction('like')}
          disabled={loading === "like"}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{typeof likesCount === "number" ? likesCount : initialLikes}</span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
          <MessageSquare size={20} />
          <span>{initialComments}</span>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className={isBookmarked ? 'text-brand-orange' : 'text-gray-600'}
          onClick={() => handleInteraction('bookmark')}
          disabled={loading === "bookmark"}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "Article link copied to clipboard",
            });
          }}
        >
          <Share2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ArticleActions;
