
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ArticleForm from "@/components/editor/ArticleForm";
import { v4 as uuidv4 } from "@/utils/uuid";
import { slugify } from "@/lib/utils";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
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
      setCoverImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };
  
  const generateSlug = (title: string) => {
    return slugify(title);
  };

  const uploadCoverImage = async (file: File, articleId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${articleId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('blogcompany')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading cover image:', error);
        return null;
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('blogcompany')
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadCoverImage:', error);
      return null;
    }
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
      const articleId = uuidv4();
      const wordCount = content.trim().split(/\s+/).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      const slug = generateSlug(title);
      
      // Upload cover image to Supabase storage if provided
      let coverImageUrl = null;
      if (coverImageFile) {
        coverImageUrl = await uploadCoverImage(coverImageFile, articleId);
      }
      
      // Prepare article data
      const articleData = {
        id: articleId,
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        cover_image: coverImageUrl || "/placeholder.svg",
        author_id: user.id,
        status: 'published',
        published: true,
        published_at: new Date().toISOString(),
        read_time: readTime,
        likes: 0,
        comments: 0,
        featured: false,
        tags,
        slug
      };
      
      // Insert article into Supabase database
      const { data: article, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      if (error) {
        console.error("Error publishing to Supabase:", error);
        throw error;
      }
      
      // For backup/fallback, also save to localStorage
      const newArticle: ArticleDetailData = {
        id: articleId,
        title: title,
        excerpt: content.substring(0, 150) + '...',
        content: content,
        coverImage: coverImageUrl || "/placeholder.svg",
        author: {
          id: user.id,
          name: user.user_metadata?.full_name || "Anonymous User",
          avatar: user.user_metadata?.avatar_url || "/placeholder.svg",
          bio: user.user_metadata?.bio || "No bio available"
        },
        publishedAt: new Date().toISOString(),
        readTime: readTime,
        tags: tags.length > 0 ? tags : ["Uncategorized"],
        likes: 0,
        comments: 0,
        featured: false
      };
      
      // Store in localStorage as backup
      const storedArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
      storedArticles.unshift(newArticle);
      localStorage.setItem('userArticles', JSON.stringify(storedArticles));
      
      toast({
        title: "Article published!",
        description: "Your article has been published successfully",
      });
      
      // Navigate to the article page
      navigate(`/article/${articleId}/${slug}`);
    } catch (err) {
      console.error("Error publishing article:", err);
      toast({
        title: "Publishing failed",
        description: "There was an error publishing your article. Please try again.",
        variant: "destructive",
      });
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
      const articleId = uuidv4();
      let coverImageUrl = null;
      
      // Upload cover image if available
      if (coverImageFile) {
        coverImageUrl = await uploadCoverImage(coverImageFile, articleId);
      }
      
      const { error } = await supabase
        .from('articles')
        .insert({
          id: articleId,
          title,
          content,
          excerpt: content ? content.substring(0, 150) + '...' : '',
          cover_image: coverImageUrl,
          tags,
          author_id: user.id,
          status: 'draft',
          published: false,
          slug: generateSlug(title)
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
        onCoverImageRemove={() => {
          setCoverImage(null);
          setCoverImageFile(null);
        }}
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
