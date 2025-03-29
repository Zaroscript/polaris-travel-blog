
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaGlobe, FaPlane, FaMountain, FaArrowLeft } from 'react-icons/fa';
import Layout from '@/components/layout/Layout';
import { destinations } from '@/data/destinations';
import DestinationCard from '@/components/destination/DestinationCard';

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get('id');
  const [selectedDestination, setSelectedDestination] = useState(
    destinationId ? destinations.find(d => d.id === Number(destinationId)) : null
  );

  useEffect(() => {
    // Set selected destination based on URL param
    if (destinationId) {
      const destination = destinations.find(d => d.id === Number(destinationId));
      setSelectedDestination(destination || null);
    } else {
      setSelectedDestination(null);
    }
  }, [destinationId]);

  const handleBack = () => {
    window.history.pushState({}, '', '/destinations');
    setSelectedDestination(null);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      {selectedDestination ? (
        // Single destination view
        <Container className="py-5">
          <Button
            variant="link"
            className="text-decoration-none mb-4 p-0 flex items-center text-muted-foreground"
            onClick={handleBack}
          >
            <FaArrowLeft className="me-2" />
            Back to All Destinations
          </Button>

          <Row>
            <Col lg={8} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="rounded-4 overflow-hidden mb-4"
                  style={{ height: "400px" }}
                >
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                <h1 className="display-5 fw-bold mb-2">
                  {selectedDestination.name}
                </h1>
                <div className="d-flex align-items-center text-muted mb-4">
                  <FaMapMarkerAlt className="me-2" size={14} />
                  <span>{selectedDestination.location}</span>
                </div>

                <div className="mb-4">
                  {selectedDestination.tags.map((tag, index) => (
                    <Badge key={index} className="badge-polaris me-2 mb-2">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="lead mb-4">{selectedDestination.description}</p>

                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam in dui mauris. Vivamus hendrerit arcu sed erat
                    molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                    eleifend nibh porttitor. Ut in nulla enim. Phasellus
                    molestie magna non est bibendum non venenatis nisl tempor.
                    Suspendisse dictum feugiat nisl ut dapibus.
                  </p>

                  <h2 className="fw-bold mb-3">Things to Do</h2>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2 d-flex align-items-center">
                      <span
                        className="me-2 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      >
                        1
                      </span>
                      Visit the famous landmarks
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <span
                        className="me-2 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      >
                        2
                      </span>
                      Try local cuisine at recommended restaurants
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <span
                        className="me-2 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      >
                        3
                      </span>
                      Explore nature trails and scenic spots
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <span
                        className="me-2 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      >
                        4
                      </span>
                      Experience the local culture and traditions
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </Col>

            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="card-polaris shadow-sm border-0 bg-light">
                  <Card.Body>
                    <h3 className="fw-bold mb-4">Destination Info</h3>

                    <div className="d-flex mb-4">
                      <div className="me-3">
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaGlobe className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h5 className="fw-bold">Best Time to Visit</h5>
                        <p className="text-muted mb-0">April to October</p>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="me-3">
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaPlane className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h5 className="fw-bold">Getting There</h5>
                        <p className="text-muted mb-0">
                          International airport with connections to major cities
                        </p>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="me-3">
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaMountain className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h5 className="fw-bold">Attractions</h5>
                        <p className="text-muted mb-0">
                          Mountains, beaches, historical sites, local markets
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      ) : (
        // All destinations view
        <Container className="py-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-5"
          >
            <h1 className="display-4 fw-bold mb-3">
              Discover Amazing Destinations
            </h1>
            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Explore our curated list of breathtaking destinations around the
              world, from bustling cities to serene landscapes.
            </p>
          </motion.div>

          <section className="mb-5">
            <h2 className="fw-bold mb-4">Featured Destinations</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <Row>
                {destinations.slice(0, 3).map((destination) => (
                  <Col
                    as={motion.div}
                    variants={item}
                    lg={4}
                    md={6}
                    className="mb-4"
                    key={destination.id}
                  >
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  </Col>
                ))}
              </Row>
            </motion.div>
          </section>

          <hr className="my-5" />

          <section>
            <h2 className="fw-bold mb-4">All Destinations</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <Row>
                {destinations.map((destination) => (
                  <Col
                    as={motion.div}
                    variants={item}
                    lg={4}
                    md={6}
                    className="mb-4"
                    key={destination.id}
                  >
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  </Col>
                ))}
              </Row>
            </motion.div>
          </section>
        </Container>
      )}
    </Layout>
  );
};

export default Destinations;
