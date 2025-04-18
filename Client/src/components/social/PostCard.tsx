import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "@/utils/date";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  Image,
  ThumbsUp,
  Globe,
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
  compact?: boolean;
}

const PostCard = ({ post, onLike, onSave, onCopyLink, compact = false }: PostCardProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { likePost, unlikePost, deletePost, toggleSavePost, sharePost, fetchPost } = usePostsStore();
  const { toast } = useToast();
  const { authUser } = useAuthStore();
  const { followUser, unfollowUser, profile } = useProfileStore();

  // Function to refresh comments
  const refreshComments = async () => {
    try {
      // Fetch the latest post data including comments
      const updatedPost = await fetchPost(post._id);
      
      if (updatedPost) {
        // Create a new post object with updated comments to trigger re-render
        if (updatedPost.comments) {
          // Use a state setter to properly update the post object
          const updatedComments = [...updatedPost.comments];
          
          // Create a new post object with the updated comments
          const newPost = {
            ...post,
            comments: updatedComments
          };
          
          // Update the post reference
          Object.assign(post, newPost);
          
          // Force a re-render
          setExpandedComments(expandedComments);
          
          // Log success for debugging
          console.log("Comments refreshed successfully", updatedComments.length);
        }
      }
    } catch (error) {
      console.error("Failed to refresh comments:", error);
      toast({
        title: "Error",
        description: "Failed to refresh comments. Please try again.",
        variant: "destructive",
      });
    }
  };

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

    try {
      // Store current state for potential rollback
      const currentLikeState = isLiked;
      
      // Optimistically update UI state
      setIsLiked(!currentLikeState);
      
      // Call the appropriate store action
      if (!currentLikeState) {
        await likePost(post._id);
      } else {
        await unlikePost(post._id);
      }
    } catch (error) {
      // Revert the optimistic update on failure
      setIsLiked(isLiked);
      
      toast({
        title: "Action failed",
        description: `Failed to ${isLiked ? "unlike" : "like"} the post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      // Try Web Share API first
      if (navigator.share) {
        await navigator.share({
          title: post.title || 'Check out this post',
          text: post.content.substring(0, 100) + '...',
          url: `${window.location.origin}/post/${post._id}`,
        });
        // Call API to record share
        await sharePost(post._id);
      } else {
        // Fallback to copy link
        handleCopyLink();
        // Still record the share
        await sharePost(post._id);
      }
    } catch (error) {
      // Fallback to copy link if Web Share API fails
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/user/profile/${post.author._id}`}>
                <Avatar className="h-10 w-10 border border-primary/10">
                  <AvatarImage src={post.author.profilePic} />
                  <AvatarFallback>
                    {post.author.fullName?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/user/profile/${post.author._id}`}
                    className="font-medium text-sm hover:text-primary transition-colors"
                  >
                    {post.author.fullName}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {formatRelativeTime(post.createdAt)}
                  </span>
                  {post.destination && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{post.destination.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authUser && authUser._id !== post.author._id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 text-xs rounded-full border border-primary/20 hover:bg-primary/5 px-3",
                    isFollowing && "bg-primary/5 text-primary"
                  )}
                  onClick={handleFollow}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-3 w-3 mr-1" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 mr-1" />
                      <span>Follow</span>
                    </>
                  )}
                </Button>
              )}
              <PostMenu
                postId={post._id}
                authorId={post.author._id}
                onEdit={() => handleEdit()}
                onDelete={() => handleDelete()}
                onCopyLink={() => handleCopyLink()}
                onSave={() => onSave && onSave(post._id)}
                isSaved={isSaved}
                isCopied={isCopied}
              />
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 mb-3">
            {post.title && (
              <h3 className="text-base font-semibold mb-2">{post.title}</h3>
            )}
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.coverImage && (
            <div className="w-full mb-3">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Gallery Images with Carousel */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="w-full mb-3 relative">
              {(() => {
                const [activeIndex, setActiveIndex] = useState(0);
                const [carouselApi, setCarouselApi] = useState<any>(null);

                useEffect(() => {
                  if (!carouselApi) return;

                  const onSelect = () => {
                    setActiveIndex(carouselApi.selectedScrollSnap());
                  };

                  carouselApi.on("select", onSelect);
                  return () => {
                    carouselApi.off("select", onSelect);
                  };
                }, [carouselApi]);

                return (
                  <>
                    <Carousel
                      opts={{
                        loop: post.gallery.length > 1,
                        align: "start",
                      }}
                      setApi={setCarouselApi}
                      className="w-full"
                    >
                      <CarouselContent>
                        {post.gallery.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="overflow-hidden aspect-video relative group">
                              <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                {index + 1} / {post.gallery.length}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {post.gallery.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-none text-white" />
                          <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 border-none text-white" />
                        </>
                      )}
                    </Carousel>
                    <div className="flex justify-center mt-2 gap-1">
                      {post.gallery.length > 1 && post.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => carouselApi?.scrollTo(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Post Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="px-4 mb-3 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/5 hover:bg-primary/10 text-xs border-primary/10"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Post Stats */}
          <div className="px-4 flex items-center justify-between text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Heart className={cn("h-3 w-3", isLiked && "fill-red-500 text-red-500")} />
              <span>{post.likes.length} likes</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{post.comments.length} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{post.shares && post.shares.length > 0 ? post.shares.length : 0} shares</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Post Actions */}
          <div className="px-2 py-1 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 rounded-md h-9 text-xs gap-1",
                isLiked && "text-red-500"
              )}
              onClick={handleLike}
            >
              <Heart
                className={cn("h-4 w-4", isLiked && "fill-red-500")}
              />
              <span>Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 rounded-md h-9 text-xs gap-1"
              onClick={() => setExpandedComments(!expandedComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 rounded-md h-9 text-xs gap-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 rounded-md h-9 text-xs gap-1",
                isSaved && "text-primary"
              )}
              onClick={() => onSave && onSave(post._id)}
            >
              <Bookmark
                className={cn("h-4 w-4", isSaved && "fill-primary")}
              />
              <span>Save</span>
            </Button>
          </div>
        </CardContent>

        {/* Comments Section */}
        {expandedComments && (
          <CardFooter className="p-0 border-t">
            <CommentSection 
              postId={post._id} 
              comments={post.comments || []} 
              refreshComments={refreshComments}
            />
          </CardFooter>
        )}
      </Card>

      {/* Edit Post Dialog */}
      <EditPost
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </motion.div>
  );
};

export default PostCard;
