// src/pages/dashboard/dashboard.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import {
  FaHome, FaCalendarAlt, FaComments, FaFileAlt, FaFolder, FaSignOutAlt,
  FaUsers, FaEnvelope, FaClipboardList, FaTicketAlt, FaListAlt, FaCalendarTimes,
  FaCalendarCheck
} from 'react-icons/fa';
import './dashboard.css';
import API from '../../helpers/api';
import Roles from '../roles/Roles';
import CargarServicio from '../cargaServicios/cargarServicios';
import ExcepcionesProf from '../excepcionesProf/excepcionesProf';
import Agendas from '../agendas/agendas';
import AgendaRegular from '../agendaRegular/agendaRegular';
import Chat from '../chat/chat';
import FichaMedica from '../fichaMedica/fichaMedica';
import VinTurnoHome from '../vinTurnoHome/vinturnohome';
import ReservaTurnos from '../reservaTurnos/reservaTurnos';
import MisTurnos from '../misTurnos/misTurnos';
import ReservaTurnosAdmin from '../reservaTurnosAdmin/reservaTurnosAdmin';
import MisTurnosAdmin from '../misTurnosAdmin/misTurnosAdmin';
import AcreditarTurnos from '../acreditarTurnos/acreditarTurnos';
import MisTurnosMedico from '../misTurnosMedico/misTurnosMedico';
import TurnosHoyMedico from '../turnosHoyMedico/turnosHoyMedico';
import AtencionTurno from '../atencionTurno/atencionTurno';


const Dashboard = ({ setIsLoggedIn, tieneMensajesNuevos, setTieneMensajesNuevos }) => {
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [vista, setVista] = useState('inicio');
  const [roles, setRoles] = useState({});
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const cerrarAtencion = () => setTurnoSeleccionado(null);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleConversar = (turnoId) => {
    setTurnoSeleccionado(null);
    setVista('chat');
  };

  const cargarTurnos = useCallback(async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const idcontacto = usuario.idcontacto;
      if (!idcontacto) return;

      const response = await API.get(`/turnos/mis-turnos/${idcontacto}`);

      const data = await response.data;
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const turnosFiltrados = data.filter(turno => {
        const fechaTurno = new Date(turno.dia);
        return fechaTurno >= hoy && turno.reservado !== false;
        });

        setTurnos(turnosFiltrados);
      
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return (window.location.href = '/');

    let parsedRoles = {};
    try {
      parsedRoles = JSON.parse(localStorage.getItem('roles') || '{}');
    } catch { parsedRoles = {}; }

    setRoles(parsedRoles);

    const bool = (val) => val === true || val === 1 || val === "1";

    const allIcons = [
      { id: 'home', component: <FaHome className="fs-4 mt-5 mb-4 text-secondary hover-icon" title="Inicio" key="home" onClick={() => { setVista('inicio'); cerrarAtencion(); }} /> },
      { id: 'calendar', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Agendas" key="agendas" onClick={() => { setVista('agendas'); cerrarAtencion(); }} /> },
      { id: 'comments', component: (
        <FaComments
          className={`mb-4 hover-icon ${tieneMensajesNuevos ? 'text-danger' : 'text-secondary'}`}
          title="Chat"
          key="comments"
          onClick={() => {
            setVista('chat');
            setTieneMensajesNuevos(false);
            cerrarAtencion();
          }}
        />
      )},
      { id: 'file', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" key="file" onClick={() => { setVista('inicio'); cerrarAtencion(); }} /> },
      { id: 'folder', component: <FaFolder className="fs-4 mb-4 text-secondary hover-icon" key="folder" onClick={() => { setVista('inicio'); cerrarAtencion(); }} /> },
      { id: 'excepcionesProf', component: <FaCalendarTimes className="fs-4 mb-4 text-secondary hover-icon" key="excepciones" onClick={() => { setVista('excepcionesProf'); cerrarAtencion(); }} /> },
      { id: 'servicios', component: <FaClipboardList className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Servicios" key="servicios" onClick={() => { setVista('servicios'); cerrarAtencion(); }} /> },
      { id: 'turnos', component: <FaTicketAlt className="mb-4 text-secondary hover-icon" title="Reservar Turnos" key="turnos" onClick={() => { setVista('turnos'); cerrarAtencion(); }} /> },
      { id: 'misTurnos', component: <FaListAlt className="mb-4 text-secondary hover-icon" title="Mis Turnos" key="misTurnos" onClick={() => { setVista('misTurnos'); cerrarAtencion(); }} /> },
      { id: 'agendaRegular', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Agenda Regular" key="agendaRegular" onClick={() => { setVista('agendaRegular'); cerrarAtencion(); }} /> },
      { id: 'fichaMedica', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" title="Ficha Médica" key="fichaMedica" onClick={() => { setVista('fichaMedica'); cerrarAtencion(); }} /> },
      { id: 'acreditarTurnos', component: <FaTicketAlt className="mb-4 text-secondary hover-icon" title="Acreditar Turnos" key="acreditarTurnos" onClick={() => { setVista('acreditarTurnos'); cerrarAtencion(); }} /> },
      { id: 'misTurnosMedico', component: <FaCalendarCheck className="fs-4 mb-4 text-secondary hover-icon" title="Mis Turnos Médicos" key="misTurnosMedico" onClick={() => { setVista('misTurnosMedico'); cerrarAtencion(); }} /> },
    ];

    let allowedIds = [];

    if (bool(parsedRoles.rolsuperadmin)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'file', 'fichaMedica','folder', 'servicios', 'turnos', 'misTurnos', 'excepcionesProf', 'acreditarTurnos'];
    } else if (bool(parsedRoles.roladministrativo)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'fichaMedica','servicios', 'turnos', 'misTurnos', 'excepcionesProf', 'acreditarTurnos'];
    } else if (bool(parsedRoles.rolpaciente)) {
      allowedIds = ['home', 'comments', 'fichaMedica', 'turnos', 'misTurnos'];
    } else if (bool(parsedRoles.rolmedico)) {
      allowedIds = ['home', 'comments', 'fichaMedica', 'misTurnosMedico'];
    }

    const filteredIcons = allIcons.filter(icon => allowedIds.includes(icon.id));
    setVisibleIcons(filteredIcons);

    if (parsedRoles.rolpaciente) {
      cargarTurnos();
    } else {
      setLoading(false);
    }
  }, [tieneMensajesNuevos, setTieneMensajesNuevos, cargarTurnos]);

  useEffect(() => {
    if (vista === 'inicio' && roles.rolpaciente) {
      cargarTurnos();
    }
  }, [vista, roles, cargarTurnos]);

  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        <div className="bg-white border-end d-flex flex-column align-items-center p-2 mt-4" style={{ width: '60px' }}>
          {visibleIcons.map(icon => icon.component)}
          <FaUsers className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Usuarios" onClick={() => { setVista('roles'); cerrarAtencion(); }} />
          <FaSignOutAlt className="fs-4 mt-auto mb-2 text-danger hover-icon" title="Cerrar sesión" onClick={handleLogout} />
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
            {turnoSeleccionado ? (
              <AtencionTurno idturno={turnoSeleccionado} onCerrar={cerrarAtencion} />
            ) : vista === 'roles' ? <Roles />
            : vista === 'servicios' ? <CargarServicio />
            : vista === 'excepcionesProf' ? <ExcepcionesProf />
            : vista === 'agendas' ? <Agendas />
            : vista === 'agendaRegular' ? <AgendaRegular />
            : vista === 'fichaMedica' ? <FichaMedica />
            : vista === 'chat' ? <Chat setTieneMensajesNuevos={setTieneMensajesNuevos} />
            : vista === 'turnos' ? (roles.roladministrativo || roles.rolsuperadmin) ? <ReservaTurnosAdmin /> : <ReservaTurnos />
            : vista === 'misTurnos' ? (roles.roladministrativo || roles.rolsuperadmin) ? <MisTurnosAdmin /> : <MisTurnos />
            : vista === 'acreditarTurnos' ? <AcreditarTurnos />
            : vista === 'misTurnosMedico' ? (
                <MisTurnosMedico setTurnoSeleccionado={setTurnoSeleccionado} />
              )
            : (
              <div>
                <h4 className="text-primary">Inicio</h4>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  turnoSeleccionado ? (
                    <AtencionTurno idturno={turnoSeleccionado} onCerrar={cerrarAtencion} />
                  ) : (
                    <Row className="g-4">
                      {(roles.rolpaciente || roles.rolmedico) && (
                        <VinTurnoHome
                          tipo="Consulta"
                          icono="bi bi-chat-left-dots"
                          nombreEspecialista="Consulta General"
                          especialidad="Medicina General"
                          fecha="Disponible"
                          tipoTurno="consulta"
                          onConversar={() => handleConversar('consulta-general')}
                        />
                      )}

                      {roles.rolpaciente && turnos.map((turno, index) => (
                        <VinTurnoHome
                          key={turno.idturno || index}
                          id={turno.idturno}
                          tipo={turno.tipo || "Presencial"}
                          icono="bi bi-calendar"
                          nombreEspecialista={`${turno.Profesional?.contacto?.nombre || "Profesional"} ${turno.Profesional?.contacto?.apellido || ""}`}
                          especialidad={turno.Servicio?.nombre || "Especialidad"}
                          fecha={formatearFecha(turno.dia)}
                          tipoTurno="presencial"
                          onTurnoActualizado={cargarTurnos}
                        />
                      ))}

                      {roles.rolpaciente && turnos.length === 0 && (
                        <Col md={12}>
                          <div className="text-center text-muted py-4">
                            <i className="bi bi-calendar-x fs-1 mb-3"></i>
                            <p>No tenés turnos programados próximamente.</p>
                          </div>
                        </Col>
                      )}

                      {roles.rolmedico && (
                        <TurnosHoyMedico setTurnoSeleccionado={setTurnoSeleccionado} />
                      )}
                    </Row>
                  )
                )}
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
