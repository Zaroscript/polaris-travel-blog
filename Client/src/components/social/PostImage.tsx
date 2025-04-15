import { memo } from "react";
import { cn } from "@/lib/utils";

interface PostImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PostImage = memo(({ src, alt, className }: PostImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-lg object-cover w-full h-48", className)}
    />
  );
});

PostImage.displayName = "PostImage";

export default PostImage;
