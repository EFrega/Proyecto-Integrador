import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
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
  FaTicketAlt,
  FaListAlt
} from 'react-icons/fa';
import './dashboard.css';
import Roles from '../roles/Roles';
import CargarServicio from '../cargaServicios/cargarServicios';
import ExcepcionesProf from '../excepcionesProf/excepcionesProf';
import { FaCalendarTimes } from 'react-icons/fa';
import Agendas from '../agendas/agendas';
import AgendaRegular from '../agendaRegular/agendaRegular';
import Chat from '../chat/chat';
import FichaMedica from '../fichaMedica/fichaMedica';
import VinTurnoHome from '../vinTurnoHome/vinturnohome';
import ReservaTurnos from '../reservaTurnos/reservaTurnos';
import MisTurnos from '../misTurnos/misTurnos';
import ReservaTurnosAdmin from '../reservaTurnosAdmin/reservaTurnosAdmin';
import MisTurnosAdmin from '../misTurnosAdmin/misTurnosAdmin';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = ({ setIsLoggedIn, tieneMensajesNuevos, setTieneMensajesNuevos }) => {
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [vista, setVista] = useState('inicio');
  const [roles, setRoles] = useState({});
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true)
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', opciones);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Funciones para manejar las acciones de los turnos
  const handleCancelarTurno = (turnoId) => {
    console.log('Cancelar turno:', turnoId);
    // Aquí iría la lógica para cancelar el turno
  };

  const handleModificarTurno = (turnoId) => {
    console.log('Modificar turno:', turnoId);
    // Aquí iría la lógica para modificar el turno
  };

  const handleConversar = (turnoId) => {
    console.log('Iniciar conversación:', turnoId);
    // Aquí iría la lógica para iniciar la conversación
    setVista('chat');
  };

// Función para cargar los turnos del usuario
  // Función para cargar los turnos del usuario
  const cargarTurnos = async () => {
    try {
      setLoading(true);
      
      // Obtener el idcontacto del usuario logueado
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const idcontacto = usuario.idcontacto;
      
      console.log('DEBUG - Usuario completo:', usuario);
      console.log('DEBUG - idcontacto extraído:', idcontacto);
      
      if (!idcontacto) {
        console.error('No se encontró idcontacto del usuario');
        console.log('DEBUG - localStorage usuario:', localStorage.getItem('usuario'));
        return;
      }

      // Realizar la consulta a la API
      const url = `${API_URL}/api/turnos/usuario/${idcontacto}`;
      console.log('DEBUG - URL de consulta:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('DEBUG - Response status:', response.status);
      console.log('DEBUG - Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('DEBUG - Data recibida del backend:', data);
        console.log('DEBUG - Cantidad de turnos recibidos:', data.length);
        
        // Filtrar turnos que sean >= fecha actual (opcional, ya que el backend debería filtrar)
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);
        console.log('DEBUG - Fecha actual para filtro:', fechaActual);
        
        const turnosFiltrados = data.filter(turno => {
          const fechaTurno = new Date(turno.dia);
          console.log(`DEBUG - Comparando turno ${turno.idturno}: ${fechaTurno} >= ${fechaActual}`, fechaTurno >= fechaActual);
          return fechaTurno >= fechaActual;
        });
        
        console.log('DEBUG - Turnos después del filtrado:', turnosFiltrados);
        console.log('DEBUG - Cantidad final:', turnosFiltrados.length);
        
        setTurnos(turnosFiltrados);
      } else {
        const errorText = await response.text();
        console.error('Error al cargar turnos:', response.status, response.statusText);
        console.error('Error body:', errorText);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
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

    setRoles(parsedRoles);

    const bool = (val) => val === true || val === 1 || val === "1";

    const allIcons = [
      { id: 'home', component: <FaHome className="fs-4 mt-5 mb-4 text-secondary hover-icon" title="Inicio" key="home" onClick={() => setVista('inicio')} /> },
      { id: 'calendar', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Agendas" key="agendas" onClick={() => setVista('agendas')} /> },
      { id: 'comments', component: (
        <FaComments
          className={`mb-4 hover-icon ${tieneMensajesNuevos ? 'text-danger' : 'text-secondary'}`}
          title="Chat"
          key="comments"
          onClick={() => {
            setVista('chat');
            setTieneMensajesNuevos(false);
          }}
        />
      )},
      { id: 'file', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" key="file" onClick={() => setVista('inicio')} /> },
      { id: 'folder', component: <FaFolder className="fs-4 mb-4 text-secondary hover-icon" key="folder" onClick={() => setVista('inicio')} /> },
      { id: 'excepcionesProf', component: <FaCalendarTimes className="fs-4 mb-4 text-secondary hover-icon" key="excepciones" onClick={() => setVista('excepcionesProf')} /> },
      { id: 'servicios', component: <FaClipboardList className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Servicios" key="servicios" onClick={() => setVista('servicios')} /> },
      { id: 'turnos', component: <FaTicketAlt className="mb-4 text-secondary hover-icon" title="Reservar Turnos" key="turnos" onClick={() => setVista('turnos')} /> },
      { id: 'misTurnos', component: <FaListAlt className="mb-4 text-secondary hover-icon" title="Mis Turnos" key="misTurnos" onClick={() => setVista('misTurnos')} /> },
      { id: 'agendaRegular', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Agenda Regular" key="agendaRegular" onClick={() => setVista('agendaRegular')} /> },
      { id: 'fichaMedica', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" title="Ficha Médica" key="fichaMedica" onClick={() => setVista('fichaMedica')} /> },
    ];

    let allowedIds = [];

    if (bool(parsedRoles.rolsuperadmin)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'file', 'fichaMedica','folder', 'servicios', 'turnos', 'misTurnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.roladministrativo)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'fichaMedica','servicios', 'turnos', 'misTurnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.rolmedico) || bool(parsedRoles.rolpaciente)) {
      allowedIds = ['home', 'comments', 'fichaMedica'];
    } else {
      allowedIds = ['home', 'comments','fichaMedica'];
    }

    const filteredIcons = allIcons.filter(icon => allowedIds.includes(icon.id));
    // Cargar turnos al inicializar el componente
    cargarTurnos();
    setVisibleIcons(filteredIcons);

  }, [tieneMensajesNuevos, setTieneMensajesNuevos]);

  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        <div className="bg-white border-end d-flex flex-column align-items-center p-2 mt-4" style={{ width: '60px' }}>
          {visibleIcons.map(icon => icon.component)}

          <FaUsers
            className="fs-4 mb-4 text-secondary hover-icon"
            title="Gestión de Usuarios"
            style={{ cursor: 'pointer' }}
            onClick={() => setVista('roles')}
          />

          <FaSignOutAlt
            className="fs-4 mt-auto mb-2 text-danger hover-icon"
            title="Cerrar sesión"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>

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
          <div className="">  
            {vista === 'roles' ? (
              <Roles />
            ) : vista === 'servicios' ? (
              <CargarServicio />
            ) : vista === 'excepcionesProf' ? (
              <ExcepcionesProf />
            ) : vista === 'agendas' ? (
              <Agendas />
            ) : vista === 'agendaRegular' ? (
              <AgendaRegular />
            ) : vista === 'fichaMedica' ? (
              <FichaMedica />
            ) : vista === 'chat' ? (
              <Chat setTieneMensajesNuevos={setTieneMensajesNuevos} />
            ) : vista === 'turnos' ? (
              (roles.roladministrativo || roles.rolsuperadmin)
                ? <ReservaTurnosAdmin />
                : <ReservaTurnos />
            ) : vista === 'misTurnos' ? (
              (roles.roladministrativo || roles.rolsuperadmin)
                ? <MisTurnosAdmin />
                : <MisTurnos />
            ) : (
              <div>
                <h4 className="text-primary">Inicio</h4>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <Row className="g-4">
                    {/* Consulta fija - siempre se muestra primero */}
                    <VinTurnoHome 
                      tipo="Consulta"
                      icono="bi bi-chat-left-dots"
                      nombreEspecialista="Consulta General"
                      especialidad="Medicina General"
                      fecha="Disponible"
                      tipoTurno="consulta"
                      onConversar={() => handleConversar('consulta-general')}
                    />

                    {/* Turnos dinámicos desde la base de datos */}
                    {turnos.map((turno, index) => (
                    <VinTurnoHome 
                      key={turno.idturno || index} // Using idturno
                      tipo={turno.tipo || "Presencial"}
                      icono="bi bi-calendar"
                      nombreEspecialista={turno.idprofesional || "Profesional"}
                      especialidad={turno.idservicio || "Especialidad"}
                      fecha={formatearFecha(turno.dia)}
                      tipoTurno="presencial"
                      onCancelar={() => handleCancelarTurno(turno.idturno)} // Using idturno
                      onModificar={() => handleModificarTurno(turno.idturno)} // Using idturno
                    />
                  ))}

                    {/* Mensaje cuando no hay turnos */}
                    {turnos.length === 0 && (
                      <Col md={12}>
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-calendar-x fs-1 mb-3"></i>
                          <p>No tienes turnos programados próximamente.</p>
                        </div>
                      </Col>
                    )}
                  </Row>
                )}
              </div>
            )}
          </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;