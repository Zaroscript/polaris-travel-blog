import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Nav,
} from "react-bootstrap";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import { blogPosts, BlogPost, Comment } from "@/data/blogData";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaPaperPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialPost = ({ post }: { post: BlogPost }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        user: {
          name: "You",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        text: commentText,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      };

      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  return (
    <Card className="social-card mb-4">
      <Card.Header className="bg-white p-3">
        <div className="d-flex align-items-center">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="rounded-circle me-3"
            width="40"
            height="40"
          />
          <div>
            <div className="fw-bold">{post.author.name}</div>
            <div className="text-muted small">{post.date}</div>
          </div>
        </div>
      </Card.Header>
      <Card.Img src={post.image} alt={post.title} className="img-fluid" />
      <Card.Body className="p-3">
        <Link to={`/blog/${post.id}`} className="text-decoration-none">
          <h5 className="fw-bold mb-2 text-dark">{post.title}</h5>
        </Link>
        <Card.Text className="text-muted mb-3">{post.excerpt}</Card.Text>
        <div className="mb-3">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="badge-polaris me-2 mb-2 d-inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card.Body>
      <Card.Footer className="bg-white p-0">
        <div className="d-flex">
          <Button
            variant="light"
            className="flex-grow-1 d-flex justify-center items-center border-0 rounded-0 py-2"
            onClick={handleLike}
          >
            {liked ? (
              <FaHeart className="text-danger me-2" />
            ) : (
              <FaRegHeart className="me-2" />
            )}
            <span>{likes} Likes</span>
          </Button>
          <Button
            variant="light"
            className="flex-grow-1 d-flex justify-center items-center border-0 rounded-0 py-2"
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment className="me-2" />
            <span>{comments.length} Comments</span>
          </Button>
          <Button
            variant="light"
            className="flex-grow-1 d-flex justify-center items-center border-0 rounded-0 py-2"
          >
            <FaShare className="me-2" />
            <span>Share</span>
          </Button>
        </div>

        {showComments && (
          <div className="p-3">
            <div className="d-flex mb-3">
              <img
                src="https://randomuser.me/api/portraits/lego/1.jpg"
                alt="Your avatar"
                className="rounded-circle me-2"
                width="32"
                height="32"
              />
              <div className="flex-grow-1">
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    <FaPaperPlane />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className="comment-list mt-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {comments.map((comment) => (
                <div key={comment.id} className="d-flex mb-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="rounded-circle me-2 align-self-start"
                    width="32"
                    height="32"
                  />
                  <div>
                    <div className="bg-light p-2 rounded">
                      <div className="fw-bold small">{comment.user.name}</div>
                      <p className="mb-0 small">{comment.text}</p>
                    </div>
                    <div className="d-flex align-items-center mt-1">
                      <small className="text-muted me-2">{comment.date}</small>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none text-muted me-2"
                        size="sm"
                      >
                        <small>Like ({comment.likes})</small>
                      </Button>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none text-muted"
                        size="sm"
                      >
                        <small>Reply</small>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};

const Social = () => {
  const topPosts = blogPosts.slice(0, 3);
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
          <h1 className="display-4 fw-bold mb-3">Polaris Travel Community</h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
            Connect with fellow travelers, share experiences, and discover
            travel inspiration from our community.
          </p>
        </motion.div>

        <Tab.Container defaultActiveKey="popular">
          <Nav variant="tabs" className="mb-4 border-0">
            <Nav.Item>
              <Nav.Link eventKey="popular" className="fw-medium">
                Popular Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="recent" className="fw-medium">
                Recent Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="following" className="fw-medium">
                Following
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="popular">
              <Row>
                <Col lg={8}>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {topPosts.map((post) => (
                      <motion.div key={post.id} variants={item}>
                        <SocialPost post={post} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Col>
                <Col lg={4}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="card-polaris mb-4">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Discover Travelers</h5>
                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex align-items-center">
                            <img
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="Traveler"
                              className="rounded-circle me-3"
                              width="50"
                              height="50"
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">Alex Morgan</div>
                              <div className="text-muted small">
                                Travel Photographer
                              </div>
                            </div>
                            <Button size="sm" className="btn-polaris-outline">
                              Follow
                            </Button>
                          </div>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://randomuser.me/api/portraits/women/44.jpg"
                              alt="Traveler"
                              className="rounded-circle me-3"
                              width="50"
                              height="50"
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">Sophia Chen</div>
                              <div className="text-muted small">Backpacker</div>
                            </div>
                            <Button size="sm" className="btn-polaris-outline">
                              Follow
                            </Button>
                          </div>
                          <div className="d-flex align-items-center">
                            <img
                              src="https://randomuser.me/api/portraits/men/65.jpg"
                              alt="Traveler"
                              className="rounded-circle me-3"
                              width="50"
                              height="50"
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">Marco Rossi</div>
                              <div className="text-muted small">
                                Food Explorer
                              </div>
                            </div>
                            <Button size="sm" className="btn-polaris-outline">
                              Follow
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    <Card className="card-polaris">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Popular Tags</h5>
                        <div>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #adventure
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #photography
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #foodie
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #backpacking
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #nature
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #cityscape
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #beach
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #mountains
                          </span>
                          <span className="badge-polaris me-2 mb-2 d-inline-block">
                            #wanderlust
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="recent">
              <Row>
                <Col lg={8}>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {recentPosts.map((post) => (
                      <motion.div key={post.id} variants={item}>
                        <SocialPost post={post} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Col>
                <Col lg={4}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="card-polaris mb-4">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Share Your Journey</h5>
                        <p className="text-muted small mb-3">
                          Have a travel story to share? Join our community and
                          post your adventures!
                        </p>
                        <Button className="btn-polaris-primary w-100">
                          Create Post
                        </Button>
                      </Card.Body>
                    </Card>

                    <Card className="card-polaris">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Upcoming Travel Events</h5>
                        <div className="d-flex flex-column gap-3">
                          <div>
                            <h6 className="mb-1">
                              Travel Photography Workshop
                            </h6>
                            <div className="text-muted small mb-1">
                              June 15, 2023 • Virtual
                            </div>
                            <Button size="sm" variant="outline-primary">
                              RSVP
                            </Button>
                          </div>
                          <div>
                            <h6 className="mb-1">Backpacking Europe Meetup</h6>
                            <div className="text-muted small mb-1">
                              July 8, 2023 • London, UK
                            </div>
                            <Button size="sm" variant="outline-primary">
                              RSVP
                            </Button>
                          </div>
                          <div>
                            <h6 className="mb-1">Sustainable Travel Panel</h6>
                            <div className="text-muted small mb-1">
                              July 22, 2023 • Virtual
                            </div>
                            <Button size="sm" variant="outline-primary">
                              RSVP
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="following">
              <div className="text-center py-5">
                <h5 className="mb-3">
                  Follow more travelers to see their posts
                </h5>
                <p className="text-muted mb-4">
                  Discover travelers with similar interests and follow them for
                  inspiration.
                </p>
                <Button className="btn-polaris-primary">
                  Discover Travelers
                </Button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </Layout>
  );
};

export default Social;
