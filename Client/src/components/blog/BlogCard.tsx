import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, Heart } from "lucide-react";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.category}</span>
        </div>
        <CardTitle className="text-xl mb-2 line-clamp-2">
          <Link
            to={`/blog/${post.id}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.slice(0, 3).map((tag, index) => (
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
            <img
              src={
                post.author.avatar ||
                "https://cdn-icons-gif.flaticon.com/11617/11617195.gif"
              }
              alt={post.author.name}
            />
          </Avatar>
          <span className="text-sm font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments.length}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
