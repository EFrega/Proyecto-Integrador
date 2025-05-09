import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        usuario: '', // 👈 Campo agregado
        tipodoc: 'DNI',
        docum: '',
        fechanacim: '',
        correo: '',
        confirmarCorreo: '',
        contrasena: '',
        confirmarContrasena: '',
        direccion: '',
        telcontacto: '',
        telemergencia: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.correo !== formData.confirmarCorreo) {
            return setError('Los correos no coinciden');
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            return setError('Las contraseñas no coinciden');
        }

        try {
            await axios.post('http://localhost:5000/register', formData);
            alert('¡Registro exitoso!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar');
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2 className="register-title">Registro</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="form-row">
                        <Col><Form.Control name="nombre" placeholder="Nombre" onChange={handleChange} required /></Col>
                        <Col><Form.Control name="apellido" placeholder="Apellido" onChange={handleChange} required /></Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control name="usuario" placeholder="Nombre de usuario" onChange={handleChange} required /> {/* 👈 Campo nuevo */}
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control name="docum" placeholder="Nro. documento" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Select name="tipodoc" onChange={handleChange}>
                                <option value="DNI">DNI</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </Form.Select>
                        </Col>
                        
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control type="date" name="fechanacim" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Control name="direccion" placeholder="Dirección" onChange={handleChange} />
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control name="telcontacto" placeholder="Tel. contacto" onChange={handleChange} />
                        </Col>
                        <Col>
                            <Form.Control name="telemergencia" placeholder="Tel. emergencia" onChange={handleChange} />
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control type="email" name="correo" placeholder="Email" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Control type="email" name="confirmarCorreo" placeholder="Confirmar email" onChange={handleChange} required />
                        </Col>
                    </Row>

                    <Row className="form-row">
                        <Col>
                            <Form.Control type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Form.Control type="password" name="confirmarContrasena" placeholder="Confirmar contraseña" onChange={handleChange} required />
                        </Col>
                    </Row>

                    {error && <p className="error-message">{error}</p>}

                    <Button type="submit" className="register-button">Registrar</Button>
                    <Button variant="light" className="google-button">Registrarse con Google</Button>
                </Form>

                <div className="register-link">
                    ¿Ya tiene una cuenta? <Link to="/login">Ingresar</Link>
                </div>
            </div>
        </div>
    );
};

export default Registro;
