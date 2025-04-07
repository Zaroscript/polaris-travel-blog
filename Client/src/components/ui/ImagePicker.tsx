import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultImage?: string;
  aspectRatio?: "square" | "cover";
}

const ImagePicker = ({
  value,
  onChange,
  placeholder = "Enter image URL",
  defaultImage = "/placeholder-profile.jpg",
  aspectRatio = "square",
}: ImagePickerProps) => {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [previewUrl, setPreviewUrl] = useState(value || defaultImage);
  const [error, setError] = useState(false);

  // Update the preview when the value changes externally
  useEffect(() => {
    setImageUrl(value || "");
    setPreviewUrl(value || defaultImage);
  }, [value, defaultImage]);

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    
    // If URL is empty, set to default image
    if (!newUrl) {
      setPreviewUrl(defaultImage);
      onChange("");
      setError(false);
      return;
    }
  };

  // Apply the URL when button is clicked
  const applyUrl = () => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
      onChange(imageUrl);
    } else {
      setPreviewUrl(defaultImage);
      onChange("");
    }
  };

  // Handle image load error
  const handleImageError = () => {
    setError(true);
    // Keep the URL in the input but don't apply it
  };

  // Handle image load success
  const handleImageLoad = () => {
    setError(false);
  };

  return (
    <div className="space-y-3">
      <div 
        className={`relative overflow-hidden border bg-muted ${
          aspectRatio === "square" 
            ? "w-32 h-32 rounded-full" 
            : "w-full h-32 rounded-md"
        }`}
      >
        {/* Image Preview */}
        <img
          src={previewUrl}
          alt="Preview"
          className={`object-cover ${
            aspectRatio === "square" 
              ? "w-full h-full" 
              : "w-full h-full"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        
        {/* Error Overlay */}
        {error && imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm p-2 text-center">
            Unable to load image
          </div>
        )}
      </div>

      {/* URL Input and Apply Button */}
      <div className="flex gap-2">
        <FormControl>
          <Input
            placeholder={placeholder}
            value={imageUrl}
            onChange={handleUrlChange}
            className="flex-1"
          />
        </FormControl>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={applyUrl}
          disabled={error && !!imageUrl}
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default ImagePicker;