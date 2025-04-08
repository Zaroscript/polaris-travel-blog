import { useEffect, useState } from "react";
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
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Reply } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

import { Comment } from "@/types/social";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState(comments);
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

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const replyForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authUser?._id) {
      toast({
        title: "Error",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const newComment = await addComment(postId, values.content);
      setLocalComments((prev) => [...prev, newComment]);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const onReplySubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authUser?._id || !replyingTo) return;

    try {
      const newReply = await addReply(postId, replyingTo, values.content);
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment._id === replyingTo
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      replyForm.reset();
      setReplyingTo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setLocalComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      await deleteReply(postId, commentId, replyId);
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== replyId
                ),
              }
            : comment
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!authUser?._id) {
      toast({
        title: "Error",
        description: "Please log in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      setLocalComments((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId) {
            const updatedLikes = isLiked
              ? comment.likes.filter((like) => like._id !== authUser._id)
              : [
                  ...comment.likes,
                  {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePic: authUser.profilePic,
                  },
                ];
            return { ...comment, likes: updatedLikes };
          }
          return comment;
        })
      );

      if (isLiked) {
        await unlikeComment(postId, commentId);
      } else {
        await likeComment(postId, commentId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment like",
        variant: "destructive",
      });
    }
  };

  const handleLikeReply = async (
    commentId: string,
    replyId: string,
    isLiked: boolean
  ) => {
    if (!authUser?._id) {
      toast({
        title: "Error",
        description: "Please log in to like replies",
        variant: "destructive",
      });
      return;
    }

    try {
      setLocalComments((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply._id === replyId) {
                const updatedLikes = isLiked
                  ? reply.likes.filter((like) => like._id !== authUser._id)
                  : [
                      ...reply.likes,
                      {
                        _id: authUser._id,
                        fullName: authUser.fullName,
                        profilePic: authUser.profilePic,
                      },
                    ];
                return { ...reply, likes: updatedLikes };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );

      if (isLiked) {
        await unlikeReply(postId, commentId, replyId);
      } else {
        await likeReply(postId, commentId, replyId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reply like",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Write a comment..."
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" variant="secondary">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Form>

      <div className="space-y-6">
        {localComments.map((comment) => {
          const isLiked = comment.likes?.some(
            (like) => like._id === authUser?._id
          );

          return (
            <div key={comment._id} className="bg-secondary/10 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.profilePic} />
                  <AvatarFallback>
                    {comment.author.fullName?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {comment.author.fullName || "Anonymous"}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-muted-foreground hover:text-red-500",
                          isLiked && "text-red-500"
                        )}
                        onClick={() => handleLikeComment(comment._id, isLiked)}
                      >
                        {isLiked ? (
                          <FaHeart className="h-4 w-4 mr-1 text-red-500" />
                        ) : (
                          <CiHeart className="h-4 w-4 mr-1" />
                        )}
                        {comment.likes?.length || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setReplyingTo(comment._id)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      {comment.author._id === authUser?._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{comment.content}</p>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 ml-8">
                      <Form {...replyForm}>
                        <form
                          onSubmit={replyForm.handleSubmit(onReplySubmit)}
                          className="flex items-center space-x-2"
                        >
                          <FormField
                            control={replyForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Write a reply..."
                                    className="flex-1"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" size="sm" variant="secondary">
                            Reply
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setReplyingTo(null)}
                          >
                            Cancel
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {comment.replies.map((reply) => {
                        const isReplyLiked = reply.likes?.some(
                          (like) => like._id === authUser?._id
                        );

                        return (
                          <div
                            key={reply._id}
                            className="ml-8 bg-secondary/5 rounded-lg p-3"
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={reply.author.profilePic} />
                                <AvatarFallback>
                                  {reply.author.fullName?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">
                                      {reply.author.fullName || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {formatDistanceToNow(
                                        new Date(reply.createdAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "text-muted-foreground hover:text-red-500",
                                        isReplyLiked && "text-red-500"
                                      )}
                                      onClick={() =>
                                        handleLikeReply(
                                          comment._id,
                                          reply._id,
                                          isReplyLiked
                                        )
                                      }
                                    >
                                      {isReplyLiked ? (
                                        <FaHeart className="h-3 w-3 mr-1 text-red-500" />
                                      ) : (
                                        <CiHeart className="h-3 w-3 mr-1" />
                                      )}
                                      {reply.likes?.length || 0}
                                    </Button>
                                    {reply.author._id === authUser?._id && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteReply(
                                            comment._id,
                                            reply._id
                                          )
                                        }
                                      >
                                        Delete
                                      </Button>
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
        })}
      </div>
    </div>
  );
};

export default CommentSection;
