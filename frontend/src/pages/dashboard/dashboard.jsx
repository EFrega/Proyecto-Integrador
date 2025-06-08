import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaFolder,
  FaSignOutAlt,
  FaUsers,
  FaEnvelope,
  FaClipboardList,
  FaTicketAlt
} from 'react-icons/fa';
import './dashboard.css';
import Roles from '../roles/Roles';
import CargarServicio from '../cargaServicios/cargarServicios'; // Ajustá la ruta si está en otro directorio
import ExcepcionesProf from '../excepcionesProf/excepcionesProf'; // ajustá la ruta si es diferente
import { FaCalendarTimes } from 'react-icons/fa';
import Agendas from '../agendas/agendas';
import AgendaRegular from '../agendaRegular/agendaRegular';
import Chat from '../chat/chat';
import { io } from 'socket.io-client';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Dashboard principal de la aplicación
 *
 * Contiene una barra de navegación lateral con enlaces a diferentes
 * secciones de la aplicación, y un contenedor principal que
 * muestra el contenido seleccionado.
 *
 * @param {object} props
 * @param {function} props.setIsLoggedIn función para establecer el estado de
 *                                        la sesión
 */

/*******  8576031f-7df4-48fa-8354-860cd4c687fc  *******/
const Dashboard = ({ setIsLoggedIn }) => {
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [vista, setVista] = useState('inicio');
  const [roles, setRoles] = useState({});
  const [tieneMensajesNuevos, setTieneMensajesNuevos] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('nuevo-mensaje', (msg) => {
      const idusuario = JSON.parse(localStorage.getItem('usuario') || '{}').idcontacto;

      if (msg.idsystemuserreceptor === idusuario) {
        setTieneMensajesNuevos(true);
      }
    });

    return () => {
      socket.off('nuevo-mensaje');
      socket.disconnect();
    };
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/';
      return;
    }

    let parsedRoles = {};
    try {
      const rawRoles = localStorage.getItem('roles');
      parsedRoles = rawRoles && rawRoles !== 'undefined' ? JSON.parse(rawRoles) : {};
    } catch (error) {
      parsedRoles = {};
    }

    setRoles(parsedRoles); // actualizar el state (ok)

    const bool = (val) => val === true || val === 1 || val === "1";

    const allIcons = [
      { id: 'home', component: <FaHome className="mb-4 text-secondary hover-icon" title="Inicio" key="home" onClick={() => setVista('inicio')} /> },
      { id: 'calendar', component: <FaCalendarAlt className="mb-4 text-secondary hover-icon" title="Gestión de Agendas" key="agendas" onClick={() => setVista('agendas')} /> },
      { id: 'comments', component: (
        <FaComments
          className={`mb-4 hover-icon ${tieneMensajesNuevos ? 'text-danger' : 'text-secondary'}`}
          title="Chat"
          key="comments"
          onClick={() => {
            setVista('chat');
            setTieneMensajesNuevos(false);  // al entrar a chat, limpio
          }}
          color={tieneMensajesNuevos ? 'red' : 'gray'}   // 🔥 CAMBIA DE COLOR
        />
      )},
      { id: 'file', component: <FaFileAlt className="mb-4 text-secondary hover-icon" key="file" onClick={() => setVista('inicio')} /> },
      { id: 'folder', component: <FaFolder className="mb-4 text-secondary hover-icon" key="folder" onClick={() => setVista('inicio')} /> },
      { id: 'excepcionesProf', component: <FaCalendarTimes className="mb-4 text-secondary hover-icon" key="excepciones" onClick={() => setVista('excepcionesProf')} /> },
      { id: 'servicios', component: <FaClipboardList className="mb-4 text-secondary hover-icon" title="Gestión de Servicios" key="servicios" onClick={() => setVista('servicios')} /> },
      { id: 'turnos', component: <FaTicketAlt className="mb-4 text-secondary hover-icon" title="Gestión de Turnos" key="turnos" onClick={() => setVista('turnos')} /> },
      { id: 'agendaRegular', component: <FaCalendarAlt className="mb-4 text-secondary hover-icon" title="Agenda Regular" key="agendaRegular" onClick={() => setVista('agendaRegular')} /> },
    ];

    let allowedIds = [];

    if (bool(parsedRoles.rolsuperadmin)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'file', 'folder', 'servicios', 'turnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.roladministrativo)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'servicios', 'turnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.rolmedico) || bool(parsedRoles.rolpaciente)) {
      allowedIds = ['home', 'comments', 'turnos'];
    } else {
      allowedIds = ['home', 'comments'];
    }

    const filteredIcons = allIcons.filter(icon => allowedIds.includes(icon.id));
    setVisibleIcons(filteredIcons);

  }, [tieneMensajesNuevos]); // --> dependencia vacía, porque usás variables locales dentro


  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-white border-end d-flex flex-column align-items-center p-2" style={{ width: '60px' }}>
          {visibleIcons.map(icon => icon.component)}

          <FaUsers
            className="mb-4 text-secondary hover-icon"
            title="Gestión de Usuarios"
            style={{ cursor: 'pointer' }}
            onClick={() => setVista('roles')}
          />

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
              {!(roles.roladministrativo || roles.rolsuperadmin) && (
                <div className={`rounded-circle d-flex justify-content-center align-items-center ${tieneMensajesNuevos ? 'bg-danger' : 'bg-secondary'}`} style={{ width: '30px', height: '30px' }}>
                  <FaComments color="white" />
                </div>
              )}
              <div className="rounded-circle bg-info d-flex justify-content-center align-items-center" style={{ width: '30px', height: '30px' }}>
                <FaEnvelope color="white" />
              </div>
              <span className="text-muted small">
                {(() => {
                  try {
                    const usuarioRaw = localStorage.getItem('usuario');
                    const usuario = typeof usuarioRaw === 'string' && usuarioRaw.startsWith('{')
                      ? JSON.parse(usuarioRaw)
                      : { nombre: usuarioRaw };

                    return `${usuario?.nombre ?? 'Usuario'} ${usuario?.apellido ?? ''}`.trim();
                  } catch (e) {
                    return 'Usuario';
                  }
                })()}
              </span>

            </Nav>
          </Navbar>

          <Container fluid className="flex-grow-1 p-4 bg-light">
            {vista === 'roles' ? (
              <Roles />
            ) : vista === 'servicios' ? (
              <CargarServicio />
            ) : vista === 'excepcionesProf' ? (
              <ExcepcionesProf/>
            ) : vista === 'agendas' ? (
              <Agendas />
            ) : vista === 'agendaRegular' ? (
              <AgendaRegular />
            ) : vista === 'chat' ? (
              <Chat setTieneMensajesNuevos={setTieneMensajesNuevos} />
            ) :(
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
                  <small>©2025 Diseñado y desarrollado por <a className="text-info text-decoration-underline" href="https://hehex.dev" target="_blank" rel="noreferrer">HiFive Developers</a></small>
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
