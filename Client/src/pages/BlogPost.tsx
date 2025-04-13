import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogData"; // Keep for fallback and related posts for now
import { BlogPost as BlogPostType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Send,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

// Define API Post type
interface ApiPost {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  author: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  gallery: string[];
  likes: {
    _id: string;
    fullName: string;
    profilePic: string;
  }[];
  comments: {
    _id: string;
    content: string;
    author: {
      _id: string;
      fullName: string;
      profilePic: string;
    };
    likes: string[];
    createdAt: string;
    replies: {
      _id: string;
      content: string;
      author: string;
      createdAt: string;
      likes: string[];
    }[];
  }[];
  tags: string[];
  isPublished: boolean;
  destination?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  views: number;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API post to BlogPost format
  const transformPost = (apiPost: ApiPost): BlogPostType => {
    return {
      id:
        parseInt(apiPost._id.substring(apiPost._id.length - 6), 16) ||
        Number(apiPost._id.slice(-6)),
      title: apiPost.title,
      excerpt: apiPost.content.substring(0, 150) + "...",
      content: apiPost.content,
      image: apiPost.coverImage || "/placeholder-image.jpg",
      date: new Date(apiPost.createdAt).toLocaleDateString(),
      category: apiPost.destination?.name || "Uncategorized",
      author: {
        name: apiPost.author.fullName || "Anonymous",
        avatar: apiPost.author.profilePic || "/user-placeholder.png",
        role: "Travel Writer",
      },
      tags: apiPost.tags || [],
      likes: apiPost.likes.length,
      comments: apiPost.comments.map((comment) => ({
        id: comment._id,
        text: comment.content,
        user: {
          name: comment.author.fullName,
          avatar: comment.author.profilePic || "/user-placeholder.png",
        },
        date: comment.createdAt,
        likes: comment.likes.length || 0,
      })),
      gallery: apiPost.gallery || [],
      readTime: `${Math.ceil(apiPost.content.length / 1000)} min read`,
      destination: apiPost.destination
        ? {
            name: apiPost.destination.name,
            id: apiPost.destination._id,
          }
        : undefined,
      featured:
        apiPost.tags.includes("featured") ||
        apiPost.views > 300 ||
        apiPost.likes.length > 2,
    };
  };

  // Fetch post data from API
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Try to fetch from API first
        const response = await axios.get(
          `http://localhost:5001/api/posts/${id}`
        );
        const apiPost = response.data;

        if (apiPost) {
          const transformedPost = transformPost(apiPost);
          setPost(transformedPost);

          // Now fetch related posts based on tags
          if (apiPost.tags && apiPost.tags.length > 0) {
            try {
              const relatedResponse = await axios.get(
                `http://localhost:5001/api/posts?tags=${apiPost.tags.join(",")}`
              );
              const relatedApiPosts =
                relatedResponse.data.posts || relatedResponse.data;

              // Filter out current post and transform the rest
              const filteredRelatedPosts = Array.isArray(relatedApiPosts)
                ? relatedApiPosts
                    .filter((p) => p._id !== apiPost._id)
                    .map((p) => transformPost(p))
                    .slice(0, 3)
                : [];

              setRelatedPosts(filteredRelatedPosts);
            } catch (relatedErr) {
              console.error("Error fetching related posts:", relatedErr);
              // Fallback to static data for related posts if needed
              fallbackToStaticRelated(id);
            }
          }
        } else {
          // Fallback to static data if API post is null
          fallbackToStatic(id);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        // Fallback to static data
        fallbackToStatic(id);
      } finally {
        setLoading(false);
      }
    };

    // Fallback to static data if API fails
    const fallbackToStatic = (postId: string) => {
      const staticPost = blogPosts.find((p) => p.id.toString() === postId);
      if (staticPost) {
        setPost(staticPost);
        fallbackToStaticRelated(postId);
      } else {
        setError("Blog post not found");
      }
    };

    // Fallback for related posts
    const fallbackToStaticRelated = (postId: string) => {
      const staticPost = blogPosts.find((p) => p.id.toString() === postId);
      if (staticPost) {
        const related = blogPosts
          .filter((p) => p.id.toString() !== postId)
          .filter((p) => p.tags.some((tag) => staticPost.tags.includes(tag)))
          .slice(0, 3);
        setRelatedPosts(related);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && post) {
      console.log(`Comment on post ${post.id}: ${comment}`);
      // Here you would add API call to submit comment
      // axios.post(`http://localhost:5001/api/posts/${post.id}/comments`, { content: comment });
      setComment("");
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    // Here you would add API call to toggle like
    // axios.post(`http://localhost:5001/api/posts/${post.id}/like`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading post...</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <p className="text-muted-foreground mb-6">
            {error ||
              "The post you're looking for doesn't exist or has been removed."}
          </p>
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
