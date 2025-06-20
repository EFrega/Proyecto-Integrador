import React, { useEffect, useState } from 'react';
import API from '../../helpers/api';
import { Table, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';


const Feriados = () => {
    const [feriados, setFeriados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [nuevoFeriado, setNuevoFeriado] = useState({ dia: '', motivoferiado: '' });
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarFeriados();
    }, []);

    const cargarFeriados = async () => {
        try {
            setCargando(true);
            const res = await API.get(`/agendas`);
            setFeriados(res.data);
        } catch (error) {
            setMensaje('Error al cargar los feriados.');
        } finally {
            setCargando(false);
        }
    };

    const handleAgregarFeriado = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (!nuevoFeriado.dia || !nuevoFeriado.motivoferiado.trim()) {
            setMensaje('Complete todos los campos.');
            return;
        }

        try {
            setGuardando(true);
            const res = await API.post(`/agendas`, {
                dia: nuevoFeriado.dia,
                motivoferiado: nuevoFeriado.motivoferiado.trim(),
            });

            setFeriados([...feriados, res.data]);
            setNuevoFeriado({ dia: '', motivoferiado: '' });
            setMensaje('Feriado agregado correctamente.');
        } catch (error) {
            setMensaje('Error al agregar el feriado.');
        } finally {
            setGuardando(false);
        }
    };

    const eliminarFeriado = async (dia) => {
        try {
            await API.delete(`/agendas/${dia}`);
            setFeriados(feriados.filter(f => f.dia !== dia));
            setMensaje('Feriado eliminado.');
        } catch {
            setMensaje('Error al eliminar el feriado.');
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h3 className="mb-4">Agenda de Feriados</h3>

            {mensaje && <Alert variant="info">{mensaje}</Alert>}

            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <div>Cargando feriados...</div>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Fecha</th>
                                <th>Motivo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feriados.map((f) => (
                                <tr key={f.dia} className="text-center">
                                    <td>{(() => {
                                        const [y, m, d] = f.dia.split('-');
                                        return `${d}/${m}/${y}`;
                                        })()}
                                    </td>
                                    <td>{f.motivoferiado}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => eliminarFeriado(f.dia)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <hr />
                    <h5 className="mb-3">Agregar Nuevo Feriado</h5>

                    <Form onSubmit={handleAgregarFeriado}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label>Fecha del Feriado</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={nuevoFeriado.dia}
                                    onChange={(e) =>
                                        setNuevoFeriado({ ...nuevoFeriado, dia: e.target.value })
                                    }
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Motivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Motivo del feriado"
                                    value={nuevoFeriado.motivoferiado}
                                    onChange={(e) =>
                                        setNuevoFeriado({
                                            ...nuevoFeriado,
                                            motivoferiado: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <Button type="submit" variant="primary" disabled={guardando} className="w-100">
                                    {guardando ? 'Guardando...' : 'Agregar'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </div>
    );
};

export default Feriados;
