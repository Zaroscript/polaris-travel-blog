import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
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
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentSection from "./CommentSection";
import PostMenu from "./PostMenu";
import EditPost from "./EditPost";
import { Post } from "@/types/social";
import { usePostsStore } from "@/store/usePostsStore";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";

interface PostCardProps {
  key?: string;
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onSave?: (postId: string) => Promise<void>;
  onCopyLink?: (postId: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
}

const PostCard = ({ post, onLike, onSave, onCopyLink }: PostCardProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { likePost, unlikePost, deletePost, toggleSavePost } = usePostsStore();
  const { toast } = useToast();
  const { authUser } = useAuthStore();
  const { followUser, unfollowUser, profile } = useProfileStore();

  useEffect(() => {
    if (authUser && profile) {
      setIsFollowing(
        profile.following.some((user) => user._id === post.author._id)
      );
      setIsSaved(
        profile.savedPosts.some((savedPost) => savedPost._id === post._id)
      );
      setIsLiked(
        post.likes.some((likedUser) => likedUser._id === authUser._id)
      );
    }
  }, [post, authUser, profile]);

  const handleLike = async () => {
    if (!authUser) {
      toast({
        title: "Not logged in",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    // Store current state for rollback
    const currentLikeState = isLiked;
    const currentLikes = [...post.likes];

    try {
      // Optimistically update UI
      setIsLiked(!currentLikeState);

      // Update post likes array
      if (!currentLikeState) {
        post.likes = [...post.likes, authUser];
      } else {
        post.likes = post.likes.filter((user) => user._id !== authUser._id);
      }

      // Perform the actual like/unlike action
      if (!currentLikeState) {
        await likePost(post._id);
      } else {
        await unlikePost(post._id);
      }

      // Call parent callback if provided
      if (onLike) {
        await onLike(post._id);
      }
    } catch (error) {
      // Revert UI changes on error
      setIsLiked(currentLikeState);
      post.likes = currentLikes;

      toast({
        title: "Action failed",
        description: `Failed to ${
          currentLikeState ? "unlike" : "like"
        } the post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: `${window.location.origin}/post/${post._id}`,
      });
    } catch (error) {
      // Fallback to copy link if Web Share API is not supported
      handleCopyLink();
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${post._id}`
      );
      setIsCopied(true);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleFollow = async () => {
    if (!authUser) {
      toast({
        title: "Error",
        description: "Please log in to follow users",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFollowing = profile?.following.some(
        (f) => f._id === post.author._id
      );
      if (isFollowing) {
        await unfollowUser(post.author._id);
      } else {
        await followUser(post.author._id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!authUser || authUser._id !== post.author._id) {
      toast({
        title: "Error",
        description: "You can only delete your own posts",
        variant: "destructive",
      });
      return;
    }

    try {
      await deletePost(post._id);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!authUser) {
      toast({
        title: "Error",
        description: "Please log in to save posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { isSaved } = await usePostsStore
        .getState()
        .toggleSavePost(post._id);
      toast({
        title: "Success",
        description: isSaved ? "Post saved" : "Post unsaved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    }
  };

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
              <Link to={`/User/profile/${post.author._id}`}>
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={post.author.profilePic} />
                  <AvatarFallback>
                    {post.author.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 flex space-x-2 items-center">
                <div>
                  <Link to={`/User/profile/${post.author._id}`}>
                    <h3 className="font-semibold text-base hover:text-primary transition-colors">
                      {post.author.fullName}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {authUser && authUser._id !== post.author._id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10",
                      isFollowing && "text-primary"
                    )}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <UserMinus className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <PostMenu
                  postId={post._id}
                  authorId={post.author._id}
                  onSave={handleSave}
                  onCopyLink={handleCopyLink}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  isSaved={isSaved}
                  isCopied={isCopied}
                />
              </div>
            </div>

            <div className="mt-4">
              <Link to={`/post/${post._id}`}>
                <h2 className="text-xl inline-block font-semibold mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-base">{post.content}</p>
              {post.coverImage && (
                <div className="mt-4">
                  <img
                    src={post.coverImage}
                    alt="Post cover"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                </div>
              )}
              {post.destination && (
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <Link
                    to={`/destination/${post.destination._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.destination.name}
                  </Link>
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-4">
          <div className="flex items-center space-x-4 w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-muted-foreground transition-all duration-200",
                  "hover:text-red-500 hover:bg-red-500/10",
                  isLiked && "text-red-500 bg-red-500/10"
                )}
                onClick={handleLike}
              >
                <motion.div
                  animate={{
                    scale: isLiked ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart
                    className={cn("h-4 w-4 mr-2", isLiked && "fill-current")}
                  />
                </motion.div>
                {post.likes.length} Likes
              </Button>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={toggleComments}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments.length} Comments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardFooter>

        {expandedComments && (
          <div className="px-4 pb-4">
            <CommentSection postId={post._id} comments={post.comments} />
          </div>
        )}
      </Card>
      <EditPost
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </motion.div>
  );
};

export default PostCard;
