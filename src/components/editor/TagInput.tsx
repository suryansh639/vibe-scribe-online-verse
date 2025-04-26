
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyPress: (e: React.KeyboardEvent) => void;
}

const TagInput = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTagKeyPress
}: TagInputProps) => {
  return (
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
              onClick={() => onRemoveTag(tag)}
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
              onChange={(e) => onTagInputChange(e.target.value)}
              onKeyDown={onTagKeyPress}
              placeholder="Add up to 5 tags"
              className="border-0 p-0 text-sm h-auto focus-visible:ring-0"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={onAddTag}
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
  );
};

export default TagInput;
