import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostsStore } from "@/store/usePostsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Reply, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Comment } from "@/types/social";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const { authUser } = useAuthStore();
  const { addComment, deleteComment } = usePostsStore();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(postId, newComment);
    setNewComment("");
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(postId, commentId);
  };

  const handleLikeComment = async (commentId: string) => {
    // TODO: Implement comment liking functionality in the backend
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
                <AvatarImage src={comment.user.profileImage} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 ml-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-auto p-0 text-xs text-muted-foreground hover:text-red-500",
                      comment.likes.includes(authUser?._id || "") &&
                        "text-red-500"
                    )}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 mr-1",
                        comment.likes.includes(authUser?._id || "") &&
                          "fill-current"
                      )}
                    />
                    {comment.likes.length} Likes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  {comment.user.id === authUser?._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-destructive hover:text-destructive"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Input */}
            <AnimatePresence>
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-11"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                      <AvatarImage src={authUser?.profilePic} />
                      <AvatarFallback>
                        {authUser?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input placeholder="Write a reply..." className="h-8" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default CommentSection;
