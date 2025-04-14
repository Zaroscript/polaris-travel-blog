import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, ChevronRight, Calendar, Tag, Clock, BookOpen, TrendingUp, Filter, ChevronLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { posts, loading, error, fetchPosts, fetchPopularPosts } = usePostsStore();
  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        // Initial post fetch
        const response = await fetchPosts(1);
        if (response?.pagination) {
          setTotalPages(Math.ceil(response.pagination.total / 6) || 1);
        }
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

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchPosts(1);
  };
  
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    fetchPosts(1);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    try {
      const response = await fetchPosts(page);
      if (response?.pagination) {
        setTotalPages(Math.ceil(response.pagination.total / 6) || 1);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    }
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
            onClick={() => fetchPosts(1)} 
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
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Travel Blog Hero" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Travel Blog</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
              Explore our collection of travel stories, tips, and inspiration from around the world. 
              Discover new destinations and get insights from experienced travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts, destinations, or tags..."
                  className="pl-10 bg-white/90 border-0 text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-white/20"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button>Search</Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {!loading && allCategories.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Tag className="mr-2 h-5 w-5 text-primary" /> Explore Categories
              </h2>
              
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card 
                className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${activeCategory === "all" ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => selectCategory("all")}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                  <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 ${activeCategory === "all" ? 'bg-primary text-white' : ''}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-medium mb-1 capitalize">All</CardTitle>
                  <CardDescription className="text-xs">
                    {posts.length} articles
                  </CardDescription>
                </CardContent>
              </Card>
              
              {allCategories.slice(0, 5).map((category, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${activeCategory === category ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => selectCategory(category)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                    <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 ${activeCategory === category ? 'bg-primary text-white' : ''}`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-sm font-medium mb-1 capitalize">{category}</CardTitle>
                    <CardDescription className="text-xs">
                      {posts.filter(post => post.tags?.includes(category)).length} articles
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
          
        <section className="mb-12">
          {/* Featured Post */}
          {!loading && trendingPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" /> Featured Post
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden">
                  {trendingPosts[0].coverImage && (
                    <div className="relative h-64 w-full">
                      <img 
                        src={trendingPosts[0].coverImage} 
                        alt={trendingPosts[0].title} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {trendingPosts[0].tags && trendingPosts[0].tags[0]}
                      </Badge>
                      <span className="text-muted-foreground text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(trendingPosts[0].createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/blog/${trendingPosts[0]._id}`}>
                      <CardTitle className="text-2xl mb-2 hover:text-primary transition-colors">
                        {trendingPosts[0].title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mb-4 line-clamp-3">
                      {trendingPosts[0].content.replace(/<[^>]*>?/gm, '')}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {trendingPosts[0].author?.profilePic ? (
                          <img 
                            src={trendingPosts[0].author.profilePic} 
                            alt={trendingPosts[0].author.fullName} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {trendingPosts[0].author?.fullName?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          {trendingPosts[0].author?.fullName}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        5 min read
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <Link to={`/blog/${post._id}`} key={post._id}>
                        <div className="flex items-start gap-3 group mb-4">
                          {post.coverImage ? (
                            <img 
                              src={post.coverImage} 
                              alt={post.title} 
                              className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-muted rounded-md flex-shrink-0" />
                          )}
                          <div>
                            <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <span className="text-muted-foreground text-xs">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.slice((currentPage - 1) * 6, currentPage * 6).map((post) => (
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
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show 5 pages max with current page in the middle when possible
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>

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
