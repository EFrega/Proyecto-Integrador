import React, { useEffect, useState, useCallback } from 'react';
import API from '../../helpers/api';
import { Table, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', activo: true, duracionturno: '' });
    const [guardandoNuevo, setGuardandoNuevo] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [servicioEditado, setServicioEditado] = useState({});

    const cargarServicios = useCallback(async () => {
        try {
        setCargando(true);
        const res = await API.get(`/servicios`);
        setServicios(res.data);
        } catch (error) {
        console.error(error);
        setMensaje('Error al cargar los servicios.');
        } finally {
        setCargando(false);
        }
    }, []);
    
    useEffect(() => {
        cargarServicios();
    }, [cargarServicios]);

    const handleAgregarServicio = async (e) => {
        e.preventDefault();
        setMensaje('');
        const { nombre, duracionturno, activo } = nuevoServicio;
        const duracionInt = parseInt(duracionturno, 10);

        if (!nombre.trim() || isNaN(duracionInt) || duracionInt <= 0) {
        setMensaje('Complete todos los campos correctamente.');
        return;
        }

        try {
        
        setGuardandoNuevo(true);
        const res = await API.post(`/servicios`, {
            nombre: nombre.trim(),
            activo,
            duracionturno: duracionInt,
        });

        setServicios([...servicios, res.data]);
        setNuevoServicio({ nombre: '', activo: true, duracionturno: '' });
        setMensaje('Servicio agregado correctamente.');
        } catch {
        setMensaje('Error al agregar el servicio.');
        } finally {
        setGuardandoNuevo(false);
        }
    };

    const iniciarEdicion = (servicio) => {
        setEditandoId(servicio.idservicio);
        setServicioEditado({ ...servicio });
        setMensaje('');
    };

    const handleCambioEdicion = (e) => {
        const { name, value, type, checked } = e.target;
        setServicioEditado({ ...servicioEditado, [name]: type === 'checkbox' ? checked : value });
    };

    const guardarEdicion = async () => {
        const { nombre, duracionturno, activo } = servicioEditado;
        const duracionInt = parseInt(duracionturno, 10);

        if (!nombre.trim() || isNaN(duracionInt) || duracionInt <= 0) {
        setMensaje('Complete todos los campos correctamente al editar.');
        return;
        }

        try {
        await API.put(`/servicios/${editandoId}`, {
            nombre: nombre.trim(),
            activo,
            duracionturno: duracionInt,
        });

        setServicios(servicios.map((s) =>
            s.idservicio === editandoId ? { ...servicioEditado, duracionturno: duracionInt } : s
        ));
        setEditandoId(null);
        setMensaje('Servicio actualizado correctamente.');
        } catch {
        setMensaje('Error al actualizar el servicio.');
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
        <h3 className="mb-4">Listado de Servicios</h3>

        {mensaje && <Alert variant="info">{mensaje}</Alert>}

        {cargando ? (
            <div className="text-center py-5">
            <Spinner animation="border" />
            <div>Cargando servicios...</div>
            </div>
        ) : (
            <>
            <Table striped bordered hover responsive>
                <thead className="table-dark text-center">
                <tr>
                    <th>Nombre del Servicio</th>
                    <th>Estado</th>
                    <th>Duración del Turno (min)</th>
                    <th>Modificar</th>
                </tr>
                </thead>
                <tbody>
                {servicios.map((serv) => (
                    <tr key={serv.idservicio} className="text-center">
                    <td>
                        {editandoId === serv.idservicio ? (
                        <Form.Control
                            name="nombre"
                            value={servicioEditado.nombre}
                            onChange={handleCambioEdicion}
                        />
                        ) : (
                        serv.nombre
                        )}
                    </td>
                    <td>
                        {editandoId === serv.idservicio ? (
                        <Form.Check
                            type="checkbox"
                            name="activo"
                            label={servicioEditado.activo ? 'Activo' : 'Inactivo'}
                            checked={servicioEditado.activo}
                            onChange={handleCambioEdicion}
                            style={{ userSelect: 'none' }}
                        />
                        ) : (
                        serv.activo ? 'Activo' : 'Inactivo'
                        )}
                    </td>
                    <td>
                        {editandoId === serv.idservicio ? (
                        <Form.Control
                            name="duracionturno"
                            type="number"
                            min="1"
                            value={servicioEditado.duracionturno}
                            onChange={handleCambioEdicion}
                        />
                        ) : (
                        serv.duracionturno
                        )}
                    </td>
                    <td style={{ minWidth: '110px' }}>
                        {editandoId === serv.idservicio ? (
                        <>
                            <Button variant="success" size="sm" onClick={guardarEdicion} className="me-2">
                            Guardar
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setEditandoId(null)}>
                            Cancelar
                            </Button>
                        </>
                        ) : (
                        <FaEdit
                            style={{ cursor: 'pointer', color: '#0d6efd' }}
                            title="Modificar servicio"
                            size={18}
                            onClick={() => iniciarEdicion(serv)}
                        />
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <hr />
            <h5 className="mb-3">Agregar Nuevo Servicio</h5>

            <Form onSubmit={handleAgregarServicio}>
                <Row className="g-3">
                <Col md={4}>
                    <Form.Label>Nombre del Servicio</Form.Label>
                    <Form.Control
                    type="text"
                    value={nuevoServicio.nombre}
                    onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                    placeholder="Nombre"
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Activo</Form.Label>
                    <Form.Check
                    type="checkbox"
                    label={nuevoServicio.activo ? 'Activo' : 'Inactivo'}
                    checked={nuevoServicio.activo}
                    onChange={(e) =>
                        setNuevoServicio({ ...nuevoServicio, activo: e.target.checked })
                    }
                    style={{ userSelect: 'none' }}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Duración del Turno (min)</Form.Label>
                    <Form.Control
                    type="number"
                    min="1"
                    placeholder="Ej: 30"
                    value={nuevoServicio.duracionturno}
                    onChange={(e) =>
                        setNuevoServicio({ ...nuevoServicio, duracionturno: e.target.value })
                    }
                    />
                </Col>
                <Col md={2} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" disabled={guardandoNuevo} className="w-100">
                    {guardandoNuevo ? 'Guardando...' : 'Agregar'}
                    </Button>
                </Col>
                </Row>
            </Form>
            </>
        )}
        </div>
    );
};

export default Servicios;
