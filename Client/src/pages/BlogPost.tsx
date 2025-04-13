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
  Reply,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

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
      author: {
        _id: string;
        fullName: string;
        profilePic: string;
      };
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

// Import the original Comment interface type
import { Comment } from "@/types";

// Define Reply Type to match structure needed
interface ReplyType {
  id: number;
  text: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  liked?: boolean;
}

interface CommentType extends Omit<Comment, "replies"> {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  liked?: boolean;
  replies?: ReplyType[];
  showReplyForm?: boolean;
}

interface EnhancedBlogPostType extends BlogPostType {
  userLiked?: boolean;
  comments: CommentType[];
}

const API_BASE_URL = "http://localhost:5001/api";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<EnhancedBlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [comment, setComment] = useState("");
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { authUser } = useAuthStore();

  const currentUser = authUser;
  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const transformPost = (apiPost: ApiPost): EnhancedBlogPostType => {
    const userLiked = apiPost.likes.some(
      (like) => currentUser && like._id === currentUser._id
    );

    return {
      id: apiPost._id,
      title: apiPost.title,
      excerpt: apiPost.content.substring(0, 150) + "...",
      content: apiPost.content,
      image: apiPost.coverImage || "/placeholder-image.jpg",
      date: new Date(apiPost.createdAt).toLocaleDateString(),
      category: apiPost.destination?.name || "Uncategorized",
      author: {
        name: apiPost.author.fullName || "Anonymous",
        avatar:
          apiPost.author.profilePic ||
          "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        role: "Travel Writer",
      },
      tags: apiPost.tags || [],
      likes: apiPost.likes.length,
      userLiked,
      comments: apiPost.comments.map((comment) => ({
        id: comment._id,
        text: comment.content,
        user: {
          id: comment.author._id,
          name: comment.author.fullName,
          avatar:
            comment.author.profilePic ||
            "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        },
        date: comment.createdAt,
        likes: comment.likes.length || 0,
        liked: currentUser ? comment.likes.includes(currentUser._id) : false,
        replies: comment.replies.map((reply) => ({
          id: reply._id,
          text: reply.content,
          user: {
            id:
              typeof reply.author === "string"
                ? reply.author
                : reply.author._id,
            name:
              typeof reply.author === "string" ? "User" : reply.author.fullName,
            avatar:
              typeof reply.author === "string"
                ? "https://cdn-icons-gif.flaticon.com/11617/11617195.gif"
                : reply.author.profilePic ||
                  "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
          },
          date: reply.createdAt,
          likes: reply.likes.length || 0,
          liked: currentUser ? reply.likes.includes(currentUser._id) : false,
        })),
        showReplyForm: false,
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
  function transformComment(apiComment, currentUser) {
    return {
      id: apiComment._id,
      text: apiComment.content,
      user: {
        id: apiComment.author._id,
        name: apiComment.author.fullName,
        avatar:
          apiComment.author.profilePic ||
          "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
      },
      date: apiComment.createdAt,
      likes: apiComment.likes?.length || 0,
      liked: currentUser ? apiComment.likes?.includes(currentUser._id) : false,
      replies:
        apiComment.replies?.map((reply) => ({
          id: reply._id,
          text: reply.content,
          user: {
            id:
              typeof reply.author === "string"
                ? reply.author
                : reply.author._id,
            name:
              typeof reply.author === "string" ? "User" : reply.author.fullName,
            avatar:
              typeof reply.author === "string"
                ? "https://cdn-icons-gif.flaticon.com/11617/11617195.gif"
                : reply.author.profilePic ||
                  "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
          },
          date: reply.createdAt,
          likes: reply.likes?.length || 0,
          liked: currentUser ? reply.likes?.includes(currentUser._id) : false,
        })) || [],
      showReplyForm: false,
    };
  }
  // Fetch post data from API
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Try to fetch from API first
        const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
        const apiPost = response.data;

        if (apiPost) {
          const transformedPost = transformPost(apiPost);
          setPost(transformedPost);

          // Now fetch related posts based on tags
          if (apiPost.tags && apiPost.tags.length > 0) {
            try {
              const relatedResponse = await axios.get(
                `${API_BASE_URL}/posts?tags=${apiPost.tags.join(",")}`
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
        setPost({
          ...staticPost,
          comments: staticPost.comments.map((c) => ({
            ...c,
            replies: [],
            showReplyForm: false,
            liked: false,
            user: { ...c.user, id: "static-id" },
          })),
          userLiked: false,
        });
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

  // Handle comment submission
  // Update the handleCommentSubmit function to correctly handle the new comment display

  // Update the handleCommentSubmit function to correctly handle the new comment display

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !token) {
      toast.error("You need to login to post a comment");
      return;
    }

    if (comment.trim() && post) {
      setSubmitting(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/posts/${post.id}/comments`,
          { content: comment },
          authConfig
        );

        // The API returns the entire updated post
        const updatedPost = response.data;

        // Find the most recently added comment (should be the last one)
        const comments = updatedPost.comments || [];
        const newComment =
          comments.length > 0 ? comments[comments.length - 1] : null;

        if (newComment) {
          // Transform the comment to match your UI structure
          const transformedComment = transformComment(newComment, currentUser);

          // Update the post state with the new comment
          setPost((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              comments: [transformedComment, ...prev.comments],
            };
          });

          toast.success("Comment posted successfully");
          setComment("");
        } else {
          console.error("No comments found in response");
          toast.error("Comment may have been posted but couldn't be displayed");
        }
      } catch (err) {
        console.error("Error posting comment:", err);
        toast.error("Failed to post comment. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (commentId) => {
    if (!currentUser || !token) {
      toast.error("You need to login to post a reply");
      return;
    }

    const replyText = replyTexts[commentId.toString()];
    if (!replyText?.trim() || !post) return;

    setSubmitting(true);

    try {
      // Post the reply
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/replies`,
        { content: replyText },
        authConfig
      );

      // The API returns the entire updated post
      const updatedPost = response.data;
      console.log("Full updated post received:", updatedPost);

      if (updatedPost && updatedPost.comments) {
        // Find the comment we just replied to
        const updatedComment = updatedPost.comments.find(
          (comment) => comment._id === commentId
        );

        if (
          updatedComment &&
          updatedComment.replies &&
          updatedComment.replies.length > 0
        ) {
          // Transform the entire post to match our UI structure
          const transformedPost = transformPost(updatedPost);

          // Update the entire post state
          setPost(transformedPost);

          toast.success("Reply posted successfully");
        } else {
          console.error("Updated comment or replies not found in response");
          toast.error("Reply may have been posted but couldn't be displayed");
        }
      } else {
        console.error("No updated post data found in response");
        toast.error("Failed to get updated post data");
      }

      // Clear the reply input regardless
      setReplyTexts((prev) => ({
        ...prev,
        [commentId]: "",
      }));
    } catch (err) {
      console.error("Error posting reply:", err);
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle post like/unlike
  const togglePostLike = async () => {
    if (!currentUser || !token) {
      toast.error("You need to login to like posts");
      return;
    }

    if (!post) return;

    try {
      if (post.userLiked) {
        // Unlike the post
        await axios.delete(`${API_BASE_URL}/posts/${post.id}/like`, authConfig);

        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            likes: prev.likes - 1,
            userLiked: false,
          };
        });
      } else {
        // Like the post
        await axios.post(
          `${API_BASE_URL}/posts/${post.id}/like`,
          {},
          authConfig
        );

        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            likes: prev.likes + 1,
            userLiked: true,
          };
        });
      }
    } catch (err) {
      console.error("Error toggling post like:", err);
      toast.error("Failed to process your like. Please try again.");
    }
  };

  // Handle comment like/unlike
  const toggleCommentLike = async (commentId: number) => {
    if (!currentUser || !token) {
      toast.error("You need to login to like comments");
      return;
    }

    if (!post) return;

    // Find the comment
    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) return;

    try {
      if (comment.liked) {
        // Unlike the comment
        await axios.delete(
          `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/like`,
          authConfig
        );

        setPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.id === commentId
                ? { ...c, likes: c.likes - 1, liked: false }
                : c
            ),
          };
        });
      } else {
        // Like the comment
        await axios.post(
          `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/like`,
          {},
          authConfig
        );

        setPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.id === commentId ? { ...c, likes: c.likes + 1, liked: true } : c
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error toggling comment like:", err);
      toast.error("Failed to process your like. Please try again.");
    }
  };

  // Handle reply like/unlike
  const toggleReplyLike = async (commentId: number, replyId: number) => {
    if (!currentUser || !token) {
      toast.error("You need to login to like replies");
      return;
    }

    if (!post) return;

    // Find the comment and reply
    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment || !comment.replies) return;

    const reply = comment.replies.find((r) => r.id === replyId);
    if (!reply) return;

    try {
      if (reply.liked) {
        // Unlike the reply
        await axios.delete(
          `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/replies/${replyId}/like`,
          authConfig
        );

        setPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: prev.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: c.replies?.map((r) =>
                    r.id === replyId
                      ? { ...r, likes: r.likes - 1, liked: false }
                      : r
                  ),
                };
              }
              return c;
            }),
          };
        });
      } else {
        // Like the reply
        await axios.post(
          `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/replies/${replyId}/like`,
          {},
          authConfig
        );

        setPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            comments: prev.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: c.replies?.map((r) =>
                    r.id === replyId
                      ? { ...r, likes: r.likes + 1, liked: true }
                      : r
                  ),
                };
              }
              return c;
            }),
          };
        });
      }
    } catch (err) {
      console.error("Error toggling reply like:", err);
      toast.error("Failed to process your like. Please try again.");
    }
  };

  // Handle comment deletion
  // Updated deleteComment function with simple toast confirmation
  const deleteComment = async (commentId: number) => {
    if (!currentUser || !token) {
      toast.error("You need to login to delete comments");
      return;
    }

    if (!post) return;

    // Find the comment to check if the current user is the author
    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) return;

    // Only allow deletion if user is the author
    if (comment.user.id !== currentUser._id) {
      toast.error("You can only delete your own comments");
      return;
    }

    // Create a simple toast confirmation
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this comment?</span>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performCommentDelete(commentId);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // Function that actually performs the deletion
  const performCommentDelete = async (commentId: number) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${post.id}/comments/${commentId}`,
        authConfig
      );

      // Remove the comment from the post state
      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        };
      });

      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  // Similar approach for reply deletion
  const deleteReply = async (commentId: number, replyId: number) => {
    if (!currentUser || !token) {
      toast.error("You need to login to delete replies");
      return;
    }

    if (!post) return;

    // Find the comment and reply
    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment || !comment.replies) return;

    const reply = comment.replies.find((r) => r.id === replyId);
    if (!reply) return;

    // Only allow deletion if user is the author
    if (reply.user.id !== currentUser._id) {
      toast.error("You can only delete your own replies");
      return;
    }

    // Create a simple toast confirmation
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this reply?</span>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performReplyDelete(commentId, replyId);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // Function that actually performs the reply deletion
  const performReplyDelete = async (commentId: number, replyId: number) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${post.id}/comments/${commentId}/replies/${replyId}`,
        authConfig
      );

      // Remove the reply from the post state
      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: c.replies?.filter((r) => r.id !== replyId),
              };
            }
            return c;
          }),
        };
      });

      toast.success("Reply deleted successfully");
    } catch (err) {
      console.error("Error deleting reply:", err);
      toast.error("Failed to delete reply. Please try again.");
    }
  };
  const toggleReplyForm = (commentId: number) => {
    setPost((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        comments: prev.comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              showReplyForm: !comment.showReplyForm,
            };
          }
          // Make sure we close other open reply forms
          return {
            ...comment,
            showReplyForm: false,
          };
        }),
      };
    });
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

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                className={
                  post.userLiked ? "text-red-500" : "text-muted-foreground"
                }
                onClick={togglePostLike}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    post.userLiked ? "fill-red-500" : ""
                  }`}
                />
                {post.likes} Likes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {post.comments.length} Comments
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6 relative">
              <h2 className="text-2xl font-bold">
                Comments ({post.comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  placeholder={
                    currentUser ? "Write a comment..." : "Login to comment"
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  disabled={!currentUser || submitting}
                />
                <Button
                  type="submit"
                  disabled={!comment.trim() || !currentUser || submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
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
                        <p className="text-sm mb-2">{comment.text}</p>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-0 text-muted-foreground ${
                              comment.liked ? "text-red-500" : ""
                            }`}
                            onClick={() => toggleCommentLike(comment.id)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-1 ${
                                comment.liked ? "fill-red-500" : ""
                              }`}
                            />
                            {comment.likes} Likes
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground"
                            onClick={() => toggleReplyForm(comment.id)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>

                          {currentUser &&
                            comment.user.id === currentUser._id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-muted-foreground hover:text-red-500"
                                onClick={() => deleteComment(comment.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                        </div>

                        {/* Reply Form */}
                        {comment.showReplyForm && (
                          <div className="mt-4 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyTexts[comment.id.toString()] || ""}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({
                                  ...prev,
                                  [comment.id.toString()]: e.target.value,
                                }))
                              }
                              rows={2}
                              disabled={submitting}
                              className="text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleReplyForm(comment.id)}
                                disabled={submitting}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReplySubmit(comment.id)}
                                disabled={
                                  !replyTexts[comment.id.toString()]?.trim() ||
                                  submitting
                                }
                              >
                                {submitting ? (
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3 mr-2" />
                                )}
                                Reply
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-muted">
                            <div className="space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="pt-2">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={reply.user.avatar} />
                                      <AvatarFallback>
                                        {reply.user.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">
                                          {reply.user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(
                                            new Date(reply.date),
                                            {
                                              addSuffix: true,
                                            }
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-sm mb-2">
                                        {reply.text}
                                      </p>

                                      {/* Reply Actions */}
                                      <div className="flex items-center gap-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-auto p-0 text-muted-foreground ${
                                            reply.liked ? "text-red-500" : ""
                                          }`}
                                          onClick={() =>
                                            toggleReplyLike(
                                              comment.id,
                                              reply.id
                                            )
                                          }
                                        >
                                          <Heart
                                            className={`h-3 w-3 mr-1 ${
                                              reply.liked ? "fill-red-500" : ""
                                            }`}
                                          />
                                          {reply.likes} Likes
                                        </Button>

                                        {currentUser &&
                                          reply.user.id === currentUser._id && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-auto p-0 text-muted-foreground hover:text-red-500"
                                              onClick={() =>
                                                deleteReply(
                                                  comment.id,
                                                  reply.id
                                                )
                                              }
                                            >
                                              <Trash2 className="h-3 w-3 mr-1" />
                                              Delete
                                            </Button>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {post.comments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
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
