import { useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/Contact.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import img from "/contact-us-top-backround-img.png";

const Contact: React.FC = () => {
  useEffect(() => {
    const forms = document.querySelectorAll<HTMLFormElement>(".needs-validation");

    forms.forEach((form) => {
      const handleSubmit = (event: Event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      };

      form.addEventListener("submit", handleSubmit, false);

      
      return () => {
        form.removeEventListener("submit", handleSubmit);
      };
    });
  }, []);

  return (
    <div>
     
      <Container className="my-5">
        <Row className="align-items-center forcontainer">
          <Col xs={12} md={12} lg={6} className="mb-4">
            <h1 className="h">Feel free to contact us anytime!</h1>
            <p>
              Praesent hendrerit, mi facilisis eleifend enim lobortis,
              adipiscing bus lorem, non fringilla.
            </p>
          </Col>
          <Col xs={12} md={6} className="text-center img-container">
            <div className="background-light-blue img-container">
              <img src={img} className="illustration" alt="Contact Us" />
            </div>
          </Col>
        </Row>
        <div className="empty-div"></div>
      </Container>

    
      <Container className="my-5">
        <Row>
          {["London", "Paris", "Barcelona"].map((city) => (
            <Col key={city} xs={12} md={12} lg={4} className="mb-4">
              <h4 className="fw-bold">Our office in {city}</h4>
              <p>
                <i className="fa-solid fa-mobile-screen pe-3"></i> New York
                +(123) 456 -7890
              </p>
              <p>
                <i className="fa-solid fa-envelope pe-3"></i>{" "}
                innovio@qodeinteractive.com
              </p>
              <p>
                <i className="fa-solid fa-thumbtack pe-3"></i> 95 Place de la Gare
              </p>
            </Col>
          ))}
        </Row>
      </Container>

    
      <Container className="mt-5">
        <Row>
          <Col xs={12} lg={6} className="mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.7295896117936!2d-74.00601508459515!3d40.712775179330736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a19b1d8e43f%3A0x80b8a76377a3db63!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2seg!4v1712688721000!5m2!1sen!2seg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </Col>

          <Col xs={12} lg={6} className="d-flex justify-content-center align-items-center">
            <Form className="w-100 needs-validation" noValidate>
              <Form.Group className="mb-3" controlId="name">
                <Form.Control type="text" placeholder="Name" required className="inps" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">This field is required!</div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Control type="email" placeholder="Email" required className="inps" />
                <div className="valid-feedback">Valid Email!</div>
                <div className="invalid-feedback">Invalid Email!</div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="subject">
                <Form.Control type="text" placeholder="Subject" required className="inps" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">This field is required!</div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="message">
                <Form.Control as="textarea" rows={1} placeholder="Write a message..." required className="inps" />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">This field is required!</div>
              </Form.Group>

              <Button type="submit" className="p-2 pe-3 ps-3">
                <span className="pe-3">Send a Message</span>
                <i className="fa-solid fa-arrow-right arrow"></i>
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
