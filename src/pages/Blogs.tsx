import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogData";
import BlogCard from "@/components/blog/BlogCard";

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
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5"
        >
          <h1 className="display-4 fw-bold mb-3">Travel Stories & Tips</h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
            Discover travel insights, personal adventures, and practical advice
            for your next journey.
          </p>
        </motion.div>

        <Row className="justify-content-center mb-5">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search blog posts..."
                className="border-start-0 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <InputGroup.Text
                  className="bg-white border-start-0 cursor-pointer"
                  onClick={clearSearch}
                >
                  <FaTimes className="text-muted" />
                </InputGroup.Text>
              )}
            </InputGroup>
          </Col>
        </Row>

        {/* Featured posts section */}
        <section className="mb-5">
          <h2 className="fw-bold mb-4">Featured Stories</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <Row>
              {blogPosts
                .filter((post) => post.featured)
                .slice(0, 3)
                .map((post) => (
                  <Col
                    as={motion.div}
                    variants={item}
                    lg={4}
                    md={6}
                    className="mb-4"
                    key={post.id}
                  >
                    <BlogCard key={post.id} post={post} />
                  </Col>
                ))}
            </Row>
          </motion.div>
        </section>

        <hr className="my-5" />

        {/* All posts section */}
        <section>
          <h2 className="fw-bold mb-4">
            {searchTerm
              ? `Search Results (${filteredPosts.length})`
              : "All Blog Posts"}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">
                No posts found matching "{searchTerm}"
              </p>
              <button className="btn btn-polaris-outline" onClick={clearSearch}>
                Clear Search
              </button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <Row>
                {filteredPosts.map((post) => (
                  <Col
                    as={motion.div}
                    variants={item}
                    lg={4}
                    md={6}
                    className="mb-4"
                    key={post.id}
                  >
                    <BlogCard key={post.id} post={post} />
                  </Col>
                ))}
              </Row>
            </motion.div>
          )}
        </section>
      </Container>
    </Layout>
  );
};

export default Blogs;
