import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, InputGroup, Form, Card, Row, Col } from 'react-bootstrap';

const MisTurnosAdmin = () => {
  const API = process.env.REACT_APP_API_URL;
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');

  useEffect(() => {
    axios.get(`${API}/contactos?rolusuario=rolmedico`).then(res => setPacientes(res.data));
  }, [API]);

  const cargarTurnosPaciente = async () => {
    if (!pacienteSel) return;

    const res = await axios.get(`${API}/turnos/mis-turnos/${pacienteSel.idcontacto}`);
    setTurnos(res.data);
  };

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

      <Row>
        <Col>
          <h5>Pacientes encontrados:</h5>
          {pacientesFiltrados.map(p => (
            <Card
              key={p.idcontacto}
              className={`mb-2 p-2 ${pacienteSel?.idcontacto === p.idcontacto ? 'bg-info text-white' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPacienteSel(p);
                setTurnos([]); // limpiar antes de cargar nuevos turnos
              }}
            >
              {p.nombre} {p.apellido} - {p.docum}
            </Card>
          ))}
        </Col>
      </Row>

      {pacienteSel && (
        <>
          <h5>Turnos reservados de {pacienteSel.nombre} {pacienteSel.apellido}</h5>
          <Button className="mb-3" onClick={cargarTurnosPaciente}>Ver Turnos</Button>

          {turnos.length === 0 ? (
            <p>No tiene turnos reservados.</p>
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
                {turnos.map(t => (
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
