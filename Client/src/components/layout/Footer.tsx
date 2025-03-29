import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import {
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-polaris mt-auto">
      <Container>
        <Row className="gap-y-8">
          <Col md={4} className="mb-4 mb-md-0">
            <Link
              to="/"
              className="d-flex align-items-center mb-4 text-white text-decoration-none"
            >
              <FaGlobe className="me-2" size={24} />
              <span className="fw-bold fs-4">Polaris</span>
            </Link>
            <p className="text-white-50 mb-4">
              Exploring the world one adventure at a time. Join us on our
              journey of discovery.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 hover-lift">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-white-50 hover-lift">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-white-50 hover-lift">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-white-50 hover-lift">
                <FaEnvelope size={18} />
              </a>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/destinations"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Destinations
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/blogs"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/social"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Social Feed
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} sm={6} lg={2}>
            <h5 className="text-white mb-3">Top Destinations</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Bali, Indonesia
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Santorini, Greece
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Kyoto, Japan
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Machu Picchu, Peru
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-lift"
                >
                  Marrakech, Morocco
                </a>
              </li>
            </ul>
          </Col>

          <Col sm={8} xl={3}>
            <h5 className="text-white mb-3">Newsletter</h5>
            <p className="text-white-50 mb-3">
              Subscribe to our newsletter for travel tips and inspiration.
            </p>
            <Form>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Your email address"
                  aria-label="Your email address"
                  required
                />
                <Button variant="primary" type="submit">
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <hr className="my-4 bg-white-50 opacity-25" />

        <div className="text-center text-white-50 py-3">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Polaris. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
