import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';


const ReservaTurnosAdmin = () => {
  const API = process.env.REACT_APP_API_URL;

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

  useEffect(() => {
    axios.get(`${API}/servicios`).then(res => setServicios(res.data));
    axios.get(`${API}/contactos?rolusuario=rolmedico`).then(res => setPacientes(res.data)); // pedir pacientes
  }, [API]);

  const buscarDisponibilidad = async () => {
    if (!idServicioSel || !idProfesionalSel) return;

    const res = await axios.get(`${API}/turnos/disponibles/${idProfesionalSel}/${idServicioSel}`);
    setDisponibilidad(res.data);
    setTurnosDiaSel([]);
    setDiaSel('');
  };

const handleServicioChange = async (idServicioNuevo) => {
  setIdServicioSel(idServicioNuevo);
  setIdProfesionalSel('');
  setDisponibilidad([]);
  setTurnosDiaSel([]);
  setDiaSel('');

  if (idServicioNuevo) {
    const res = await axios.get(`${API}/profesionales/por-servicio/${idServicioNuevo}`);
    setProfesionales(res.data);
  } else {
    setProfesionales([]);
  }
};

  const reservarTurno = async (hora) => {
    try {
      await axios.post(`${API}/turnos/reservar`, {
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
              onChange={(e) => setBusquedaPaciente(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => {
                setBusquedaPaciente('');
              }}
            >
              Limpiar
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h5>Pacientes encontrados:</h5>
          {pacientesFiltrados.map(p => (
            <Card
              key={p.idcontacto}
              className={`mb-2 p-2 ${pacienteSel?.idcontacto === p.idcontacto ? 'bg-info text-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setPacienteSel(p)}
            >
              {p.nombre} {p.apellido} - {p.docum}
            </Card>
          ))}
        </Col>
      </Row>

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
