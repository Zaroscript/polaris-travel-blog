import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

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
  defaultImage = "",
  aspectRatio = "square",
}: ImagePickerProps) => {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [previewUrl, setPreviewUrl] = useState(value || defaultImage);
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Open file selector
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please upload an image.");
      return;
    }

    // Create file reader to get data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      setPreviewUrl(dataUrl);
      onChange(dataUrl);
      setError(false);
    };

    reader.onerror = () => {
      setError(true);
      alert("Failed to read file");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

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

        {/* Upload overlay button */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer group"
          onClick={handleSelectFile}
        >
          <div className="bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload size={20} className="text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;