
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, X } from "lucide-react";

interface ImageUploaderProps {
  coverImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ImageUploader = ({ coverImage, onImageUpload, onImageRemove }: ImageUploaderProps) => {
  return (
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
            onClick={onImageRemove}
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
              onChange={onImageUpload}
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
  );
};

export default ImageUploader;
