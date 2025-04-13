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
import { useProfileStore } from "@/store/useProfileStore";
import { formatRelativeTime } from "@/utils/date";
import { useState, useEffect } from "react";

interface PostHeaderProps {
  post: Post;
  onFollow?: (userId: string) => void;
  onSave?: (postId: string) => void;
  onCopyLink?: (postId: string) => void;
  isFollowing?: boolean;
  isSaved?: boolean;
  isCopied?: boolean;
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
  const { fetchProfile } = useProfileStore();
  const [user, setUser] = useState(post.author);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await fetchProfile(post.author._id);
        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [post.author._id, fetchProfile]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>{user.fullName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex space-x-2 items-center">
          <div>
            <h3 className="font-semibold text-base">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>

          {authUser && onFollow && authUser._id !== user._id && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10",
                isFollowing && "text-primary"
              )}
              onClick={() => onFollow && onFollow(user._id)}
            >
              {isFollowing ? (
                <UserMinus className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              <span className="ml-1">
                {isFollowing ? "Following" : "Follow"}
              </span>
            </Button>
          )}
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
            <DropdownMenuItem onClick={() => onSave && onSave(post._id)}>
              {isSaved ? "Unsave" : "Save"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopyLink && onCopyLink(post._id)}>
              {isCopied ? "Copied!" : "Copy link"}
            </DropdownMenuItem>
            {user._id === authUser?._id && (
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
