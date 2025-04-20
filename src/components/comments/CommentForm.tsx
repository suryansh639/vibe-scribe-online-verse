
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  articleId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ articleId, onCommentAdded }: CommentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on articles",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Comment required",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add comment to database
      const { error } = await supabase
        .from("comments")
        .insert({
          article_id: articleId,
          author_id: user.id,
          content: content.trim(),
        });
        
      if (error) throw error;
      
      // Clear form and notify parent
      setContent("");
      onCommentAdded();
      
      toast({
        title: "Comment posted",
        description: "Your comment has been published successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Comment failed",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Textarea
        placeholder={user ? "Add a comment..." : "Sign in to add a comment"}
        className="mb-3 min-h-[100px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user || loading}
      />
      <Button 
        type="submit"
        className="bg-brand-orange hover:bg-brand-orangeDark text-white"
        disabled={!user || !content.trim() || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Comment"
        )}
      </Button>
    </form>
  );
};

export default CommentForm;
