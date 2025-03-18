import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import SocialNav from "../social/SocialNav";
import { LogIn } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [islogin, setIsLogin] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.header initial="hidden" animate="visible" variants={navVariants}>
      <Navbar
        expanded={expanded}
        expand="lg"
        fixed="top"
        className={`navbar-polaris py-3 ${scrolled ? "shadow-sm" : ""}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Image src="/logo.svg" width={40} height={40} className="mr-1" />
            <span className="fw-bold fs-4">Polaris</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbarNav"
            onClick={() => setExpanded(!expanded)}
            className="border-0 focus:outline-none focus:ring-0"
          >
            {expanded ? <FaTimes /> : <FaBars />}
          </Navbar.Toggle>

          <Navbar.Collapse id="navbarNav">
            <Nav className="mx-auto mt-3 mt-lg-0">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`px-3 ${
                    isActive("/") ? "fw-bold text-primary" : "text-dark"
                  }`}
                  onClick={() => setExpanded(false)}
                >
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={`px-3 ${
                    isActive("/about") ? "fw-bold text-primary" : "text-dark"
                  }`}
                  onClick={() => setExpanded(false)}
                >
                  About
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/destinations"
                  className={`px-3 ${
                    isActive("/destinations")
                      ? "fw-bold text-primary"
                      : "text-dark"
                  }`}
                  onClick={() => setExpanded(false)}
                >
                  Destinations
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/blogs"
                  className={`px-3 ${
                    isActive("/blogs") ? "fw-bold text-primary" : "text-dark"
                  }`}
                  onClick={() => setExpanded(false)}
                >
                  Blogs
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/social"
                  className={`px-3 ${
                    isActive("/social") ? "fw-bold text-primary" : "text-dark"
                  }`}
                  onClick={() => setExpanded(false)}
                >
                  Social Feed
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="d-flex">
              <Button className="btn-polaris-primary max-lg:w-1/2 mx-auto max-lg:mt-4" onClick={() => setIsLogin(!islogin)}>
                {islogin ? "Sign out" : "Login"}
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Add extra padding when the navbar is fixed */}
      <div style={{ paddingTop: "80px" }}></div>
      {islogin && <SocialNav />}
    </motion.header>
  );
};

export default Header;
