import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogData";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    // Filter posts based on search term
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

  const clearSearch = () => setSearchTerm("");

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

        {/* Featured posts section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
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
                  <motion.div
                    variants={item}
                    key={post.id}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </section>

        <div className="border-t my-12" />

        {/* All posts section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {searchTerm
              ? `Search Results (${filteredPosts.length})`
              : "All Blog Posts"}
          </h2>

          {filteredPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No posts found matching "{searchTerm}"
                </p>
                <Button
                  variant="outline"
                  onClick={clearSearch}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <motion.div
                    variants={item}
                    key={post.id}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Blogs;
