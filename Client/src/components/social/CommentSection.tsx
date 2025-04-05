import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "@/types/social";
interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment("");
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Static mock data
  const mockComments = [
    {
      id: "1",
      content: "This is a great post! Really enjoyed reading it.",
      createdAt: "2024-02-20T10:00:00Z",
      author: {
        id: "user1",
        name: "John Doe",
        profileImage: "/images/avatar1.jpg",
      },
      likes: ["user1", "user2"],
      replies: [
        {
          id: "reply1",
          content: "Thanks for sharing your thoughts!",
          createdAt: "2024-02-20T11:00:00Z",
          author: {
            id: "user2",
            name: "Jane Smith",
            profileImage: "/images/avatar2.jpg",
          },
        },
      ],
    },
    {
      id: "2",
      content: "Very insightful perspective.",
      createdAt: "2024-02-20T09:30:00Z",
      author: {
        id: "user3",
        name: "Mike Wilson",
        profileImage: "/images/avatar3.jpg",
      },
      likes: ["user1"],
      replies: [],
    },
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-4">
        {mockComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.profileImage} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {comment.author.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>

                <div className="mt-2 flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {comment.likes.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {comment.replies.length} Replies
                  </Button>
                </div>

                {expandedReplies[comment.id] && (
                  <div className="mt-3 ml-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.profileImage} />
                          <AvatarFallback>
                            {reply.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/30 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-xs">
                                  {reply.author.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(reply.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="text-destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="mt-1 text-xs">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
