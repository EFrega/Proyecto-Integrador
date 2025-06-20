// src/pages/fichaMedica.jsx

import React, { useState, useEffect, useCallback } from 'react';
import API from '../../helpers/api';
import { Form, Button, Row, Col, InputGroup, Table, Pagination } from 'react-bootstrap';

function FichaMedica() {
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

// Fixed cargarFicha function - remove setContactoSeleccionado from here
const cargarFicha = useCallback(async (idcontacto) => {
    try {
        // Se obtiene la ficha médica por ID de contacto
        const res = await API.get(`/ficha/${idcontacto}`);
        // Se actualiza el estado con la ficha médica obtenida
        // Si no se obtiene nada, se establece un objeto vacío
        setFormData(res.data || {
            gruposang: '',
            cobertura: '',
            histenfermflia: '',
            observficha: ''
        });
        // REMOVE THIS LINE - it's overwriting contactoSeleccionado with incomplete data
        // setContactoSeleccionado({ idcontacto });
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
}, []);


useEffect(() => {
    const obtenerDatosUsuario = async () => {
        try {
            const rol = JSON.parse(localStorage.getItem('roles'));
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            console.log('Rol del usuario:', rol);

            setUsuarioActual({ ...usuario, roles: rol });
            console.log(typeof rol);
            if (rol.rolpaciente) {
                setContactoSeleccionado({
                    idcontacto: usuario.idcontacto,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    docum: usuario.docum
                });
                cargarFicha(usuario.idcontacto);
            } else {
                const contactos = await API.get(`/contactos`);
                setContactos(contactos.data);
                setContactosFiltrados(contactos.data);  
            }
        } catch (error) {
            console.error('Error al obtener datos de usuario:', error);
            alert('Error al obtener datos del usuario');
        }
    }

    obtenerDatosUsuario();   
}, [cargarFicha]);

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
            const res = await API.post(`/ficha`, {
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
        
        {usuarioActual && !usuarioActual.roles.rolpaciente && (
        <h3>Gestión de Fichas Médicas</h3>
        )}

        {/* oculta si el usuario es paciente o no tiene permisos */}
        {usuarioActual && !usuarioActual.roles.rolpaciente && (
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
        )}

        <Row>
            {usuarioActual && !usuarioActual.roles.rolpaciente && (
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
            )}
        

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

               {/* si el usuario es roladministrativo o rolsuperadmin no debe visualizar los campos de histenfermflia ni observficha*/}
                {usuarioActual && !(usuarioActual.roles.roladministrativo || usuarioActual.roles.rolsuperadmin) && (
                    <>
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
                    </>
                )}


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