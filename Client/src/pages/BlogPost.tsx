import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogData";
import { BlogPost as BlogPostType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = blogPosts.find((p) => p.id.toString() === id);
      setPost(foundPost || null);

      if (foundPost) {
        const related = blogPosts
          .filter((p) => p.id.toString() !== id)
          .filter((p) => p.tags.some((tag) => foundPost.tags.includes(tag)))
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && post) {
      console.log(`Comment on post ${post.id}: ${comment}`);
      setComment("");
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/blogs"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cover Image */}
            <div className="rounded-lg overflow-hidden mb-8 aspect-video">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center gap-6 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{post.date}</span>
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{post.readTime}</span>
                  </div>
                )}
                {post.destination && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{post.destination.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  {post.author.role && (
                    <div className="text-sm text-muted-foreground">
                      {post.author.role}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {post.excerpt && (
                <p className="lead text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Travel Tips */}
            {post.travelTips && post.travelTips.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Travel Tips</h2>
                <ul className="space-y-3">
                  {post.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-medium text-primary">
                        #{index + 1}
                      </span>
                      <p>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {post.gallery && post.gallery.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentions */}
            {post.mentions && post.mentions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Mentioned Users</h2>
                <div className="flex flex-wrap gap-2">
                  {post.mentions.map((mention, index) => (
                    <Badge key={index} variant="outline">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                className={liked ? "text-red-500" : "text-muted-foreground"}
                onClick={toggleLike}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${liked ? "fill-red-500" : ""}`}
                />
                {post.likes + (liked ? 1 : 0)} Likes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {post.comments.length} Comments
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Comments ({post.comments.length})
              </h2>

              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button type="submit" disabled={!comment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </form>

              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.date), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-auto p-0 text-muted-foreground hover:text-red-500"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes} Likes
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">About the Author</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author.name}</div>
                    {post.author.role && (
                      <div className="text-sm text-muted-foreground mb-2">
                        {post.author.role}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      An avid traveler sharing experiences and insights from
                      around the world.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="block group"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
