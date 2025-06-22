import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import VinTurnoHome from '../vinTurnoHome/vinturnohome';
import API from '../../helpers/api';

const TurnosHoyMedico = ({ setTurnoSeleccionado }) => {
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarTurnos = useCallback(async () => {
    try {
      const res = await API.get(`/turnos/mis-turnos-profesional/${usuario.idprofesional}`);
      const data = await res.data;

      const filtrados = data.filter(t => {
        const fechaTurno = new Date(t.dia).toISOString().split('T')[0];
        return fechaTurno === fechaSeleccionada;
      });

      filtrados.sort((a, b) => `${a.dia}T${a.hora}`.localeCompare(`${b.dia}T${b.hora}`));
      setTurnos(filtrados);
    } catch (error) {
      console.error('Error al cargar turnos del médico:', error);
    }
  }, [fechaSeleccionada, usuario.idprofesional]);

  useEffect(() => {
    cargarTurnos();
  }, [cargarTurnos]);

  return (
    <div>
      <Form.Group controlId="fechaTurnos" className="mb-4">
        <Form.Label className="fw-semibold">Ver turnos del día:</Form.Label>
        <Form.Control
          type="date"
          value={fechaSeleccionada}
          onChange={e => setFechaSeleccionada(e.target.value)}
          className="w-auto"
        />
      </Form.Group>

      <Row className="g-4">
        {turnos.length === 0 ? (
          <Col md={12}>
            <div className="text-muted">No hay turnos acreditados para este día.</div>
          </Col>
        ) : (
          turnos.map(turno => (
            <VinTurnoHome
              key={turno.idturno}
              id={turno.idturno}
              tipo="Presencial"
              icono="bi bi-person-check"
              nombreEspecialista={`${turno.nombre} ${turno.apellido}`}
              especialidad={turno.nombreservicio}
              fecha={new Date(`${turno.dia}T${turno.hora}`).toLocaleString('es-AR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
              tipoTurno="presencial"
              estado={
                turno.atendido
                  ? 'completado'
                  : turno.acreditado
                    ? 'acreditado'
                    : 'reservado'
              }
              acreditado={turno.acreditado}
              onTurnoActualizado={cargarTurnos}
              onModificar={() => {
                console.log('Click en Atender para ID', turno.idturno, 'Atendido:', turno.atendido);
                const estaAtendido = turno.atendido === true || turno.atendido === 1 || turno.atendido === '1';
                if (estaAtendido) return;
                setTurnoSeleccionado(turno.idturno);
              }}
            />
          ))
        )}
      </Row>
    </div>
  );
};

export default TurnosHoyMedico;