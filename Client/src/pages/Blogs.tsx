// Import your BlogPost type
import { BlogPost } from "@/types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogData";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePostsStore } from "@/store/usePostsStore";

// Define the API Post type to match your actual data structure
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
  shares: any[];
  views: number;
  isSaved: boolean;
  isLiked: boolean;
  isShared: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // New state for API posts
  const [apiPosts, setApiPosts] = useState<ApiPost[]>([]);
  const [filteredApiPosts, setFilteredApiPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsStore = usePostsStore();

  const {
    posts: popularPosts,
    loading: popularLoading,
    error: popularError,
    fetchPopularPosts,
  } = usePostsStore();
  console.log("Popular Posts:", popularPosts);

  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/posts");

        // Check if response contains data or posts array
        const postsData = response.data.posts || response.data;
        setApiPosts(Array.isArray(postsData) ? postsData : [postsData]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter static blog posts based on search term
  useEffect(() => {
    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredPosts(filtered);
  }, [searchTerm]);

  // Filter API posts based on search term
  useEffect(() => {
    if (apiPosts.length > 0) {
      const filtered = apiPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredApiPosts(filtered);
    }
  }, [searchTerm, apiPosts]);

  const clearSearch = () => setSearchTerm("");

  // Transform API post to BlogPost format based on BlogPost.tsx requirements
  const transformPost = (post: ApiPost): BlogPost => {
    return {
      id:
        parseInt(post._id.substring(post._id.length - 6), 16) ||
        Number(post._id.slice(-6)), // Convert string ID to a number
      title: post.title,
      excerpt: post.content.substring(0, 150) + "...",
      content: post.content,
      image: post.coverImage || "/placeholder-image.jpg",
      date: new Date(post.createdAt).toLocaleDateString(),
      category: post.destination?.name || "Uncategorized",
      author: {
        name: post.author.fullName || "Anonymous",
        avatar:
          post.author.profilePic ||
          "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        role: "Travel Writer",
      },
      tags: post.tags || [],
      likes: post.likes.length,
      comments: post.comments.map((comment) => ({
        id: comment._id,
        text: comment.content,
        user: {
          name: comment.author.fullName,
          avatar:
            comment.author.profilePic ||
            "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        },
        date: comment.createdAt,
        likes: comment.likes.length || 0,
      })),
      gallery: post.gallery || [],
      readTime: `${Math.ceil(post.content.length / 1000)} min read`,
      destination: post.destination
        ? {
            name: post.destination.name,
            id: post.destination._id,
          }
        : undefined,
      featured:
        post.tags.includes("featured") ||
        post.views > 300 ||
        post.likes.length > 2,
    };
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-4">Travel Stories & Tips</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover travel insights, personal adventures, and practical advice
            for your next journey.
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Featured posts section - using original static data */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>

          {/* Loading state for featured stories */}
          {popularLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-lg overflow-hidden mb-3 aspect-video bg-gray-200"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error state for featured stories */}
          {!popularLoading && popularError && (
            <Card className="text-center py-6 mb-4">
              <CardContent>
                <p className="text-muted-foreground">
                  Unable to load featured stories
                </p>
              </CardContent>
            </Card>
          )}

          {/* Featured stories content */}
          {!popularLoading && !popularError && popularPosts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPosts.slice(0, 3).map((post) => (
                  <motion.div
                    variants={item}
                    key={post._id}
                    onClick={() => navigate(`/blog/${post._id}`)}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <BlogCard post={transformPost(post)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fallback to static if no popular posts */}
          {!popularLoading && !popularError && popularPosts.length === 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.featured)
                  .slice(0, 3)
                  .map((post) => (
                    <motion.div variants={item} key={post.id}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </section>

        <div className="border-t my-12" />

        {/* All posts section - updated to use API posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {searchTerm
              ? `Search Results (${filteredApiPosts.length})`
              : "All Blog Posts"}
          </h2>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <Card className="text-center py-8 mb-8">
              <CardContent>
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No results state */}
          {!loading && !error && filteredApiPosts.length === 0 && searchTerm ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No posts found matching "{searchTerm}"
                </p>
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Results from API
            !loading &&
            !error && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(searchTerm ? filteredApiPosts : apiPosts).map((post) => (
                    <motion.div
                      variants={item}
                      key={post._id}
                      onClick={() => navigate(`/blog/${post._id}`)}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <BlogCard post={transformPost(post)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Blogs;
