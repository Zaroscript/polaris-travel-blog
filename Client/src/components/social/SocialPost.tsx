import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "@/types/social";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";
import useProfileStore from "@/store/useProfileStore";

interface SocialPostProps {
  post: Post;
}

const SocialPost = ({ post }: SocialPostProps) => {
  const { likePost, addComment } = usePostsStore();
  const { authUser } = useAuthStore();
  const { user } = useProfileStore();

  const isLiked = post.likes.includes(authUser?._id || "");

  const handleLike = async () => {
    try {
      await likePost(post.id);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const commentText = formData.get('comment') as string;

    if (commentText.trim()) {
      try {
        await addComment(post.id, commentText);
        form.reset();
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <img src={user?.profileImage} alt={user?.fullName} />
          </Avatar>
          <div>
            <div className="font-medium">{user?.fullName}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardHeader>
      {post.images && post.images.length > 0 && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.images[0]} 
            alt="Post image" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <Link to={`/posts/${post.id}`} className="hover:text-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        </Link>
        <p className="text-muted-foreground">{post.content}</p>
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
              className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
            />
            <span>{post.likes.length}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>
        
        <div className="pt-3 w-full">
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <img src={authUser?.profileImage} alt={authUser?.fullName} />
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea 
                name="comment"
                placeholder="Add a comment..." 
                className="min-h-[40px] resize-none"
              />
              <Button 
                type="submit"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <img src={comment.user.profileImage} alt={comment.user.name} />
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="font-medium text-sm">{comment.user.name}</div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    <button className="hover:text-foreground">Like ({comment.likes.length})</button>
                    <button className="hover:text-foreground">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialPost;
