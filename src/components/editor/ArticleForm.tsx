
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import TagInput from "./TagInput";

interface ArticleFormProps {
  title: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  tagInput: string;
  isPublishing: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverImageRemove: () => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyPress: (e: React.KeyboardEvent) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
}

const ArticleForm = ({
  title,
  content,
  coverImage,
  tags,
  tagInput,
  isPublishing,
  onTitleChange,
  onContentChange,
  onCoverImageUpload,
  onCoverImageRemove,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagKeyPress,
  onPublish,
  onSaveDraft,
}: ArticleFormProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create a new story</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onSaveDraft}
            disabled={isPublishing || !title.trim()}
          >
            Save Draft
          </Button>
          <Button 
            className="bg-brand-orange hover:bg-brand-orangeDark text-white"
            onClick={onPublish}
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
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Title"
            className="text-3xl font-bold border-none px-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <ImageUploader 
          coverImage={coverImage}
          onImageUpload={onCoverImageUpload}
          onImageRemove={onCoverImageRemove}
        />
        
        <div className="mb-6">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Tell your story..."
            className="min-h-[300px] border-none px-0 text-gray-800 placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>
        
        <TagInput
          tags={tags}
          tagInput={tagInput}
          onTagInputChange={onTagInputChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onTagKeyPress={onTagKeyPress}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          className="bg-brand-orange hover:bg-brand-orangeDark text-white"
          onClick={onPublish}
          disabled={isPublishing || !title.trim() || !content.trim()}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default ArticleForm;
