// src/pages/atencionTurno/atencionTurno.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import API from '../../helpers/api';

const AtencionTurno = ({ idturno, onCerrar }) => {
  const [turno, setTurno] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [observacionesAnteriores, setObservacionesAnteriores] = useState([]);
  const [observacionNueva, setObservacionNueva] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: turnoData } = await API.get(`/turnos/${idturno}`);
        setTurno(turnoData);

        const { data: fichaData } = await API.get(`/ficha/${turnoData.idcontacto}`);
        setFicha(fichaData);

        const { data: turnosAnteriores } = await API.get(`/turnos/mis-turnos/${turnoData.idcontacto}`);
        console.log('Turnos anteriores recibidos del backend:', turnosAnteriores);
        console.log('Observaciones extraídas:', turnosAnteriores.map(t => ({
          id: t.idturno,
          atendido: t.atendido,
          obs: t.observaciones
        })));

        const anteriores = turnosAnteriores
          .filter(t =>
            (t.atendido === true || t.atendido === 1 || t.atendido === '1') &&
            t.idturno !== turnoData.idturno &&
            typeof t.observaciones === 'string' &&
            t.observaciones.trim() !== ''
          )
          .sort((a, b) => new Date(b.dia + 'T' + b.hora) - new Date(a.dia + 'T' + a.hora));

        setObservacionesAnteriores(anteriores);
      } catch (error) {
        console.error('Error al cargar datos del turno:', error);
      }
    };

    if (idturno) cargarDatos();
  }, [idturno]);

  const handleAtender = async () => {
    try {
      await API.put(`/turnos/${idturno}`, {
        observaciones: observacionNueva,
        atendido: 1
      });
      alert('Turno marcado como atendido');
      if (onCerrar) onCerrar(); // vuelve al dashboard
    } catch (error) {
      console.error('Error al guardar observación:', error);
      alert('Error al guardar');
    }
  };

  if (!turno || !ficha) return <div className="p-4">Cargando datos del turno...</div>;

  console.log('anteriores filtrados:', observacionesAnteriores);

  return (
    <Container className="py-4">
      <h3 className="mb-4">Atención del Turno</h3>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Datos del Paciente</Card.Header>
            <Card.Body>
              <p><strong>Nombre:</strong> {turno.nombre} {turno.apellido}</p>
              <p><strong>Fecha de nacimiento:</strong> {turno.fechanacim ? new Date(turno.fechanacim).toLocaleDateString() : 'No disponible'}</p>
              <p><strong>Grupo Sanguíneo:</strong> {ficha.gruposang}</p>
              <p><strong>Cobertura:</strong> {ficha.cobertura}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Ficha Médica</Card.Header>
            <Card.Body>
              <p><strong>Antecedentes:</strong> {ficha.histenfermflia}</p>
              <p><strong>Observaciones:</strong> {ficha.observficha}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>Historial de Turnos Atendidos</Card.Header>
        <Card.Body>
          {observacionesAnteriores.length === 0 ? (
            <p>No hay turnos anteriores registrados como atendidos.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {observacionesAnteriores.map(obs => (
                  <tr key={obs.idturno}>
                    <td>{obs.dia}</td>
                    <td>{obs.hora}</td>
                    <td>{obs.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Observación Actual</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Escribir observación del turno actual</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={observacionNueva}
              onChange={e => setObservacionNueva(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onCerrar}>
              ← Volver
            </Button>

            <Button variant="success" onClick={handleAtender}>
              Paciente Atendido
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AtencionTurno;