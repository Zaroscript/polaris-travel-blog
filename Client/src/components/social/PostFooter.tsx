import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Bookmark, Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/types/social";

interface PostFooterProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  isCopied: boolean;
  onToggleComments: () => void;
}

const PostFooter = ({
  post,
  onLike,
  onSave,
  onCopyLink,
  isLiked,
  isSaved,
  isCopied,
  onToggleComments,
}: PostFooterProps) => {
  return (
    <>
      <Separator />
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10",
              isLiked && "text-primary"
            )}
            onClick={() => onLike(post.id)}
          >
            <Heart className="h-4 w-4 mr-2" />
            {post.likes.length} Likes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={onToggleComments}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments.length} Comments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10",
              isSaved && "text-primary"
            )}
            onClick={() => onSave(post.id)}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10",
              isCopied && "text-primary"
            )}
            onClick={() => onCopyLink(post.id)}
          >
            {isCopied ? (
              <>
                <CheckCheck className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PostFooter;
