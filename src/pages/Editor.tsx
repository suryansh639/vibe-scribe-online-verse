import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image, X, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Editor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      // In a real app, this would upload to a server
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };
  
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }
    
    setIsPublishing(true);

    try {
      // Use a default like count for new articles. Example: 365.
      const initialLikes = 365;

      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          cover_image: coverImage,
          tags,
          author_id: user?.id,
          status: 'published', // Now published
          excerpt: content.substring(0, 200) + '...',
          likes: initialLikes,
          comments: 0,
          published: true
        })
        .select()
        .single();

      if (error) throw error;
      
      navigate(`/dashboard`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleSaveDraft = () => {
    console.log("Saving draft:", { title, content, coverImage, tags });
    // This would save the article as a draft
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create a new story</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isPublishing}
            >
              Save Draft
            </Button>
            <Button 
              className="bg-brand-orange hover:bg-brand-orangeDark text-white"
              onClick={handlePublish}
              disabled={isPublishing || !title.trim() || !content.trim()}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </header>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="text-3xl font-bold border-none px-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          <div className="mb-6">
            {coverImage ? (
              <div className="relative">
                <img 
                  src={coverImage} 
                  alt="Cover" 
                  className="w-full h-64 object-cover rounded-md"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100"
                  onClick={() => setCoverImage(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div>
                <Label htmlFor="cover-image" className="mb-2 block">Cover Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageUpload}
                  />
                  <label htmlFor="cover-image" className="cursor-pointer">
                    <Image className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and drop an image, or <span className="text-brand-orange">browse</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Recommended: 1200 x 600 pixels (16:9 ratio)
                    </p>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story..."
              className="min-h-[300px] border-none px-0 text-gray-800 placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>
          
          <div>
            <Label htmlFor="tags" className="mb-2 block">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {tags.length < 5 && (
                <div className="flex items-center">
                  <Input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    placeholder="Add up to 5 tags"
                    className="border-0 p-0 text-sm h-auto focus-visible:ring-0"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={handleAddTag}
                    className="h-6 w-6"
                    disabled={!tagInput.trim()}
                  >
                    <PlusCircle size={16} />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Press Enter or comma to add a tag. Tags help readers discover your story.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-brand-orange hover:bg-brand-orangeDark text-white"
            onClick={handlePublish}
            disabled={isPublishing || !title.trim() || !content.trim()}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Editor;
