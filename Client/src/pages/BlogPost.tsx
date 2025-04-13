import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Post } from "@/types/social";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  Send,
  Bookmark,
  ThumbsUp,
  Eye,
  Globe,
  Camera,
  MoreHorizontal,
  BookOpen,
  Tag,
  Loader
} from "lucide-react";
import { formatRelativeTime } from "@/utils/date";
import { motion } from "framer-motion";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import BlogCard from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    fetchPost, 
    posts, 
    likePost, 
    unlikePost, 
    toggleSavePost, 
    addComment,
    fetchPosts
  } = usePostsStore();
  const { authUser } = useAuthStore();
  const { toast } = useToast();

  // Fetch the single post data
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the post data
        const postData = await fetchPost(id);
        setPost(postData);
        
        // If user is authenticated, set liked and bookmarked states
        if (authUser) {
          setLiked(postData.likes.some(like => like._id === authUser._id));
          if (authUser.savedPosts) {
            setBookmarked(authUser.savedPosts.some(saved => saved._id === postData._id));
          }
        }

        // Load posts for related content
        if (posts.length === 0) {
          await fetchPosts();
        }
        
        // Scroll to top when post loads
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, fetchPost, authUser, fetchPosts]);

  // Set related posts when posts or main post changes
  useEffect(() => {
    if (post && posts.length > 0) {
      // Find related posts based on tags
      const related = posts
        .filter((p) => p._id !== post._id)
        .filter((p) => p.tags && post.tags && p.tags.some((tag) => post.tags.includes(tag)))
        .slice(0, 3);
      
      setRelatedPosts(related);
    }
  }, [post, posts]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on posts",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim() && post) {
      try {
        await addComment(post._id, comment);
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        setComment("");
        
        // Refresh the post to get updated comments
        const updatedPost = await fetchPost(post._id);
        setPost(updatedPost);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        });
      }
    }
  };

  const handleLikePost = async () => {
    if (!authUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    try {
      // Optimistically update UI
      setLiked(!liked);
      
      if (liked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
      
      // Refresh post data to get updated likes count
      const updatedPost = await fetchPost(post._id);
      setPost(updatedPost);
    } catch (error) {
      // Revert UI on error
      setLiked(liked);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };
  
  const handleSavePost = async () => {
    if (!authUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to save posts",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    try {
      // Optimistically update UI
      setBookmarked(!bookmarked);
      
      const response = await toggleSavePost(post._id);
      toast({
        description: response.message,
      });
    } catch (error) {
      // Revert UI on error
      setBookmarked(bookmarked);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    }
  };
  
  const handleBack = () => {
    navigate('/blogs');
  };
  
  const readTime = post ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)) : 0;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-12" />
            <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Blog post not found"}
          </h1>
          <Button onClick={handleBack}>Back to Blogs</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Blogs
        </Button>

        {/* Hero Section - Immersive Header */}
        <div className="relative h-[40vh] md:h-[60vh] mb-12 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/20 z-10"></div>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6 md:p-12 w-full md:w-3/4">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="bg-primary/80 text-white hover:bg-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-xl text-white/80 mb-6">
                {post.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={post.author.profilePic} alt={post.author.fullName} />
                  <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">By {post.author.fullName}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{readTime} min read</span>
              </div>
              {post.destination && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{post.destination.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
            
            {/* Gallery if available */}
            {post.gallery && post.gallery.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-primary" />
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.gallery.map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-square overflow-hidden rounded-lg relative group"
                    >
                      <img 
                        src={image} 
                        alt={`Gallery image ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Travel tips if available */}
            {post.travelTips && post.travelTips.length > 0 && (
              <div className="mb-12 bg-muted/30 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-primary" />
                  Travel Tips
                </h3>
                <ul className="space-y-3">
                  {post.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article footer */}
            <div className="flex items-center justify-between border-t border-b py-4 mb-8">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleLikePost}
                >
                  <Heart
                    className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span>{post.likes.length} likes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveTab("comments")}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length} comments</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      description: "Link copied to clipboard",
                    });
                  }}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${bookmarked ? "text-primary" : ""}`}
                onClick={handleSavePost}
              >
                <Bookmark
                  className={`h-5 w-5 ${bookmarked ? "fill-primary" : ""}`}
                />
                <span>{bookmarked ? "Saved" : "Save"}</span>
              </Button>
            </div>

            {/* Comments & Discussion Section */}
            <div className="mb-12">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="comments" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Comments ({post.comments.length})
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    About Author
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="comments">
                  <div className="space-y-6">
                    {authUser ? (
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={authUser.profilePic} alt={authUser.fullName} />
                            <AvatarFallback>{authUser.fullName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Add a comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={!comment.trim()}
                            className="gap-1"
                          >
                            <Send className="h-4 w-4" />
                            Post Comment
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="mb-4">Log in to join the conversation</p>
                          <Link to="/login">
                            <Button>Log In</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )}

                    <Separator />

                    {post.comments.length > 0 ? (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-6">
                          {post.comments.map((comment, index) => (
                            <div key={index} className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={comment.author.profilePic} alt={comment.author.fullName} />
                                  <AvatarFallback>{comment.author.fullName?.charAt(0) || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium">{comment.author.fullName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p>{comment.content}</p>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 ml-1">
                                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                      <ThumbsUp className="h-3 w-3" />
                                      {comment.likes.length}
                                    </button>
                                    <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                                  </div>
                                </div>
                              </div>

                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-12 space-y-3">
                                  {comment.replies.map((reply, replyIndex) => (
                                    <div key={replyIndex} className="flex items-start gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={reply.author.profilePic} alt={reply.author.fullName} />
                                        <AvatarFallback>{reply.author.fullName?.charAt(0) || "?"}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="bg-muted/30 p-3 rounded-lg">
                                          <div className="flex justify-between mb-1">
                                            <span className="font-medium">{reply.author.fullName}</span>
                                            <span className="text-xs text-muted-foreground">
                                              {formatRelativeTime(reply.createdAt)}
                                            </span>
                                          </div>
                                          <p>{reply.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 ml-1">
                                          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {reply.likes.length}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="about">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={post.author.profilePic} alt={post.author.fullName} />
                          <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{post.author.fullName}</h3>
                          <p className="text-muted-foreground">Travel Writer & Photographer</p>
                        </div>
                      </div>
                      <p className="mb-6">
                        Passionate traveler and storyteller with a love for exploring new cultures and hidden gems around the world.
                      </p>
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button size="sm">
                          Follow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Article Info Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Article Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read time</span>
                  <span>{readTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span>{post.comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span>{post.likes.length}</span>
                </div>
                {post.destination && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{post.destination.name}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={handleSavePost}>
                  <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? "fill-primary" : ""}`} />
                  {bookmarked ? "Saved" : "Save Article"}
                </Button>
              </CardFooter>
            </Card>

            {/* Table of Contents */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#introduction" className="text-muted-foreground hover:text-foreground">Introduction</a>
                  </li>
                  <li>
                    <a href="#main-attractions" className="text-muted-foreground hover:text-foreground">Main Attractions</a>
                  </li>
                  <li>
                    <a href="#local-cuisine" className="text-muted-foreground hover:text-foreground">Local Cuisine</a>
                  </li>
                  <li>
                    <a href="#accommodation" className="text-muted-foreground hover:text-foreground">Accommodation</a>
                  </li>
                  <li>
                    <a href="#travel-tips" className="text-muted-foreground hover:text-foreground">Travel Tips</a>
                  </li>
                  <li>
                    <a href="#conclusion" className="text-muted-foreground hover:text-foreground">Conclusion</a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={post.author.profilePic} alt={post.author.fullName} />
                  <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold mb-1">{post.author.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Travel enthusiast and photographer with a passion for exploring off-the-beaten-path destinations
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Related Articles</h3>
                  <Link to="/blogs" className="text-sm text-muted-foreground hover:text-primary">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost._id} post={relatedPost} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* More from Polaris */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              More from Polaris
            </h2>
            <Link to="/blogs" className="text-muted-foreground hover:text-primary flex items-center gap-1">
              View All <ChevronLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((morePosts) => (
              morePosts._id !== post._id && (
                <BlogCard key={morePosts._id} post={morePosts} />
              )
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default BlogPost;
