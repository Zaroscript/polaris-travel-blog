import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Reply, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { authUser } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: newComment,
      author: {
        name: authUser?.fullName || "Anonymous",
        avatar: authUser?.profilePic || "",
      },
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
      replies: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleAddReply = (commentId: string) => {
    if (!newReply[commentId]?.trim()) return;

    const reply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      text: newReply[commentId],
      author: {
        name: authUser?.fullName || "Anonymous",
        avatar: authUser?.profilePic || "",
      },
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setNewReply((prev) => ({
      ...prev,
      [commentId]: "",
    }));
    setReplyingTo(null);
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    }
                  : reply
              ),
            }
          : comment
      )
    );
  };

  return (
    <>
      {/* Add Comment Input */}
      <div className="flex items-start space-x-3 mb-6">
        <Avatar className="h-8 w-8 ring-2 ring-primary/10">
          <AvatarImage src={authUser?.profilePic} />
          <AvatarFallback>{authUser?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-end gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[2.5rem] resize-none"
            rows={1}
          />
          <Button
            size="sm"
            className="h-8 px-3"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 ml-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto p-0 text-xs text-muted-foreground hover:text-red-500",
                      comment.isLiked && "text-red-500"
                    )}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 mr-1",
                        comment.isLiked && "fill-red-500"
                      )}
                    />
                    {comment.likes} Likes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start space-x-3"
                      >
                        <Avatar className="h-6 w-6 ring-2 ring-primary/10">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>
                            {reply.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/30 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">
                                {reply.author.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(reply.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <p className="text-sm mt-1">{reply.text}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-auto p-0 text-xs text-muted-foreground hover:text-red-500 mt-1 ml-1",
                              reply.isLiked && "text-red-500"
                            )}
                            onClick={() =>
                              handleLikeReply(comment.id, reply.id)
                            }
                          >
                            <Heart
                              className={cn(
                                "h-3 w-3 mr-1",
                                reply.isLiked && "fill-red-500"
                              )}
                            />
                            {reply.likes} Likes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <AnimatePresence>
                  {replyingTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start space-x-3 mt-3 ml-6"
                    >
                      <Avatar className="h-6 w-6 ring-2 ring-primary/10">
                        <AvatarImage src={authUser?.profilePic} />
                        <AvatarFallback>
                          {authUser?.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-end gap-2">
                        <Input
                          placeholder="Write a reply..."
                          value={newReply[comment.id] || ""}
                          onChange={(e) =>
                            setNewReply((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!newReply[comment.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default CommentSection;
