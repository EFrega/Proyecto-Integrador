import React, { useState, useEffect } from 'react';
import API from '../../helpers/api';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';

const ReservaTurnosAdmin = () => {

  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);

  const [disponibilidad, setDisponibilidad] = useState([]);

  const [idServicioSel, setIdServicioSel] = useState('');
  const [idProfesionalSel, setIdProfesionalSel] = useState('');

  const [turnosDiaSel, setTurnosDiaSel] = useState([]);
  const [diaSel, setDiaSel] = useState('');

  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const pacientesPorPagina = 10;

  useEffect(() => {
    API.get(`/servicios`).then(res => setServicios(res.data));
    API.get(`/contactos?rolusuario=rolmedico`).then(res => setPacientes(res.data)); // pedir pacientes
  }, []);

  const handleServicioChange = async (idServicioNuevo) => {
    setIdServicioSel(idServicioNuevo);
    setIdProfesionalSel('');
    setDisponibilidad([]);
    setTurnosDiaSel([]);
    setDiaSel('');

    if (idServicioNuevo) {
      const res = await API.get(`/profesionales/por-servicio/${idServicioNuevo}`);
      setProfesionales(res.data);
    } else {
      setProfesionales([]);
    }
  };

  const buscarDisponibilidad = async () => {
    if (!idServicioSel || !idProfesionalSel) return;

    const res = await API.get(`/turnos/disponibles/${idProfesionalSel}/${idServicioSel}`);
    setDisponibilidad(res.data);
    setTurnosDiaSel([]);
    setDiaSel('');
  };

  const reservarTurno = async (hora) => {
    try {
      await API.post(`/turnos/reservar`, {
        idcontacto: pacienteSel.idcontacto,
        idprofesional: idProfesionalSel,
        idservicio: idServicioSel,
        dia: diaSel,
        hora
      });

      alert('Turno reservado correctamente');
      buscarDisponibilidad(); // refrescar
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar turno');
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

  return (
    <Container>
      <h3>Reserva de Turnos (Administrativo)</h3>

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

      <Row className="mb-3">
        <Col>
          <h5>Pacientes encontrados:</h5>
          {pacientesPaginados.map(p => (
            <Card
              key={p.idcontacto}
              className={`mb-2 p-2 ${pacienteSel?.idcontacto === p.idcontacto ? 'bg-info text-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPacienteSel(p);
                setIdServicioSel('');
                setIdProfesionalSel('');
                setDisponibilidad([]);
                setTurnosDiaSel([]);
                setDiaSel('');
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
          <h5>Reservando turno para: {pacienteSel.nombre} {pacienteSel.apellido}</h5>

          <Row>
            <Col md={4}>
              <Form.Label>Servicio</Form.Label>
              <Form.Select value={idServicioSel} onChange={(e) => handleServicioChange(e.target.value)}>
                <option value="">Seleccione...</option>
                {servicios.filter(s => s.activo).map(s => (
                  <option key={s.idservicio} value={s.idservicio}>{s.nombre}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Profesional</Form.Label>
              <Form.Select value={idProfesionalSel} onChange={(e) => setIdProfesionalSel(e.target.value)}>
                <option value="">Seleccione...</option>
                {profesionales.map(p => (
                  <option key={p.idprofesional} value={p.idprofesional}>
                    {p.nombre} {p.apellido} - {p.matricula}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4} className="d-flex align-items-end">
              <Button onClick={buscarDisponibilidad}>Buscar Disponibilidad</Button>
            </Col>
          </Row>

          <hr />

          <Row>
            {disponibilidad.map(dia => (
              <Col key={dia.dia} md={2}>
                <Card className="mb-3 p-2" style={{ cursor: 'pointer' }} onClick={() => {
                  setDiaSel(dia.dia);
                  setTurnosDiaSel(dia.horarios);
                }}>
                  <Card.Body>
                    <Card.Title>{dia.dia}</Card.Title>
                    <Card.Text>{dia.horarios.length} turnos disponibles</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {diaSel && (
            <>
              <h5>Turnos disponibles para {diaSel}</h5>
              {turnosDiaSel.map(hora => (
                <Button
                  key={hora}
                  className="m-2"
                  onClick={() => reservarTurno(hora)}
                >
                  {hora.substring(0, 5)}
                </Button>
              ))}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default ReservaTurnosAdmin;
