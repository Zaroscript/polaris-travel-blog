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

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  gallery?: string[];
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  travelTips?: string[];
  tags?: string[];
  destination?: string;
  mentions?: string[];
  likes: number;
  comments: any[];
}

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
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10",
                  isFollowing && "text-primary"
                )}
                onClick={() => onFollow(post.author.name)}
              >
                {isFollowing ? (
                  <UserMinus className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
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
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onSave(post.id)}
                    >
                      <Bookmark
                        className={cn(
                          "h-4 w-4",
                          isSaved && "fill-primary text-primary"
                        )}
                      />
                      {isSaved ? "Saved" : "Save post"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => onCopyLink(post.id)}
                    >
                      {isCopied ? (
                        <CheckCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {isCopied ? "Copied!" : "Copy link"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 space-y-4">
                <Link
                  to={`/blog/${post.id}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                </Link>
                <p className="text-base leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="rounded-lg w-full object-cover max-h-[400px] shadow-sm"
                  />
                )}
                {/* Display tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-muted-foreground/10 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Display destination if available */}
                {post.destination && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {post.destination}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col px-6 py-3 border-t border-border/40">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-red-500 hover:bg-red-50/50",
                  isLiked && "text-red-500"
                )}
                onClick={() => onLike(post.id)}
              >
                <Heart
                  className={cn("h-4 w-4 mr-2", isLiked && "fill-red-500")}
                />
                {post.likes + (isLiked ? 1 : 0)} Likes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={toggleComments}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments.length} Comments
              </Button>
            </div>
          </div>

          {expandedComments && (
            <div className="w-full mt-4">
              <Separator className="mb-4" />
              <CommentSection postId={post.id} />
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PostCard;
