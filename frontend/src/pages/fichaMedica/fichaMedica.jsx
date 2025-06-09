// src/pages/fichaMedica.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, Table } from 'react-bootstrap';

function FichaMedica() {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [contactosFiltrados, setContactosFiltrados] = useState([]);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    gruposang: '',
    cobertura: '',
    histerenfmlia: '',
    observficha: ''
  });

  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/contactos')
      .then(res => {
        console.log('Contactos recibidos:', res.data);
        setContactos(res.data);
        setContactosFiltrados(res.data);
      })
      .catch(err => {
        console.error('Error al obtener contactos:', err);
      });

    setUsuarioActual({ idusuario: 1, rolsuperadmin: true });
  }, []);

  const handleBuscar = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    const filtrados = contactos.filter(c =>
      `${c.nombre} ${c.apellido} ${c.docum}`.toLowerCase().includes(valor.toLowerCase())
    );
    console.log('Contactos filtrados:', filtrados);
    setContactosFiltrados(filtrados);
  };

  const seleccionarContacto = async (contacto) => {
    setContactoSeleccionado(contacto);
    try {
      console.log('Buscando ficha para ID:', contacto.idcontacto);
      const res = await axios.get(`/ficha/${contacto.idcontacto}`);
      console.log('Ficha médica recibida:', res.data);
      setFormData(res.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No hay ficha médica para este contacto');
        setFormData({
          gruposang: '',
          cobertura: '',
          histerenfmlia: '',
          observficha: ''
        });
      } else {
        console.error('Error real al buscar ficha médica:', error);
        alert('Error al consultar ficha médica');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!contactoSeleccionado || !usuarioActual) return;

    try {
      await axios.post('/ficha', {
        idusuario: usuarioActual.idusuario,
        idcontacto: contactoSeleccionado.idcontacto,
        ...formData
      });

      alert('Ficha médica guardada correctamente');
    } catch (err) {
      console.error('Error al guardar ficha médica:', err);
      alert('Error al guardar ficha médica');
    }
  };

  return (
    <Container>
      <h3>Gestión de Fichas Médicas</h3>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o documento"
              value={busqueda}
              onChange={handleBuscar}
            />
            <Button
              variant="outline-secondary"
              onClick={() => {
                setBusqueda('');
                setContactosFiltrados(contactos);
              }}
            >
              Limpiar
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Documento</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {contactosFiltrados.map(contacto => (
            <tr key={contacto.idcontacto}>
              <td>{contacto.nombre}</td>
              <td>{contacto.apellido}</td>
              <td>{contacto.docum}</td>
              <td>
                <Button onClick={() => seleccionarContacto(contacto)}>Seleccionar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {contactoSeleccionado && (
        <>
          <h5>Ficha de: {contactoSeleccionado.nombre} {contactoSeleccionado.apellido}</h5>
          <Form>
            <Form.Group controlId="gruposang">
              <Form.Label>Grupo Sanguíneo</Form.Label>
              <Form.Control
                type="text"
                name="gruposang"
                value={formData.gruposang}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="cobertura">
              <Form.Label>Cobertura</Form.Label>
              <Form.Control
                type="text"
                name="cobertura"
                value={formData.cobertura}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="histerenfmlia">
              <Form.Label>Historial Familiar</Form.Label>
              <Form.Control
                as="textarea"
                name="histerenfmlia"
                value={formData.histerenfmlia}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="observficha">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observficha"
                value={formData.observficha}
                onChange={handleChange}
              />
            </Form.Group>

            <Button className="mt-2" onClick={handleGuardar}>Guardar Ficha</Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default FichaMedica;
