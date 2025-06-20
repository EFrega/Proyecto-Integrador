import './acreditarTurnos.css';
import React, { useEffect, useState } from 'react';
import API from '../../helpers/api';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';

const AcreditarTurnos = () => {

  const [pacientes, setPacientes] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const pacientesPorPagina = 10;
  
  useEffect(() => {
    API.get(`/contactos?rolusuario=rolmedico`).then(res => setPacientes(res.data));
  }, []);

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido} ${p.docum}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const pacientesPaginados = pacientesFiltrados.slice(
    (paginaActual - 1) * pacientesPorPagina,
    paginaActual * pacientesPorPagina
  );

  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);

    const cargarTurnosPaciente = async (idcontacto) => {
    setLoadingTurnos(true); // ⏳ Inicio de carga
    try {
        const res = await API.get(`/turnos/mis-turnos/${idcontacto}`);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const filtrados = res.data
        .filter(t => {
            if (!t.dia || !t.hora) return false;

            const fechaHora = new Date(`${t.dia}T${t.hora}`);
            const ahora = new Date();

            return fechaHora >= ahora;
        })
        .sort((a, b) => {
            const fechaA = new Date(`${a.dia}T${a.hora}`);
            const fechaB = new Date(`${b.dia}T${b.hora}`);
            return fechaA - fechaB;
        });

        setTurnos(filtrados);
    } catch (err) {
        console.error('Error al cargar turnos:', err);
    } finally {
        setLoadingTurnos(false); // ✅ Fin de carga
    }
    };




  const acreditarTurno = async (turno) => {
    try {
      await API.put(`/turnos/acreditar/${turno.idturno}`);
      alert('Turno acreditado correctamente');
      cargarTurnosPaciente(pacienteSel.idcontacto);
    } catch (err) {
      alert('Error al acreditar el turno');
    }
  };

  return (
    <Container>
      <h3>Acreditar Turnos</h3>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o documento"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
            <Button variant="outline-secondary" onClick={() => setBusqueda('')}>Limpiar</Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h5>Pacientes</h5>
          {pacientesPaginados.map(p => (
            <Card
            key={p.idcontacto}
            className={`mb-2 p-2 acreditar-card ${pacienteSel?.idcontacto === p.idcontacto ? 'acreditar-seleccionado' : ''}`}

              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPacienteSel(p);
                cargarTurnosPaciente(p.idcontacto);
              }}
            >
              {p.nombre} {p.apellido} - {p.docum}
            </Card>
          ))}
        </Col>
      </Row>

      {pacientesFiltrados.length > pacientesPorPagina && (
        <Row className="justify-content-center my-3">
          <Col xs="auto">
            <div className="d-flex gap-2 align-items-center">
              <Button size="sm" onClick={() => setPaginaActual(1)} disabled={paginaActual === 1}>⏮️</Button>
              <Button size="sm" onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>◀️</Button>
              <span>Página {paginaActual} de {totalPaginas}</span>
              <Button size="sm" onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>▶️</Button>
              <Button size="sm" onClick={() => setPaginaActual(totalPaginas)} disabled={paginaActual === totalPaginas}>⏭️</Button>
            </div>
          </Col>
        </Row>
      )}

      {pacienteSel && (
        <>
          <h5>Turnos próximos de {pacienteSel.nombre} {pacienteSel.apellido}</h5>
          <Row>
            {loadingTurnos ? (
            <Col><div className="spinner-border text-primary mt-2" role="status"><span className="visually-hidden">Cargando...</span></div></Col>
            ) : turnos.length === 0 ? (
            <Col><p>No hay turnos próximos para este paciente.</p></Col>
            ) : (
              turnos.map(t => (
                <Card key={t.idturno} className="mb-2 p-2">
                  <strong>Fecha:</strong> {new Date(t.dia).toLocaleDateString()}<br />
                  <strong>Hora:</strong> {t.hora?.substring(0, 5)}<br />
                  <strong>Servicio:</strong> {t.Servicio?.nombre}<br />
                  <strong>Profesional:</strong> {t.Profesional?.contacto?.nombre} {t.Profesional?.contacto?.apellido}<br />
                  <strong>Acreditado:</strong> {t.acreditado ? 'Sí' : 'No'}<br />
                  {!t.acreditado && (
                    <Button className="mt-2" disabled={t.acreditado} onClick={() => acreditarTurno(t)}>
                        {t.acreditado ? 'Acreditado' : 'Acreditar'}
                    </Button>
                  )}
                </Card>
              ))
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default AcreditarTurnos;