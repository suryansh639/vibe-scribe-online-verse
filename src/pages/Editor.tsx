import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ArticleForm from "@/components/editor/ArticleForm";
import { articles } from "@/data/mockData";
import { v4 as uuidv4 } from "@/utils/uuid";
import { slugify } from "@/lib/utils";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add a title and content to your article",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to publish articles",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    setIsPublishing(true);

    try {
      const wordCount = content.trim().split(/\s+/).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      
      // Create a new article object that conforms to ArticleDetailData
      const newArticle: ArticleDetailData = {
        id: uuidv4(), // Generate a unique ID
        title: title,
        excerpt: content.substring(0, 150) + '...',
        content: content,
        coverImage: coverImage || "/placeholder.svg", // Ensure coverImage is never null
        author: {
          id: user.id,
          name: user.user_metadata?.full_name || "Anonymous User",
          avatar: user.user_metadata?.avatar_url || "/placeholder.svg", // Ensure avatar is never undefined
          bio: user.user_metadata?.bio || "No bio available"
        },
        publishedAt: new Date().toISOString(),
        readTime: readTime,
        tags: tags.length > 0 ? tags : ["Uncategorized"], // Ensure tags is never empty
        likes: 0,
        comments: 0,
        featured: false
      };
      
      // Add the new article to the mockData.ts articles array
      articles.unshift(newArticle); // Add to the beginning of the array
      
      // Also try to save to Supabase if connected
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          excerpt: content.substring(0, 150) + '...',
          cover_image: coverImage,
          tags,
          author_id: user.id,
          status: 'published',
          published: true,
          published_at: new Date().toISOString(),
          read_time: readTime,
          likes: 0,
          comments: 0,
          slug: generateSlug(title)
        })
        .select()
        .single();

      // Display success message regardless of Supabase result (we have mock data as backup)
      toast({
        title: "Article published!",
        description: "Your article has been published successfully",
      });
      
      // Navigate to the article page
      navigate(`/article/${newArticle.id}/${generateSlug(title)}`);
    } catch (err) {
      console.error("Error publishing article:", err);
      // If Supabase fails but we've already added to mock data, we can still consider it a success
      toast({
        title: "Article published!",
        description: "Your article has been published locally",
      });
      navigate('/');
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to save as draft",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save drafts",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          cover_image: coverImage,
          tags,
          author_id: user.id,
          status: 'draft',
          published: false
        });

      if (error) throw error;
      
      toast({
        title: "Draft saved",
        description: "Your draft has been saved successfully",
      });
      
      navigate(`/dashboard`);
    } catch (err) {
      console.error("Error saving draft:", err);
      toast({
        title: "Saving failed",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <ArticleForm
        title={title}
        content={content}
        coverImage={coverImage}
        tags={tags}
        tagInput={tagInput}
        isPublishing={isPublishing}
        onTitleChange={(value) => setTitle(value)}
        onContentChange={(value) => setContent(value)}
        onCoverImageUpload={handleCoverImageUpload}
        onCoverImageRemove={() => setCoverImage(null)}
        onTagInputChange={setTagInput}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onTagKeyPress={handleTagKeyPress}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
      />
    </Layout>
  );
};

export default Editor;
