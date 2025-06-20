// src/pages/misTurnosMedico.jsx

import React, { useEffect, useState, useCallback } from 'react';
import API from '../../helpers/api';
import { Table, Container, Button, Form } from 'react-bootstrap';

const MisTurnosMedico = ({ setTurnoSeleccionado }) => {
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarTurnos = useCallback(async () => {
    try {
      const res = await API.get(`/turnos/mis-turnos-profesional/${usuario.idprofesional}`);
      console.log('Turnos recibidos:', res.data);

      const filtrados = res.data.filter(t => {
        const fechaTurno = new Date(t.dia).toISOString().split('T')[0];
        return (t.acreditado === true || t.acreditado === 1 || t.acreditado === '1') && fechaTurno === fechaSeleccionada;
      });

      filtrados.sort((a, b) => `${a.dia}T${a.hora}`.localeCompare(`${b.dia}T${b.hora}`));
      setTurnos(filtrados);
    } catch (err) {
      console.error('Error al cargar turnos del médico:', err);
    }
  }, [usuario.idprofesional, fechaSeleccionada]);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles') || '{}');
    if (roles.rolmedico) cargarTurnos();
  }, [cargarTurnos]);

  return (
    <Container className="mt-4">
      <h3>Mis Turnos Médicos</h3>

      <Form.Group className="mb-3" controlId="fecha">
        <Form.Label>Seleccionar Fecha</Form.Label>
        <Form.Control
          type="date"
          value={fechaSeleccionada}
          onChange={e => setFechaSeleccionada(e.target.value)}
        />
      </Form.Group>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map(turno => (
            <tr key={turno.idturno}>
              <td>{turno.nombre} {turno.apellido}</td>
              <td>{turno.nombreservicio}</td>
              <td>{turno.dia}</td>
              <td>{turno.hora}</td>
              <td>{turno.atendido ? 'Atendido' : 'Acreditado'}</td>
              <td className="text-center">
                {turno.atendido ? (
                  <span className="text-success fw-bold">Atendido</span>
                ) : (
                <Button size="sm" onClick={() => setTurnoSeleccionado(turno.idturno)}>
                  Atender
                </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MisTurnosMedico;
