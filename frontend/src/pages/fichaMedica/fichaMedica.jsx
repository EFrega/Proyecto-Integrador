// src/pages/fichaMedica.jsx

import React, { useState, useEffect } from 'react';
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
        histerenfmlia: '',
        observficha: ''
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(9);

    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        axios.get(`${API}/contactos`)
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
        setCurrentPage(1); // Reset to first page when searching
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
            <h5 className="mt-0">Ficha de: {contactoSeleccionado.nombre} {contactoSeleccionado.apellido}</h5>
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
            </Col>
            </>
        )}
        </Row>
        </div>
    );
}

export default FichaMedica;