
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import TagInput from "./TagInput";
import RichTextEditor from "./RichTextEditor";
import FormatButton from "./FormatButton";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from "lucide-react";

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
        
        <div className="mb-2 border-b pb-2">
          <div className="flex flex-wrap gap-2">
            <FormatButton format="bold" icon={<Bold size={16} />} tooltip="Bold" />
            <FormatButton format="italic" icon={<Italic size={16} />} tooltip="Italic" />
            <div className="w-px bg-gray-200 mx-1"></div>
            <FormatButton format="h1" icon={<Heading1 size={16} />} tooltip="Heading 1" />
            <FormatButton format="h2" icon={<Heading2 size={16} />} tooltip="Heading 2" />
            <FormatButton format="h3" icon={<Heading3 size={16} />} tooltip="Heading 3" />
            <div className="w-px bg-gray-200 mx-1"></div>
            <FormatButton format="link" icon={<LinkIcon size={16} />} tooltip="Insert Link" />
            <div className="w-px bg-gray-200 mx-1"></div>
            <FormatButton format="ul" icon={<List size={16} />} tooltip="Bullet List" />
            <FormatButton format="ol" icon={<ListOrdered size={16} />} tooltip="Numbered List" />
            <div className="w-px bg-gray-200 mx-1"></div>
            <FormatButton format="left" icon={<AlignLeft size={16} />} tooltip="Align Left" />
            <FormatButton format="center" icon={<AlignCenter size={16} />} tooltip="Align Center" />
            <FormatButton format="right" icon={<AlignRight size={16} />} tooltip="Align Right" />
          </div>
        </div>
        
        <div className="mb-6">
          <RichTextEditor 
            value={content}
            onChange={onContentChange}
            placeholder="Tell your story..."
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
