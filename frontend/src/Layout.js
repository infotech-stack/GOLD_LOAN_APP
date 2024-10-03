import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import AppNavbar from './Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate()
  
  return (
    <div>
      <AppNavbar handleShowSidebar={handleShowSidebar} />
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start" className="d-lg-none" style={{ width: '300px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sidebar Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar isOpen={showSidebar} />
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid>
        <Row>
          <Col lg={2} className="d-none d-lg-block sidebar-wrapper">
            <Sidebar isOpen={false}  />
          </Col>
          <Col lg={10} className="main-content">
            <Outlet /> {/* Render the matched child route component */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
