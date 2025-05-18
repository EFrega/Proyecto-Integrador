import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaFolder,
  FaSignOutAlt,
  FaUsers
} from 'react-icons/fa';
import './dashboard.css';
import Roles from '../roles/Roles';

const Dashboard = ({ setIsLoggedIn }) => {
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [vista, setVista] = useState('inicio');

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/';
      return;
    }

    let roles = {};
    try {
      const rawRoles = localStorage.getItem('roles');
      roles = rawRoles && rawRoles !== 'undefined' ? JSON.parse(rawRoles) : {};
    } catch (error) {
      roles = {};
    }

    const bool = (val) => val === true || val === 1 || val === "1";

    const allIcons = [
      { id: 'home', component: <FaHome className="mb-4 text-secondary hover-icon" key="home" onClick={() => setVista('inicio')} /> },
      { id: 'calendar', component: <FaCalendarAlt className="mb-4 text-secondary hover-icon" key="calendar" onClick={() => setVista('inicio')} /> },
      { id: 'comments', component: <FaComments className="mb-4 text-secondary hover-icon" key="comments" onClick={() => setVista('inicio')} /> },
      { id: 'file', component: <FaFileAlt className="mb-4 text-secondary hover-icon" key="file" onClick={() => setVista('inicio')} /> },
      { id: 'folder', component: <FaFolder className="mb-4 text-secondary hover-icon" key="folder" onClick={() => setVista('inicio')} /> },
    ];

    let allowedIds = [];

    if (bool(roles.rolsuperadmin)) {
      allowedIds = ['home', 'calendar', 'comments', 'file', 'folder'];
    } else if (bool(roles.roladministrativo)) {
      allowedIds = ['home', 'calendar', 'comments'];
    } else if (bool(roles.rolmedico) || bool(roles.rolpaciente)) {
      allowedIds = ['home', 'calendar'];
    } else {
      allowedIds = ['home'];
    }

    const filteredIcons = allIcons.filter(icon => allowedIds.includes(icon.id));
    setVisibleIcons(filteredIcons);
  }, []);

  const roles = (() => {
    try {
      const raw = localStorage.getItem('roles');
      return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-white border-end d-flex flex-column align-items-center p-2" style={{ width: '60px' }}>
          {visibleIcons.map(icon => icon.component)}

          {(roles.rolsuperadmin || roles.roladministrativo) && (
            <FaUsers
              className="mb-4 text-secondary hover-icon"
              title="Usuarios"
              style={{ cursor: 'pointer' }}
              onClick={() => setVista('roles')}
            />
          )}

          <FaSignOutAlt
            className="mt-auto mb-2 text-danger hover-icon"
            title="Cerrar sesión"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Main content */}
        <div className="flex-grow-1 d-flex flex-column">
          <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 justify-content-between">
            <Navbar.Brand className="text-primary fw-bold">Clínica<span className="text-dark">Medica</span></Navbar.Brand>
            <Nav className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-danger" style={{ width: '30px', height: '30px' }} />
              <div className="rounded-circle bg-info" style={{ width: '30px', height: '30px' }} />
              <span className="text-muted small">
                {localStorage.getItem('usuario') || 'Usuario'}
              </span>
            </Nav>
          </Navbar>

          <Container fluid className="flex-grow-1 p-4 bg-light">
            {vista === 'roles' ? (
              <Roles />
            ) : (
              <h4 className="text-primary">Inicio</h4>
            )}
          </Container>

          <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
              <Row>
                <Col md={4}><h5>ClínicaMedica</h5></Col>
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
