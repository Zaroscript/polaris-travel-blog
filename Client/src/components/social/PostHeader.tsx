import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, MapPin, UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/types/social";
import useProfileStore from "@/store/useProfileStore";

interface PostHeaderProps {
  post: Post;
  onFollow: (userId: string) => void;
  onSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  isFollowing: boolean;
  isSaved: boolean;
  isCopied: boolean;
}

const PostHeader = ({
  post,
  onFollow,
  onSave,
  onCopyLink,
  isFollowing,
  isSaved,
  isCopied,
}: PostHeaderProps) => {
  const { authUser } = useAuthStore();
  const { getProfile } = useProfileStore();
  const user = getProfile(post.authorId);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex space-x-2 items-center">
          <div>
            <h3 className="font-semibold text-base">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10",
              isFollowing && "text-primary"
            )}
            onClick={() => onFollow(post.authorId)}
          >
            {isFollowing ? (
              <UserMinus className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {post.destination && (
          <Badge variant="secondary" className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {post.destination.name}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSave(post.id)}>
              {isSaved ? "Unsave" : "Save"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopyLink(post.id)}>
              {isCopied ? "Copied!" : "Copy link"}
            </DropdownMenuItem>
            {user?.id === authUser?.id && (
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostHeader;
