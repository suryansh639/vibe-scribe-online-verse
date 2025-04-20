
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, Trash2, Loader2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  published_at: string;
  likes: number;
  author: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

interface CommentsListProps {
  articleId: string;
  refreshTrigger: number;
}

const CommentsList = ({ articleId, refreshTrigger }: CommentsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            *,
            author:profiles(id, full_name, username, avatar_url)
          `)
          .eq("article_id", articleId)
          .order("published_at", { ascending: false });
          
        if (error) throw error;
        
        setComments(data as Comment[]);
        
        // If user is logged in, check which comments they've liked
        if (user) {
          const { data: likedData, error: likedError } = await supabase
            .from("comment_likes")
            .select("comment_id")
            .eq("user_id", user.id);
            
          if (!likedError && likedData) {
            const likes = likedData.reduce((acc: Record<string, boolean>, like) => {
              acc[like.comment_id] = true;
              return acc;
            }, {});
            
            setLikedComments(likes);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [articleId, user, refreshTrigger, toast]);
  
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }
    
    setActionLoading(commentId);
    
    try {
      if (likedComments[commentId]) {
        // Unlike comment
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", commentId);
          
        if (error) throw error;
        
        // Update local state
        setLikedComments(prev => ({ ...prev, [commentId]: false }));
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: Math.max(0, (comment.likes || 0) - 1) } 
              : comment
          )
        );
      } else {
        // Like comment
        const { error } = await supabase
          .from("comment_likes")
          .insert({
            user_id: user.id,
            comment_id: commentId,
          });
          
        if (error) throw error;
        
        // Update local state
        setLikedComments(prev => ({ ...prev, [commentId]: true }));
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: (comment.likes || 0) + 1 } 
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast({
        title: "Action failed",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    setActionLoading(commentId);
    
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("author_id", user.id);
        
      if (error) throw error;
      
      // Remove from local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="border-b border-gray-100 pb-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar_url} alt={comment.author.full_name || comment.author.username} />
                <AvatarFallback className="bg-brand-orange text-white">
                  {(comment.author.full_name || comment.author.username || 'A').charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <Link to={`/profile/${comment.author.id}`} className="font-medium hover:text-brand-orange">
                      {comment.author.full_name || comment.author.username || 'Anonymous'}
                    </Link>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(comment.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {user && comment.author.id === user.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-500 h-auto p-1"
                          disabled={actionLoading === comment.id}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                
                <p className="text-gray-800 mb-2">{comment.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-gray-500 h-auto p-1 ${likedComments[comment.id] ? 'text-brand-orange' : ''}`}
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={actionLoading === comment.id}
                  >
                    {actionLoading === comment.id ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <ThumbsUp 
                        size={16} 
                        className="mr-1" 
                        fill={likedComments[comment.id] ? "currentColor" : "none"}
                      />
                    )}
                    <span className="text-xs">{comment.likes || 0}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentsList;
