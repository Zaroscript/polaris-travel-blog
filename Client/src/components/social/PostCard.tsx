import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  MapPin,
  Bookmark,
  Copy,
  CheckCheck,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentSection from "./CommentSection";
import { Post } from "@/types/social";
import { usePostsStore } from "@/store/usePostsStore";
import useProfileStore from "@/store/useProfileStore";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onFollow: (userId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  isCopied: boolean;
  isFollowing: boolean;
}

const PostCard = ({
  post,
  onLike,
  onSave,
  onCopyLink,
  onFollow,
  isLiked,
  isSaved,
  isCopied,
  isFollowing,
}: PostCardProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const { authUser } = useAuthStore();

  // get user profile
  const { getProfile } = useProfileStore();
  const user = getProfile(post.authorId);

  const toggleComments = () => {
    setExpandedComments(!expandedComments);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>
                  {postAuthorProfile?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 flex space-x-2 items-center">
                <div>
                  <h3 className="font-semibold text-base">
                    {postAuthorProfile?.name}
                  </h3>
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
                  onClick={() => onFollow(postAuthorProfile?._id)}
                >
                  {isFollowing ? (
                    <UserMinus className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
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
                      <Bookmark className="h-4 w-4 mr-2" />
                      {isSaved ? "Unsave" : "Save"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopyLink(post.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {isCopied ? (
                        <>
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        "Copy link"
                      )}
                    </DropdownMenuItem>
                    {postAuthorProfile?._id === authUser?._id && (
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-base">{post.content}</p>
              {post.images && post.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              {post.destination && (
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{post.destination.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-4">
          <div className="flex items-center space-x-4 w-full">
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
              onClick={toggleComments}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments.length} Comments
            </Button>
          </div>
        </CardFooter>

        {expandedComments && (
          <div className="px-4 pb-4">
            <CommentSection postId={post.id} comments={post.comments} />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PostCard;
