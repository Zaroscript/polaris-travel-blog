import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostsStore } from "@/store/usePostsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { formatRelativeTime } from "@/utils/date";
import { MessageCircle, Send, Reply, Trash2, MoreHorizontal } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Comment } from "@/types/social";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const formSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long (max 500 characters)"),
});

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  refreshComments?: () => Promise<void>;
}

const CommentSection = ({ postId, comments, refreshComments }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { authUser } = useAuthStore();
  const { toast } = useToast();
  const {
    addComment,
    deleteComment,
    likeComment,
    unlikeComment,
    addReply,
    deleteReply,
    likeReply,
    unlikeReply,
  } = usePostsStore();

  // Update local comments when parent comments prop changes
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Sort comments - newest first for better UX
  const sortedComments = useMemo(() => {
    return [...localComments].filter(Boolean).sort((a, b) => {
      return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
    });
  }, [localComments]);

  // Comment form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // Reply form setup
  const replyForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // Safely refresh comments with loading state
  const safeRefreshComments = async () => {
    if (!refreshComments) return;
    
    try {
      setIsLoadingComments(true);
      await refreshComments();
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Submit a new comment
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authUser?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post comments",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = await addComment(postId, values.content);
      
      // Optimistically update UI
      setLocalComments((prev) => [newComment, ...prev]);
      
      // Reset form
      form.reset();
      
      // Refresh comments from server to ensure data consistency
      safeRefreshComments();
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Comment Failed",
        description: "Unable to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit a reply to a comment
  const onReplySubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authUser?._id || !replyingTo) {
      toast({
        title: "Error",
        description: "Please log in to reply",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newReply = await addReply(postId, replyingTo, values.content);
      
      // Optimistically update UI
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment._id === replyingTo
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      
      // Reset form and reply state
      replyForm.reset();
      setReplyingTo(null);
      
      // Refresh comments from server
      safeRefreshComments();
      
      toast({
        title: "Reply Posted",
        description: "Your reply has been added successfully",
      });
    } catch (error) {
      console.error("Failed to add reply:", error);
      toast({
        title: "Reply Failed",
        description: "Unable to post your reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      // Store original comments for rollback
      const originalComments = [...localComments];
      
      // Optimistically update UI
      setLocalComments((prev) =>
        prev.filter((comment) => comment?._id !== commentId)
      );
      
      await deleteComment(postId, commentId);
      
      // Refresh comments from server
      safeRefreshComments();
      
      toast({
        title: "Comment Deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      
      // Revert to original state on error
      setLocalComments(comments);
      
      toast({
        title: "Delete Failed",
        description: "Unable to delete your comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete a reply
  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      // Store original comments for rollback
      const originalComments = [...localComments];
      
      // Optimistically update UI
      setLocalComments((prev) =>
        prev.map((comment) => {
          if (comment?._id === commentId) {
            return {
              ...comment,
              replies: (comment.replies || []).filter(
                (reply) => reply?._id !== replyId
              ),
            };
          }
          return comment;
        })
      );
      
      await deleteReply(postId, commentId, replyId);
      
      // Refresh comments from server
      safeRefreshComments();
      
      toast({
        title: "Reply Deleted",
        description: "Your reply has been removed",
      });
    } catch (error) {
      console.error("Failed to delete reply:", error);
      
      // Revert to original state on error
      setLocalComments(comments);
      
      toast({
        title: "Delete Failed",
        description: "Unable to delete your reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Like/unlike a comment
  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!authUser?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      // Store current state for potential rollback
      const currentLikeState = isLiked;
      
      // Create updated comment object with optimistic update
      const updatedComments = localComments.map((comment) => {
        if (comment?._id === commentId) {
          // If attempting to like but already liked, don't change state
          if (!currentLikeState) {
            // Only apply change if not already liked
            const updatedLikes = [
              ...(comment.likes || []),
              {
                _id: authUser._id,
                fullName: authUser.fullName,
                profilePic: authUser.profilePic,
              },
            ];
            return { ...comment, likes: updatedLikes };
          } else {
            // Unlike operation
            const updatedLikes = (comment.likes || []).filter(
              (like) => like && like._id !== authUser._id
            );
            return { ...comment, likes: updatedLikes };
          }
        }
        return comment;
      });
      
      // Update UI immediately (optimistic update)
      setLocalComments(updatedComments);
      
      // Call the appropriate API function
      let result;
      if (currentLikeState) {
        result = await unlikeComment(postId, commentId);
      } else {
        result = await likeComment(postId, commentId);
        
        // If already liked, don't show an error toast, just refresh to get current state
        if (result && result.alreadyLiked) {
          safeRefreshComments();
          return;
        }
      }
      
      // Refresh comments from server after a short delay
      setTimeout(() => {
        safeRefreshComments();
      }, 300);
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      
      // Refresh to ensure UI is consistent with server state
      safeRefreshComments();
      
      toast({
        title: "Action Failed",
        description: isLiked 
          ? "Failed to unlike comment. Please try again." 
          : "Failed to like comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Like/unlike a reply
  const handleLikeReply = async (
    commentId: string,
    replyId: string,
    isLiked: boolean
  ) => {
    if (!authUser?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like replies",
        variant: "destructive",
      });
      return;
    }

    try {
      // Store current state for potential rollback
      const currentLikeState = isLiked;
      
      // Create updated comments with optimistic update of reply like
      const updatedComments = localComments.map((comment) => {
        if (comment?._id === commentId) {
          const updatedReplies = (comment.replies || []).map((reply) => {
            if (reply?._id === replyId) {
              // If attempting to like but already liked, don't change state
              if (!currentLikeState) {
                // Only apply change if not already liked
                const updatedLikes = [
                  ...(reply.likes || []),
                  {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePic: authUser.profilePic,
                  },
                ];
                return { ...reply, likes: updatedLikes };
              } else {
                // Unlike operation
                const updatedLikes = (reply.likes || []).filter(
                  (like) => like && like._id !== authUser._id
                );
                return { ...reply, likes: updatedLikes };
              }
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
      
      // Update UI immediately (optimistic update)
      setLocalComments(updatedComments);
      
      // Call the appropriate API function
      let result;
      if (currentLikeState) {
        result = await unlikeReply(postId, commentId, replyId);
      } else {
        result = await likeReply(postId, commentId, replyId);
        
        // If already liked, don't show an error toast, just refresh to get current state
        if (result && result.alreadyLiked) {
          safeRefreshComments();
          return;
        }
      }
      
      // Refresh replies from server after a short delay
      setTimeout(() => {
        safeRefreshComments();
      }, 300);
    } catch (error) {
      console.error("Error liking/unliking reply:", error);
      
      // Refresh to ensure UI is consistent with server state
      safeRefreshComments();
      
      toast({
        title: "Action Failed", 
        description: isLiked 
          ? "Failed to unlike reply. Please try again." 
          : "Failed to like reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel reply mode
  const cancelReply = () => {
    setReplyingTo(null);
    replyForm.reset();
  };

  return (
    <div className="w-full p-4 space-y-4">
      {/* Comment Form */}
      <div className="mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={authUser?.profilePic} />
                <AvatarFallback>
                  {authUser?.fullName?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={authUser ? "Add a comment..." : "Please log in to comment"}
                          className="min-h-[40px] bg-secondary/5 border-0 focus-visible:ring-1"
                          disabled={!authUser || isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="rounded-full h-8 w-8 p-0" 
                      disabled={!authUser || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="animate-spin">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Post comment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="text-xs text-muted-foreground ml-11">
              {form.watch("content").length}/500 characters
            </div>
          </form>
        </Form>
      </div>

      {/* Comments Counter */}
      <div className="flex items-center mb-4 border-b pb-2">
        <MessageCircle className="h-4 w-4 mr-2" />
        <span className="font-medium">{localComments.length} Comments</span>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoadingComments ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : !sortedComments || sortedComments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            if (!comment) return null;
            
            // Check if the current user has liked this comment
            const isCommentLiked = Boolean(
              authUser?._id && 
              comment?.likes?.some((like) => like && like._id === authUser._id)
            );

            return (
              <div
                key={comment._id || `comment-${Math.random()}`}
                className="border border-border bg-card rounded-lg p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.profilePic} />
                    <AvatarFallback>
                      {comment.author?.fullName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {comment.author?.fullName || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatRelativeTime(comment.createdAt || new Date().toISOString())}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-8 px-2 hover:text-red-500",
                                  isCommentLiked 
                                    ? "text-red-500" 
                                    : "text-muted-foreground"
                                )}
                                onClick={() => handleLikeComment(comment._id, isCommentLiked)}
                                disabled={!authUser}
                              >
                                {isCommentLiked ? (
                                  <FaHeart className="h-3.5 w-3.5 mr-1 text-red-500" />
                                ) : (
                                  <CiHeart className="h-4 w-4 mr-1" />
                                )}
                                <span className="text-xs">{comment.likes?.length || 0}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isCommentLiked ? "Unlike" : "Like"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground hover:text-primary"
                                onClick={() => setReplyingTo(comment._id)}
                                disabled={!authUser}
                              >
                                <Reply className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Reply</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reply to comment</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {comment.author?._id === authUser?._id && (
                          <DropdownMenu>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Options</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm mt-1">{comment.content}</p>
                    
                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <div className="mt-3 ml-2 border-l-2 pl-3 border-muted">
                        <Form {...replyForm}>
                          <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-2">
                            <FormField
                              control={replyForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex">
                                      <Input
                                        placeholder="Write a reply..."
                                        className="min-h-[36px] text-sm flex-1 bg-background"
                                        disabled={isSubmitting}
                                        autoFocus
                                        {...field}
                                      />
                                      <div className="flex ml-2">
                                        <Button 
                                          type="submit" 
                                          size="sm" 
                                          className="h-9" 
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting ? "Posting..." : "Reply"}
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-9 ml-1"
                                          onClick={cancelReply}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="text-xs text-muted-foreground">
                              {replyForm.watch("content").length}/500 characters
                            </div>
                          </form>
                        </Form>
                      </div>
                    )}
                    
                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {comment.replies.map((reply) => {
                          if (!reply) return null;
                          
                          // Determine if current user has liked this reply
                          const isReplyLiked = Boolean(
                            authUser?._id && 
                            reply?.likes?.some((like) => like && like._id === authUser._id)
                          );

                          return (
                            <div
                              key={reply._id || `reply-${Math.random()}`}
                              className="ml-3 border-l-2 border-muted pl-3 pt-2 pb-1"
                            >
                              <div className="flex items-start space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.author.profilePic} />
                                  <AvatarFallback>
                                    {reply.author?.fullName?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 bg-secondary/5 rounded-md p-2">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="font-medium text-sm">
                                        {reply.author?.fullName || "Anonymous"}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {formatRelativeTime(reply.createdAt || new Date().toISOString())}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={cn(
                                                "h-6 px-1.5 text-xs hover:text-red-500",
                                                isReplyLiked 
                                                  ? "text-red-500" 
                                                  : "text-muted-foreground"
                                              )}
                                              onClick={() =>
                                                handleLikeReply(
                                                  comment._id,
                                                  reply._id,
                                                  isReplyLiked
                                                )
                                              }
                                              disabled={!authUser}
                                            >
                                              {isReplyLiked ? (
                                                <FaHeart className="h-3 w-3 mr-1 text-red-500" />
                                              ) : (
                                                <CiHeart className="h-3.5 w-3.5 mr-1" />
                                              )}
                                              <span className="text-xs">{reply.likes?.length || 0}</span>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{isReplyLiked ? "Unlike" : "Like"}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      
                                      {reply.author?._id === authUser?._id && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-xs text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                  handleDeleteReply(
                                                    comment._id,
                                                    reply._id
                                                  )
                                                }
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Delete reply</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm mt-1">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {sortedComments.length > 5 && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full max-w-xs" 
            onClick={safeRefreshComments}
            disabled={isLoadingComments}
          >
            {isLoadingComments ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Refreshing...
              </>
            ) : (
              "Refresh Comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
