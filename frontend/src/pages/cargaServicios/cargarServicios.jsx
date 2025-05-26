import React, { useState } from 'react';
import axios from 'axios';
//import './register.css';
import { Form, Button, Row, Col } from 'react-bootstrap';

const CargarServicio = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        activo: true,
        duracionturno: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.nombre || !formData.duracionturno) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            await axios.post('http://localhost:5000/servicios', formData);
            setSuccess('¡Servicio cargado con éxito!');
            setFormData({ nombre: '', activo: true, duracionturno: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar el servicio');
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2 className="register-title">Cargar Servicio</h2>
                <Form onSubmit={handleSubmit} className="col-12">
                    <Row className="form-row">
                        <Col>
                            <Form.Control
                                name="nombre"
                                placeholder="Nombre del servicio"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control
                                type="number"
                                name="duracionturno"
                                placeholder="Duración del turno (minutos)"
                                value={formData.duracionturno}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Check
                                type="checkbox"
                                label="Activo"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <Button type="submit" className="register-button">Guardar Servicio</Button>
                </Form>
            </div>
        </div>
    );
};

export default CargarServicio;
