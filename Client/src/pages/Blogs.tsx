import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, ChevronRight, Calendar, Tag, Clock, BookOpen, TrendingUp, Filter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostsStore } from "@/store/usePostsStore";
import { Post } from "@/types/social";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/ui/loading-state";

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  const { posts, loading, error, fetchPosts, fetchPopularPosts } = usePostsStore();
  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        // Initial post fetch
        await fetchPosts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load blog posts",
          variant: "destructive",
        });
      }
    };

    loadBlogPosts();
  }, [fetchPosts, toast]);

  // Extract categories from posts and set trending posts
  useEffect(() => {
    if (posts.length > 0) {
      // Extract all unique categories/tags from posts
      const categories = [...new Set(posts.flatMap(post => post.tags || []))];
      setAllCategories(categories);

      // Set trending posts (highest likes)
      const trending = [...posts]
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 1);
      setTrendingPosts(trending);

      // Filter posts based on search and category
      filterPosts();
    }
  }, [posts]);

  // Filter posts when search term or category changes
  useEffect(() => {
    filterPosts();
  }, [searchTerm, activeCategory, posts]);

  const filterPosts = () => {
    if (!posts.length) return;
    
    let filtered = [...posts];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.tags && post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    }
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(post => 
        post.tags && post.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  };

  const clearSearch = () => setSearchTerm("");
  
  const selectCategory = (category: string) => {
    setActiveCategory(category);
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 text-lg">Failed to load blog posts. Please try again later.</p>
          <Button 
            onClick={() => fetchPosts()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl -z-10" />
          <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Travel Stories & Tips</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                  Discover travel insights, personal adventures, and practical advice
                  for your next journey from our community of global explorers.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground">
                    Latest Stories
                  </Button>
                  <Button variant="outline">
                    Travel Guides
                  </Button>
                </div>
              </motion.div>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="/images/blog-hero.jpg"
                  alt="Travel blogging"
                  className="rounded-xl shadow-lg object-cover h-[400px] w-full"
                />
                <div className="absolute bottom-6 right-6 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow max-w-[200px]">
                  <p className="text-sm font-medium">Join our community of travelers sharing their journeys</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trending Post Feature */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" /> Trending Now
          </h2>
          
          {loading ? (
            <div className="w-full rounded-xl overflow-hidden bg-muted/30 h-[300px] animate-pulse"></div>
          ) : trendingPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl"
            >
              <Link to={`/blog/${trendingPosts[0]._id}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 rounded-xl z-10" />
                <img 
                  src={trendingPosts[0].coverImage} 
                  alt={trendingPosts[0].title} 
                  className="w-full h-[300px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full md:w-2/3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/80 hover:bg-primary text-white">Trending</Badge>
                    {trendingPosts[0].tags?.slice(0, 1).map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-background/20 hover:bg-background/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{trendingPosts[0].title}</h3>
                  <p className="text-white/80 mb-4 line-clamp-2">{trendingPosts[0].content.substring(0, 120)}...</p>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(trendingPosts[0].createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">5 min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No trending posts available</p>
          )}
        </section>

        {/* Blog Content Tabs + Search Bar */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all" onClick={() => selectCategory("all")}>All Posts</TabsTrigger>
                <TabsTrigger value="travel-guides" onClick={() => selectCategory("guide")}>Travel Guides</TabsTrigger>
                <TabsTrigger value="adventures" onClick={() => selectCategory("adventure")}>Adventures</TabsTrigger>
                <TabsTrigger value="tips" onClick={() => selectCategory("tips")}>Travel Tips</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="bg-muted h-48 animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post) => (
                <motion.div key={post._id} variants={item}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No posts found matching your search criteria.</p>
              <Button variant="outline" onClick={clearSearch}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {!loading && filteredPosts.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button variant="outline" className="gap-2">
                Load More <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Explore Categories */}
        {!loading && allCategories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Tag className="mr-2 h-5 w-5 text-primary" /> Explore Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allCategories.slice(0, 8).map((category, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => selectCategory(category)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                    <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ${activeCategory === category ? 'bg-primary text-white' : ''}`}>
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-sm font-medium mb-1 capitalize">{category}</CardTitle>
                    <CardDescription className="text-xs">
                      {filteredPosts.filter(post => post.tags?.includes(category)).length} articles
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="mb-16 bg-muted/30 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest travel tips, destination guides, and inspiration directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Your email address" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blogs;
