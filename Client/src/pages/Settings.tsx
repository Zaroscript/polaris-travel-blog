import React, { useState } from "react";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Notification from "../pages/Notification";
import AccountSettings from "../pages/AcountSettings";
import Sidebar from "../components/Sidebar/Sidebar";

const Settings: React.FC = () => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <Container fluid className="layout-container p-1 p-lg-5">
      <Button className="d-md-none m-3" onClick={() => setShowSidebar(true)}>
        Settings
      </Button>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="d-md-none w-75">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar activePath={location.pathname} />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="main-content">
        <Col md={3} className="sidebar-container bg-light d-none d-md-block rounded-3">
          <Sidebar activePath={location.pathname} />
        </Col>
        <Col md={9} sm={12}className="p-4 content-container">
          <Routes>
            <Route path="/" element={<AccountSettings />} />
            <Route path="/notification" element={<Notification />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
