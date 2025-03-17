
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { BlogPost } from "@/data/blogData";
import { Link } from "react-router-dom";

interface SocialPostProps {
  post: BlogPost;
}

const SocialPost = ({ post }: SocialPostProps) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(), // Changed from string to number using timestamp
        user: {
          name: "You",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        text: commentText,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
      };
      
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <img src={post.author.avatar} alt={post.author.name} />
          </Avatar>
          <div>
            <div className="font-medium">{post.author.name}</div>
            <div className="text-xs text-muted-foreground">{post.date}</div>
          </div>
        </div>
      </CardHeader>
      <div className="aspect-video overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <Link to={`/blog/${post.id}`} className="block mb-2">
          <h3 className="text-xl font-semibold hover:text-primary transition-colors">{post.title}</h3>
        </Link>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
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
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex items-center py-2 border-t border-b w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 flex items-center" 
            onClick={handleLike}
          >
            <Heart 
              className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
            />
            <span>{likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>
        
        {commentOpen && (
          <div className="pt-3 w-full">
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Your avatar" />
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea 
                  placeholder="Add a comment..." 
                  className="min-h-[40px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button 
                  size="icon" 
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <img src={comment.user.avatar} alt={comment.user.name} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-medium text-sm">{comment.user.name}</div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>{comment.date}</span>
                      <button className="hover:text-foreground">Like ({comment.likes})</button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SocialPost;
