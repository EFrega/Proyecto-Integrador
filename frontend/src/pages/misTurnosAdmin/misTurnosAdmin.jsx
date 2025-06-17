import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Table, Button, InputGroup, Form, Card, Row, Col } from 'react-bootstrap';

const MisTurnosAdmin = () => {
  const API = process.env.REACT_APP_API_URL;
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');

  const [servicios, setServicios] = useState([]);
  const [idServicioSel, setIdServicioSel] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const pacientesPorPagina = 10;

  useEffect(() => {
    axios.get(`${API}/contactos?rolusuario=rolmedico`).then(res => setPacientes(res.data));
    axios.get(`${API}/servicios`).then(res => setServicios(res.data));
  }, [API]);

  const cargarTurnosPaciente = useCallback(async () => {
    if (!pacienteSel) return;

    try {
      const res = await axios.get(`${API}/turnos/mis-turnos/${pacienteSel.idcontacto}`);
      const turnosOrdenados = res.data.sort((a, b) => {
        const fechaA = `${a.dia} ${a.hora}`;
        const fechaB = `${b.dia} ${b.hora}`;
        return fechaA.localeCompare(fechaB);
      });
      setTurnos(turnosOrdenados);
    } catch (err) {
      alert('Error al cargar los turnos del paciente');
    }
  }, [API, pacienteSel]);

  const cancelarTurno = async (idturno) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar este turno?')) return;

    try {
      await axios.delete(`${API}/turnos/cancelar/${idturno}`);
      alert('Turno cancelado correctamente');
      cargarTurnosPaciente();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar turno');
    }
  };

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido} ${p.docum}`.toLowerCase().includes(busquedaPaciente.toLowerCase())
  );

  const pacientesPaginados = pacientesFiltrados.slice(
    (paginaActual - 1) * pacientesPorPagina,
    paginaActual * pacientesPorPagina
  );

  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);

  const turnosFiltrados = idServicioSel
    ? turnos.filter(t => t.Servicio?.idservicio === parseInt(idServicioSel))
    : turnos;

  useEffect(() => {
    if (pacienteSel) {
      cargarTurnosPaciente();
    }
  }, [pacienteSel, cargarTurnosPaciente]);

  return (
    <Container>
      <h3>Gestión de Turnos por Paciente (Administrativo)</h3>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar paciente por nombre, apellido o documento"
              value={busquedaPaciente}
              onChange={(e) => {
                setBusquedaPaciente(e.target.value);
                setPaginaActual(1);
              }}
            />
            <Button variant="outline-secondary" onClick={() => {
              setBusquedaPaciente('');
              setPaginaActual(1);
            }}>
              Limpiar
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>Pacientes encontrados:</h5>
          {pacientesPaginados.map(p => (
            <Card
              key={p.idcontacto}
              className={`mb-2 p-2 ${pacienteSel?.idcontacto === p.idcontacto ? 'bg-info text-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPacienteSel(p);
                setTurnos([]);
                setIdServicioSel('');
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
              <Button variant="outline-secondary" size="sm" disabled={paginaActual === 1} onClick={() => setPaginaActual(1)}>⏮️</Button>
              <Button variant="outline-secondary" size="sm" disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>◀️</Button>
              <span style={{ minWidth: '110px', textAlign: 'center' }}>
                Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
              </span>
              <Button variant="outline-secondary" size="sm" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>▶️</Button>
              <Button variant="outline-secondary" size="sm" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(totalPaginas)}>⏭️</Button>
            </div>
          </Col>
        </Row>
      )}

      {pacienteSel && (
        <>

          <hr />
          <Row>
            <Col md={4}>
              <Form.Label>Servicio</Form.Label>
              <Form.Select value={idServicioSel} onChange={(e) => setIdServicioSel(e.target.value)}>
                <option value="">Todos los servicios</option>
                {servicios.filter(s => s.activo).map(s => (
                  <option key={s.idservicio} value={s.idservicio}>{s.nombre}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <hr />
          <h5>Turnos reservados de {pacienteSel.nombre} {pacienteSel.apellido}</h5>
          {turnosFiltrados.length === 0 ? (
            <p>No tiene turnos reservados para el servicio seleccionado.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Profesional</th>
                  <th>Servicio</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {turnosFiltrados.map(t => (
                  <tr key={t.idturno}>
                    <td>{t.dia}</td>
                    <td>{t.hora.substring(0, 5)}</td>
                    <td>{t.Profesional?.contacto?.nombre} {t.Profesional?.contacto?.apellido}</td>
                    <td>{t.Servicio?.nombre}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => cancelarTurno(t.idturno)}>
                        Cancelar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
};

export default MisTurnosAdmin;
