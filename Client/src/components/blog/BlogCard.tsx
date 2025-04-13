import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Calendar, Clock } from "lucide-react";
import { Post } from "@/types/social";
import { formatRelativeTime } from "@/utils/date";

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Calculate estimated read time - roughly 200 words per minute
  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));
  
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{formatRelativeTime(post.createdAt)}</span>
          <span>•</span>
          <span>{post.destination?.name || "Travel"}</span>
        </div>
        <CardTitle className="text-xl mb-2 line-clamp-2">
          <Link to={`/blog/${post._id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.content.substring(0, 150)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags && post.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-muted px-2 py-1 rounded-full font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-4 mt-auto flex items-center justify-between border-t">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={post.author.profilePic} alt={post.author.fullName} />
            <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{post.author.fullName}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">{readTime} min read</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
