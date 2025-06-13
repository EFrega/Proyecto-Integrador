// src/pages/fichaMedica.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, InputGroup, Table, Pagination } from 'react-bootstrap';

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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(9);

    const [usuarioActual, setUsuarioActual] = useState(null);

    // useCallback para memorizar una función que carga una ficha médica por ID de contacto
    // La función se vuelve a crear solo cuando cambia la variable de entorno API
    // Se utiliza esta técnica para evitar que se cree una nueva función en cada renderizado
    // y así evitar que se dispare useEffect innecesariamente
    const cargarFicha = useCallback(async (idcontacto) => {
        try {
            // Se obtiene la ficha médica por ID de contacto
            const res = await axios.get(`${API}/ficha/${idcontacto}`);
            // Se actualiza el estado con la ficha médica obtenida
            // Si no se obtiene nada, se establece un objeto vacío
            setFormData(res.data || {
                gruposang: '',
                cobertura: '',
                histenfermflia: '',
                observficha: ''
            });
            // Se actualiza el estado con el contacto seleccionado
            setContactoSeleccionado({ idcontacto });
        } catch (error) {
            // Si ocurre un error, se muestra en consola
            console.error('Error al cargar ficha:', error);
            // Se establece el estado con un objeto vacío
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
        setCurrentPage(1); // Reset to first page when searching
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

    // Pagination logic
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contactosFiltrados.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(contactosFiltrados.length / contactsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        let items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        items.push(
            <Pagination.Prev
                key="prev"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            />
        );

        // First page
        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis1" />);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis2" />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        // Next button
        items.push(
            <Pagination.Next
                key="next"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            />
        );

        return items;
    };

    return (
        <div className="p-4 bg-white shadow rounded">
        
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
                    setCurrentPage(1);
                }}
                >
                Limpiar
                </Button>
            </InputGroup>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
                
                
                <Table table-striped-columns bordered hover >
                    <thead className="table-dark text-center">
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Documento</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {currentContacts.map(contacto => (
                        <tr 
                            key={contacto.idcontacto} 
                            onClick={() => seleccionarContacto(contacto)}
                            style={{ cursor: 'pointer' }}
                            className={contactoSeleccionado?.idcontacto === contacto.idcontacto ? 'table-active' : ''}
                        >
                        <td>{contacto.nombre}</td>
                        <td>{contacto.apellido}</td>
                        <td>{contacto.docum}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                

                {totalPages > 1 && (
                    <div className="d-flex justify-content-between">
                        <small className="text-muted">
                        Mostrando {indexOfFirstContact + 1} a {Math.min(indexOfLastContact, contactosFiltrados.length)} de {contactosFiltrados.length} contactos
                        </small>
                        <Pagination size="sm">
                            {renderPaginationItems()}
                        </Pagination>
                    </div>
                )}
            </Col>
        

        {contactoSeleccionado && (
            <>
            <Col md={6} className="px-5 mt-0">
            <h5>Ficha de: {contactoSeleccionado.nombre || 'Paciente'} {contactoSeleccionado.apellido || ''}</h5>
            <Form className="w-100">
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
            </Col>
            </>
        )}
        </Row>
        </div>
    );
}

export default FichaMedica;