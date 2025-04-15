import { memo } from "react";
import { Post } from "@/types/social";
import { CardContent } from "@/components/ui/card";
import PostImage from "./PostImage";
import PostActions from "./PostActions";

interface PostContentProps {
  post: Post;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const PostContent = memo(({ post, onComment, onShare }: PostContentProps) => {
  return (
    <CardContent>
      <p className="mb-4">{post.content}</p>
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.map((image, index) => (
            <PostImage
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}
      <PostActions
        postId={post._id}
        likes={post.likes}
        commentsCount={post.comments.length}
        onComment={() => onComment?.(post._id)}
        onShare={() => onShare?.(post._id)}
      />
    </CardContent>
  );
});

PostContent.displayName = "PostContent";

export default PostContent;
