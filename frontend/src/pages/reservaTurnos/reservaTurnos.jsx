import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const ReservaTurnos = () => {
  const API = process.env.REACT_APP_API_URL;

  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [idServicioSel, setIdServicioSel] = useState('');
  const [idProfesionalSel, setIdProfesionalSel] = useState('');

  const [turnosDiaSel, setTurnosDiaSel] = useState([]);
  const [diaSel, setDiaSel] = useState('');

  const [usuario, setUsuario] = useState({});

    useEffect(() => {
    axios.get(`${API}/servicios`).then(res => setServicios(res.data));
    // ya NO traemos profesionales acá

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(usuarioLocal);
    }, [API]);

    const handleServicioChange = async (idServicioNuevo) => {
        setIdServicioSel(idServicioNuevo);
        setIdProfesionalSel(''); // reset profesional

        // limpiar turnos anteriores
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



  const buscarDisponibilidad = async () => {
    if (!idServicioSel || !idProfesionalSel) return;

    const res = await axios.get(`${API}/turnos/disponibles/${idProfesionalSel}/${idServicioSel}`);
    setDisponibilidad(res.data);
    setTurnosDiaSel([]);
    setDiaSel('');
  };

  const reservarTurno = async (hora) => {
    try {
      await axios.post(`${API}/turnos/reservar`, {
        idcontacto: usuario.idcontacto,
        idprofesional: idProfesionalSel,
        idservicio: idServicioSel,
        dia: diaSel,
        hora
      });

    alert('Turno reservado correctamente');
    setTimeout(() => {
        buscarDisponibilidad(); // refrescar
    }, 300);

    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar turno');
    }
  };

  return (
    <Container>
      <h3>Reserva de Turnos</h3>

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
            <Form.Select value={idProfesionalSel} onChange={(e) => {
            setIdProfesionalSel(e.target.value);

            // limpiar turnos anteriores
            setDisponibilidad([]);
            setTurnosDiaSel([]);
            setDiaSel('');
            }}>
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
    </Container>
  );
};

export default ReservaTurnos;
