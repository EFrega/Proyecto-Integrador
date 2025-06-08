import './excepcionesProf.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert, Modal, Row, Col } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import moment from 'moment';

const API = process.env.REACT_APP_API_URL;

const tiposLicencia = [
  { tipo: 'Vacaciones anuales pagas (<5 años)', dias: 14 },
  { tipo: 'Vacaciones anuales pagas (5-10 años)', dias: 21 },
  { tipo: 'Vacaciones anuales pagas (10-20 años)', dias: 28 },
  { tipo: 'Vacaciones anuales pagas (>20 años)', dias: 35 },
  { tipo: 'Nacimiento de hijo', dias: 2 },
  { tipo: 'Matrimonio', dias: 10 },
  { tipo: 'Fallecimiento (conyuge/hijos/padres)', dias: 3 },
  { tipo: 'Fallecimiento (hermano)', dias: 1 },
  { tipo: 'Examen de estudios', dias: 2 },
  { tipo: 'Enfermedad (<5 años antigüedad)', dias: 90 },
  { tipo: 'Enfermedad (>5 años antigüedad)', dias: 180 },
  { tipo: 'Maternidad (45+45 días)', dias: 90 },
  { tipo: 'Maternidad (30+60 días)', dias: 90 },
  { tipo: 'Licencia gremial', dias: null },
  { tipo: 'Licencia por cargo público', dias: null },
  { tipo: 'Donación de sangre', dias: 1 },
  { tipo: 'Adopción', dias: null },
  { tipo: 'Cambio de género', dias: null },
  { tipo: 'Violencia de género', dias: null },
];

const ExcepcionesProf = () => {
  const [excepciones, setExcepciones] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState({
    idprofesional: '',
    dia_inicio: '',
    dia_fin: '',
    tipo_licencia: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);

  const limpiarFormulario = () => {
    setForm({ idprofesional: '', dia_inicio: '', dia_fin: '', tipo_licencia: '' });
  };

  const fetchExcepciones = async () => {
    try {
      const res = await axios.get(`${API}/excepcionesProf`);
      setExcepciones(res.data);
    } catch (error) {
      setMensaje('Error al cargar las excepciones.');
    }
  };

  const fetchProfesionales = async () => {
    try {
      const res = await axios.get(`${API}/profesionales`);
      setProfesionales(res.data);
    } catch (error) {
      setMensaje('Error al cargar los profesionales.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevoForm = { ...form, [name]: value };

    if (name === 'tipo_licencia' && form.dia_inicio) {
      const tipo = tiposLicencia.find(t => t.tipo === value);
      if (tipo?.dias) {
        const fin = moment(form.dia_inicio).add(tipo.dias - 1, 'days').format('YYYY-MM-DD');
        nuevoForm.dia_fin = fin;
      }
    }

    if (name === 'dia_inicio' && form.tipo_licencia) {
      const tipo = tiposLicencia.find(t => t.tipo === form.tipo_licencia);
      if (tipo?.dias) {
        const fin = moment(value).add(tipo.dias - 1, 'days').format('YYYY-MM-DD');
        nuevoForm.dia_fin = fin;
      }
    }

    setForm(nuevoForm);
  };

  const guardarExcepcion = async () => {
    try {
      await axios.post(`${API}/excepcionesProf`, form);
      setMensaje('Excepción guardada correctamente.');
      fetchExcepciones();
      limpiarFormulario();
    } catch (error) {
      setMensaje('Error al guardar la excepción.');
    }
  };

  const eliminarExcepcion = async (idprofesional, dia_inicio) => {
    try {
      await axios.delete(`${API}/excepcionesProf/${idprofesional}/${dia_inicio}`);
      setMensaje('Excepción eliminada correctamente.');
      fetchExcepciones();
      limpiarFormulario();
    } catch (error) {
      setMensaje('Error al eliminar la excepción.');
    }
  };

  const abrirModalEditar = (excepcion) => {
    setForm({
      idprofesional: excepcion.idprofesional,
      dia_inicio: excepcion.dia_inicio.slice(0, 10),
      dia_fin: excepcion.dia_fin?.slice(0, 10) || '',
      tipo_licencia: excepcion.tipo_licencia
    });
    setRegistroActual({
      idprofesional: excepcion.idprofesional,
      dia_inicio: excepcion.dia_inicio.slice(0, 10)
    });
    setModalVisible(true);
  };

  const actualizarExcepcion = async () => {
    try {
      console.log('Actualizando con:', registroActual, form);
      await axios.put(`${API}/excepcionesProf/${registroActual.idprofesional}/${registroActual.dia_inicio}`, form);
      setMensaje('Excepción actualizada correctamente.');
      fetchExcepciones();
      setModalVisible(false);
      limpiarFormulario();
      console.log("Enviando PUT con:", registroActual, form);
    } catch (error) {
      setMensaje('Error al actualizar la excepción.');
    }
  };

  const obtenerNombreProfesional = (id) => {
    const prof = profesionales.find(p => p.idprofesional === id);
    return prof ? `${prof.apellido}, ${prof.nombre} (Mat. ${prof.matricula})` : id;
  };

  useEffect(() => {
    fetchExcepciones();
    fetchProfesionales();
  }, []);

  return (
    <Container>
      <h3 className="mb-4">Gestión de Excepciones del Profesional</h3>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}
      <Form className="bg-white p-4 rounded shadow-sm mb-4 w-100">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Profesional</Form.Label>
            <Form.Select name="idprofesional" onChange={handleChange} value={form.idprofesional}>
              <option value="">Seleccione profesional</option>
              {profesionales.map(p => (
                <option key={p.idprofesional} value={p.idprofesional}>
                  {p.apellido}, {p.nombre} - Matrícula: {p.matricula}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Tipo de licencia</Form.Label>
            <Form.Select name="tipo_licencia" onChange={handleChange} value={form.tipo_licencia}>
              <option value="">Seleccione tipo de licencia</option>
              {tiposLicencia.map((t, i) => (
                <option key={i} value={t.tipo}>{t.tipo}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Desde</Form.Label>
            <Form.Control type="date" name="dia_inicio" onChange={handleChange} value={form.dia_inicio} />
          </Col>
          <Col md={4}>
            <Form.Label>Hasta</Form.Label>
            <Form.Control type="date" name="dia_fin" onChange={handleChange} value={form.dia_fin} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4} className="d-flex align-items-end">
            <Button className="w-100" onClick={guardarExcepcion}>Guardar</Button>
          </Col>
        </Row>
      </Form>

      <h5>Excepciones cargadas</h5>
      <Table striped bordered hovser>
        <thead>
          <tr>
            <th>Profesional</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Tipo Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {excepciones.map((e, i) => (
            <tr key={i}>
              <td>{obtenerNombreProfesional(e.idprofesional)}</td>
              <td>{e.dia_inicio?.slice(0, 10)}</td>
              <td>{e.dia_fin?.slice(0, 10)}</td>
              <td>{e.tipo_licencia}</td>
              <td>
                <div className="d-flex gap-3 justify-content-center align-items-center">
                  <FaEdit
                    className="icon-action"
                    title="Editar"
                    onClick={() => abrirModalEditar(e)}
                  />
                  <FaTrashAlt
                    className="icon-action"
                    title="Eliminar"
                    onClick={() => eliminarExcepcion(e.idprofesional, e.dia_inicio)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Excepción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Tipo de licencia</Form.Label>
              <Form.Select name="tipo_licencia" onChange={handleChange} value={form.tipo_licencia}>
                <option value="">Seleccione tipo de licencia</option>
                {tiposLicencia.map((t, i) => (
                  <option key={i} value={t.tipo}>{t.tipo}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Desde</Form.Label>
              <Form.Control type="date" name="dia_inicio" onChange={handleChange} value={form.dia_inicio} />
            </Col>
            <Col md={6}>
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" name="dia_fin" onChange={handleChange} value={form.dia_fin} />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>Cancelar</Button>
          <Button variant="primary" onClick={actualizarExcepcion}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExcepcionesProf;
