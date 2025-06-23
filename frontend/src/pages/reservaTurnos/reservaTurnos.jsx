import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API from '../../helpers/api';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './reservaTurnos.css'; // asegurate de que coincida en mayúsculas/minúsculas

const ReservaTurnos = () => {
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [idServicioSel, setIdServicioSel] = useState('');
  const [idProfesionalSel, setIdProfesionalSel] = useState('');

  const [turnosDiaSel, setTurnosDiaSel] = useState([]);
  const [diaSel, setDiaSel] = useState('');

  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    API.get(`/servicios`).then(res => setServicios(res.data));
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(usuarioLocal);
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
        idcontacto: usuario.idcontacto,
        idprofesional: idProfesionalSel,
        idservicio: idServicioSel,
        dia: diaSel,
        hora
      });
      alert('Turno reservado correctamente');
      setTimeout(() => buscarDisponibilidad(), 300);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al reservar turno');
    }
  };

  const diasDisponibles = disponibilidad.map(d => d.dia);

  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    const fecha = date.toISOString().split('T')[0];
    return !diasDisponibles.includes(fecha);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const fecha = date.toISOString().split('T')[0];
    if (diasDisponibles.includes(fecha)) return 'dia-disponible';
    return 'dia-no-disponible';
  };

  const handleDateSelect = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    const turno = disponibilidad.find(d => d.dia === fechaStr);
    if (turno) {
      setDiaSel(fechaStr);
      setTurnosDiaSel(turno.horarios);
    } else {
      setDiaSel('');
      setTurnosDiaSel([]);
    }
  };

  return (
    <Container>
      <h3>Reserva de Turnos</h3>

      <Row className="mb-3">
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

      {disponibilidad.length > 0 && (
        <div className="calendario-container mb-4">
          <Calendar
            onClickDay={handleDateSelect}
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
          />
        </div>
      )}

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
