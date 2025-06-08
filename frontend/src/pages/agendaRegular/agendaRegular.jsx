import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL; //Acá levanta el localhost del docker-compose

const diasSemana = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

const AgendaRegular = () => {
  const [profesional, setProfesional] = useState('');
  const [profesionalesLista, setProfesionalesLista] = useState([]);
  const [serviciosLista, setServiciosLista] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get(`${API}/profesionales`) // y lo mete acá
      .then(res => setProfesionalesLista(res.data))
      .catch(err => console.error('Error cargando profesionales:', err));

    axios.get(`${API}/servicios`)
      .then(res => setServiciosLista(res.data.filter(s => s.activo)))
      .catch(err => console.error('Error cargando servicios:', err));
  }, []);

  useEffect(() => {
    if (!profesional) return;
    axios.get(`${API}/agendaregular/${profesional}`)
      .then(res => {
        const agenda = res.data.map(item => ({
          id: Date.now() + Math.random(),
          servicio: item.idservicio,
          dias: diasSemana.reduce((acc, dia) => {
            acc[dia] = {
              activo: item[dia],
              inicio: item[`hora_init_${dia}`] || '',
              fin: item[`hora_fin_${dia}`] || ''
            };
            return acc;
          }, {})
        }));
        setBloques(agenda);
      })
      .catch(err => console.error('Error cargando agenda:', err));
  }, [profesional]);

  const agregarBloque = () => {
    setBloques([...bloques, {
      id: Date.now(),
      servicio: '',
      dias: diasSemana.reduce((acc, dia) => {
        acc[dia] = { activo: false, inicio: '', fin: '' };
        return acc;
      }, {})
    }]);
  };

  const eliminarBloque = async (idBloque, idservicio) => {
    if (!profesional || !idservicio) return;
    if (!window.confirm('¿Seguro que desea eliminar este bloque?')) return;

    try {
      await axios.delete(`${API}/agendaregular/${profesional}/${idservicio}`);
      setBloques(prev => prev.filter(b => b.id !== idBloque));
      setMensaje('Bloque eliminado.');
    } catch (err) {
      console.error('Error al eliminar bloque:', err);
      setMensaje('Error al eliminar bloque.');
    }
  };

  const handleCambioDia = (id, dia, campo, valor) => {
    setBloques(bloques.map(b => {
      if (b.id === id) {
        return {
          ...b,
          dias: {
            ...b.dias,
            [dia]: {
              ...b.dias[dia],
              [campo]: campo === 'activo' ? valor.target.checked : valor.target.value
            }
          }
        };
      }
      return b;
    }));
  };

  const guardarAgenda = async () => {
    if (!profesional) return setMensaje('Debe seleccionar un profesional.');
    const bloquesValidos = bloques.filter(b =>
      b.servicio &&
      diasSemana.some(d => b.dias[d].activo)
    );

    if (bloquesValidos.length === 0) {
      return setMensaje('Debe completar al menos un bloque con servicio y días.');
    }

    try {
      const payload = bloquesValidos.map(b => ({
        idprofesional: profesional,
        idservicio: parseInt(b.servicio),
        ...Object.fromEntries(diasSemana.flatMap(dia => [
          [`${dia}`, b.dias[dia].activo],
          [`hora_init_${dia}`, b.dias[dia].activo ? b.dias[dia].inicio || null : null],
          [`hora_fin_${dia}`, b.dias[dia].activo ? b.dias[dia].fin || null : null],
        ]))
      }));

      await axios.post(`${API}/agendaregular`, { agenda: payload });
      setMensaje('Agenda guardada correctamente.');
    } catch (err) {
      console.error('Error al guardar agenda:', err);
      setMensaje('Error al guardar agenda.');
    }
  };

  return (
    <div className="p-4">
      <h4 className="mb-4">Gestión de Agenda Regular</h4>

      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Seleccionar Profesional</Form.Label>
        <Form.Select value={profesional} onChange={(e) => setProfesional(e.target.value)}>
          <option value="">Seleccione...</option>
          {profesionalesLista.map((prof) => (
            <option key={prof.idprofesional} value={prof.idprofesional}>
              {prof.apellido}, {prof.nombre} ({prof.matricula || 'sin matrícula'})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {bloques.map((bloque, index) => (
        <Card key={bloque.id} className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Servicio</Form.Label>
                  <Form.Select
                    value={bloque.servicio}
                    onChange={(e) => {
                      const nuevo = [...bloques];
                      nuevo[index].servicio = e.target.value;
                      setBloques(nuevo);
                    }}>
                    <option value="">Seleccione un servicio</option>
                    {serviciosLista.map(serv => (
                      <option key={serv.idservicio} value={serv.idservicio}>
                        {serv.nombre} ({serv.duracionturno} min)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="text-end">
                <Button variant="danger" onClick={() => eliminarBloque(bloque.id, bloque.servicio)}>🗑</Button>
              </Col>
            </Row>

            {diasSemana.map((dia) => (
              <Row key={dia} className="align-items-center mb-2">
                <Col md={2}>
                  <Form.Check
                    type="checkbox"
                    label={dia.toUpperCase()}
                    checked={bloque.dias[dia].activo}
                    onChange={(e) => handleCambioDia(bloque.id, dia, 'activo', e)}
                  />
                </Col>
                {bloque.dias[dia].activo && (
                  <>
                    <Col md={5}>
                      <Form.Control
                        type="time"
                        value={bloque.dias[dia].inicio}
                        onChange={(e) => handleCambioDia(bloque.id, dia, 'inicio', e)}
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="time"
                        value={bloque.dias[dia].fin}
                        onChange={(e) => handleCambioDia(bloque.id, dia, 'fin', e)}
                      />
                    </Col>
                  </>
                )}
              </Row>
            ))}
          </Card.Body>
        </Card>
      ))}

      <div className="mb-4">
        <Button variant="primary" onClick={agregarBloque}>➕ Agregar Servicio</Button>
      </div>

      <Button variant="success" onClick={guardarAgenda}>Guardar Agenda</Button>
    </div>
  );
};

export default AgendaRegular;
