import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, Table } from 'react-bootstrap';

function FichaMedica() {
    const API = process.env.REACT_APP_API_URL;
    const [contactos, setContactos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [contactosFiltrados, setContactosFiltrados] = useState([]);
    const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        gruposang: '',
        cobertura: '',
        histenfermflia: '',
        observficha: ''
    });

    const [usuarioActual, setUsuarioActual] = useState(null);

    const cargarFicha = useCallback(async (idcontacto) => {
        try {
            const res = await axios.get(`${API}/ficha/${idcontacto}`);
            setFormData(res.data || {
                gruposang: '',
                cobertura: '',
                histenfermflia: '',
                observficha: ''
            });
            setContactoSeleccionado({ idcontacto });
        } catch (error) {
            console.error('Error al cargar ficha:', error);
            setFormData({
                gruposang: '',
                cobertura: '',
                histenfermflia: '',
                observficha: ''
            });
        }
    }, [API]);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        const rolesGuardados = localStorage.getItem('roles');
        if (!usuarioGuardado || !rolesGuardados) {
            alert('Debe iniciar sesión');
            return;
        }

        const usuario = JSON.parse(usuarioGuardado);
        const roles = JSON.parse(rolesGuardados);

        console.log('Usuario:', usuario);
        console.log('Roles:', roles);

        setUsuarioActual({ ...usuario, roles });

        if (roles.rolpaciente) {
            cargarFicha(usuario.idcontacto);
        } else {
            axios.get(`${API}/contactos`)
                .then(res => {
                    setContactos(res.data);
                    setContactosFiltrados(res.data);
                })
                .catch(err => {
                    console.error('Error al obtener contactos:', err);
                });
        }
    }, [API, cargarFicha]);

    const handleBuscar = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);

        const filtrados = contactos.filter(c =>
            `${c.nombre} ${c.apellido} ${c.docum}`.toLowerCase().includes(valor.toLowerCase())
        );
        setContactosFiltrados(filtrados);
    };

    const seleccionarContacto = async (contacto) => {
        setContactoSeleccionado(contacto);
        cargarFicha(contacto.idcontacto);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async () => {
        if (!contactoSeleccionado || !usuarioActual) return;

        try {
            const res = await axios.post(`${API}/ficha`, {
                idusuario: usuarioActual.idusuario,
                idcontacto: contactoSeleccionado.idcontacto,
                ...formData
            });

            const { message, camposGuardados } = res.data;

            if (!camposGuardados || camposGuardados.length === 0) {
                alert(message || 'No tiene permisos para realizar cambios.');
            } else if (camposGuardados.length < Object.keys(formData).length) {
                alert(`${message || 'Algunos datos fueron guardados'}: ${camposGuardados.join(', ')}`);
            } else {
                alert(message || 'Ficha médica guardada correctamente.');
            }

        } catch (err) {
            console.error('Error al guardar ficha médica:', err);
            alert('Error al guardar ficha médica');
        }
    };

    return (
        <Container>
            <h3>Gestión de Fichas Médicas</h3>

            {usuarioActual && usuarioActual.roles && !usuarioActual.roles.rolpaciente && (
                <>
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
                </>
            )}

            {contactoSeleccionado && (
                <>
                    <h5>Ficha de: {contactoSeleccionado.nombre || 'Paciente'} {contactoSeleccionado.apellido || ''}</h5>
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

                        <Form.Group controlId="histenfermflia">
                            <Form.Label>Historial Familiar</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="histenfermflia"
                                value={formData.histenfermflia}
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
