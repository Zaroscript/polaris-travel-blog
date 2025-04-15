import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  likes: string[];
  commentsCount: number;
  onComment?: () => void;
  onShare?: () => void;
}

export const PostActions = memo(
  ({ postId, likes, commentsCount, onComment, onShare }: PostActionsProps) => {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={onComment}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
    );
  }
);


export default PostActions;

