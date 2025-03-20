import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaTag,
  FaClock,
} from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { blogPosts, BlogPost as BlogPostType } from "@/data/blogData";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Find the specific blog post
    if (id) {
      const foundPost = blogPosts.find((p) => p.id === Number(id));
      setPost(foundPost || null);

      // Find related posts based on tags
      if (foundPost) {
        const related = blogPosts
          .filter((p) => p.id !== Number(id))
          .filter((p) => p.tags.some((tag) => foundPost.tags.includes(tag)))
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && post) {
      // In a real app, you would send this to a server
      console.log(`Comment on post ${post.id}: ${comment}`);
      setComment("");
      // Show success message or update UI accordingly
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  if (!post) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <h1>Blog post not found</h1>
          <Link to="/blogs" className="btn btn-polaris-primary mt-3">
            Back to Blogs
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-5">
        <Link
          to="/blogs"
          className="text-decoration-none d-inline-flex align-items-center mb-4"
        >
          <FaArrowLeft className="me-2" />
          Back to Blogs
        </Link>

        <Row>
          <Col lg={8} className="mb-5 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="rounded-4 overflow-hidden mb-4"
                style={{ height: "400px" }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <div className="mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} className="badge-polaris me-2">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="display-5 fw-bold mb-3">{post.title}</h1>

              <div className="d-flex flex-wrap align-items-center mb-4">
                <div className="d-flex align-items-center me-4 mb-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-medium">{post.author.name}</div>
                    <div className="small text-muted">{post.author.role}</div>
                  </div>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="d-flex align-items-center me-3 mb-2">
                    <FaCalendarAlt className="text-muted me-2" size={14} />
                    <span className="small text-muted">{post.date}</span>
                  </div>
                  <div className="d-flex align-items-center me-3 mb-2">
                    <FaTag className="text-muted me-2" size={14} />
                    <span className="small text-muted">{post.category}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-muted me-2" size={14} />
                    <span className="small text-muted">{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="blog-content mb-5">
                <p className="lead mb-4">{post.excerpt}</p>
                <p>{post.content}</p>
                <p>
                  Traveling is one of life's greatest pleasures. It opens your
                  mind to new cultures, landscapes, and experiences. It
                  challenges your perspectives and broadens your understanding
                  of the world. Whether you're exploring ancient ruins, sampling
                  local cuisines, or simply soaking in the atmosphere of a new
                  city, every journey offers unique opportunities for growth and
                  discovery.
                </p>
                <blockquote className="blockquote border-start border-primary border-4 ps-4 my-4">
                  <p>
                    "The world is a book, and those who do not travel read only
                    one page." – Saint Augustine
                  </p>
                </blockquote>
                <p>
                  As travelers, we have a responsibility to respect the places
                  we visit and to minimize our impact on local environments and
                  communities. Sustainable travel practices, such as reducing
                  plastic use, supporting local businesses, and being mindful of
                  cultural sensitivities, can help ensure that future
                  generations can enjoy the same amazing experiences we have
                  today.
                </p>
              </div>

              <div className="d-flex align-items-center justify-content-between py-4 border-top border-bottom mb-5">
                <div className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="p-0 me-4 text-decoration-none d-flex align-items-center"
                    onClick={toggleLike}
                  >
                    {liked ? (
                      <FaHeart className="text-danger me-2" />
                    ) : (
                      <FaRegHeart className="me-2" />
                    )}
                    <span>{liked ? post.likes + 1 : post.likes} Likes</span>
                  </Button>
                  <Button
                    variant="link"
                    className="p-0 me-4 text-decoration-none d-flex align-items-center"
                    href="#comments"
                  >
                    <FaComment className="me-2" />
                    <span>{post.comments.length} Comments</span>
                  </Button>
                </div>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none d-flex align-items-center"
                >
                  <FaShare className="me-2" />
                  <span>Share</span>
                </Button>
              </div>

              <div id="comments" className="mb-5">
                <h3 className="fw-bold mb-4">
                  Comments ({post.comments.length})
                </h3>

                <div className="mb-4">
                  <Form onSubmit={handleCommentSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Leave a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" className="btn-polaris-primary">
                      Post Comment
                    </Button>
                  </Form>
                </div>

                <div className="comment-list">
                  {post.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="d-flex gap-2 mb-4 items-start"
                    >
                      <div className="w-[60px] h-[60px] rounded-full">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="rounded-circle me-3 w-full h-full"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="bg-light rounded-3 p-3">
                          <div className="fw-medium mb-1">
                            {comment.user.name}
                          </div>
                          <p className="mb-0">{comment.text}</p>
                        </div>
                        <div className="d-flex align-items-center mt-2 text-muted small">
                          <span className="me-3">{comment.date}</span>
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none text-muted small"
                          >
                            Like ({comment.likes})
                          </Button>
                          <span className="mx-2">•</span>
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none text-muted small"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Col>

          <Col lg={4}>
            <div className="position-sticky" style={{ top: "100px" }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="card-polaris mb-4">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">About the Author</h4>
                    <div className="d-flex flex-col">
                      <div className="w-[100px] h-[100px] mb-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="rounded-md me-3 "
                        />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">{post.author.name}</h5>
                        <p className="text-muted small mb-3">
                          {post.author.role}
                        </p>
                        <p className="small mb-0">
                          An avid traveler who has explored over 50 countries.
                          Passionate about sharing travel tips and cultural
                          insights.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {relatedPosts.length > 0 && (
                  <Card className="card-polaris">
                    <Card.Body>
                      <h4 className="fw-bold mb-3">Related Posts</h4>
                      {relatedPosts.map((relatedPost) => (
                        <div
                          key={relatedPost.id}
                          className="mb-3 pb-3 border-bottom"
                        >
                          <Row className="g-2">
                            <Col xs={4}>
                              <Link to={`/blog/${relatedPost.id}`}>
                                <img
                                  src={relatedPost.image}
                                  alt={relatedPost.title}
                                  className="img-fluid rounded"
                                />
                              </Link>
                            </Col>
                            <Col xs={8}>
                              <h6 className="mb-1">
                                <Link
                                  to={`/blog/${relatedPost.id}`}
                                  className="text-decoration-none text-dark"
                                >
                                  {relatedPost.title}
                                </Link>
                              </h6>
                              <div className="small text-muted">
                                {relatedPost.date}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default BlogPost;
