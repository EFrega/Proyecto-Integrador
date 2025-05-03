import React from 'react';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaFolder,
  FaSignOutAlt
} from 'react-icons/fa';
import './dashboard.css'; // opcional para refinar estilos

const Dashboard = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-white border-end d-flex flex-column align-items-center p-2" style={{ width: '60px' }}>
          <FaHome className="mb-4 text-secondary hover-icon" />
          <FaCalendarAlt className="mb-4 text-secondary hover-icon" />
          <FaComments className="mb-4 text-secondary hover-icon" />
          <FaFileAlt className="mb-4 text-secondary hover-icon" />
          <FaFolder className="mb-4 text-secondary hover-icon" />
          <FaSignOutAlt
            className="mt-auto mb-2 text-danger hover-icon"
            title="Cerrar sesión"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Main layout */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Top Navbar */}
          <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 justify-content-between">
            <Navbar.Brand className="text-primary fw-bold">Clínica<span className="text-dark">Medica</span></Navbar.Brand>
            <Nav className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-danger" style={{ width: '30px', height: '30px' }} />
              <div className="rounded-circle bg-info" style={{ width: '30px', height: '30px' }} />
              <span className="text-muted small">nombreapellido@example.com</span>
            </Nav>
          </Navbar>

          {/* Main Content */}
          <Container fluid className="flex-grow-1 p-4 bg-light">
            <h4 className="text-primary">Inicio</h4>
            {/* Aquí podés renderizar contenido adicional */}
          </Container>

          {/* Footer */}
          <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  <h5>ClínicaMedica</h5>
                </Col>
                <Col md={4}>
                  <p>Información Institucional</p>
                  <p>Especialidades médicas</p>
                  <p>Calidad y seguridad del paciente</p>
                </Col>
                <Col md={4}>
                  <p>Información Útil</p>
                  <p>Coberturas médicas</p>
                  <p>Solicite turno</p>
                  <p>Preguntas frecuentes</p>
                </Col>
              </Row>
              <Row className="text-center mt-3">
                <Col>
                  <small>©2025 Diseñado y desarrollado por <a className="text-info text-decoration-underline" href="https://hehex.dev" target="_blank" rel="noreferrer">HeHex Developers</a></small>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
