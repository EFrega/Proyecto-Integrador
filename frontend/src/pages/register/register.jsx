import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Navbar, Container, Card, Alert, FormGroup, FormLabel, FormControl, CardBody } from 'react-bootstrap';

const API = process.env.REACT_APP_API_URL;

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
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
            await axios.post(`${API}/register`, formData);
            alert('¡Registro exitoso!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar');
        }
    };

    return (
        <div className='d-flex min-vh-100 flex-column'>
            <Navbar expand="lg" className="shadow bg-light px-4 py-2 justify-content-between">
                <Navbar.Brand className="text-primary">
                    <img src="logo.png" alt='logo' width={30} height={30} fluid className="d-inline-block align-top" />{' '}
                    Clínica<b>Médica</b>
                </Navbar.Brand>
            </Navbar>
            <div className="register-wrapper">
                <Container>
                    <Card className='p-4 shadow bg-white bg-opacity-75 border-0 rounded'>
                        <CardBody>
                            <h2 className="text-center mb-4">Registro</h2>
                            <Form onSubmit={handleSubmit}>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId="formNombre">
                                        <FormLabel>Nombre</FormLabel>
                                        <Form.Control name="nombre" placeholder="Nombre" onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId="formApellido">
                                        <FormLabel>Apellido</FormLabel>
                                        <Form.Control name="apellido" placeholder="Apellido" onChange={handleChange} required />
                                    </FormGroup>
                                </Row>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId="formTipoDoc">
                                        <FormLabel>Tipo de documento</FormLabel>
                                        <Form.Select name="tipodoc" onChange={handleChange}>
                                            <option value="DNI">DNI</option>
                                            <option value="Pasaporte">Pasaporte</option>
                                        </Form.Select>
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className='mb-3' controlId='formNumDoc'>
                                        <FormLabel>Número de documento</FormLabel>
                                        <FormControl name="docum" placeholder="Nro. documento" onChange={handleChange} required />
                                    </FormGroup>
                                </Row>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className='mb-3' controlId='formFechaNacim'>
                                        <FormLabel>Fecha de nacimiento</FormLabel>
                                        <FormControl type="date" name="fechanacim" onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className='mb-3' controlId='formDireccion'>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl name="direccion" placeholder="Dirección" onChange={handleChange} />
                                    </FormGroup>
                                </Row>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formTelContacto'>
                                        <FormLabel>Teléfono de contacto</FormLabel>
                                        <FormControl name="telcontacto" placeholder="Tel. contacto" onChange={handleChange} />
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formTelEmerg'>
                                        <FormLabel>Teléfono de emergencia</FormLabel>
                                        <FormControl name="telemergencia" placeholder="Tel. emergencia" onChange={handleChange} />
                                    </FormGroup>
                                </Row>
                                <div className='d-flex justify-content-center align-selft-stretch border-1'></div>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formEmail'>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl type="email" name="correo" placeholder="Email" onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formConfEmail'>
                                        <FormLabel>Confirmar email</FormLabel>
                                        <FormControl type="email" name="confirmarCorreo" placeholder="Confirmar email" onChange={handleChange} required />
                                    </FormGroup>
                                </Row>
                                <Row className='mb-3'>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formContrasenaReg'>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup as={Col} md="6" className="mb-3" controlId='formConfContrasenaReg'>
                                        <FormLabel>Confirmar contraseña</FormLabel>
                                        <FormControl type="password" name="confirmarContrasena" placeholder="Confirmar contraseña" onChange={handleChange} required />
                                    </FormGroup>
                                </Row>
                                <Button type="submit" variant="primary" className="w-100">Registrar</Button>
                            </Form>
                            <div className="text-center mt-3">
                                {error && <Alert variant="danger">{error}</Alert>}
                            </div>
                            <div className="text-center mt-3">
                                ¿Ya tiene una cuenta?{' '} <Link to="/" className="text-decoration-none">Ingresar</Link>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
            <footer className="text-bg-dark py-4 mt-auto">
                <Container>
                    <Row>
                        <Col md={4}>
                            <h5><img src="logo.png" alt='logo' width={30} height={30} fluid className="d-inline-block align-top" />{' '} Clínica<b>Médica</b></h5>
                        </Col>
                        <Col md={4}>
                            <p><b>Información Institucional</b></p>
                            <p>Especialidades médicas</p>
                            <p>Calidad y seguridad del paciente</p>
                        </Col>
                        <Col md={4}>
                            <p><b>Información Útil</b></p>
                            <p>Coberturas médicas</p>
                            <p>Solicite turno</p>
                            <p>Preguntas frecuentes</p>
                        </Col>
                    </Row>
                    <Row className="text-center mt-3">
                        <Col>
                            <small>©2025 Diseñado y desarrollado por <a className="text-info text-decoration-underline" href="https://www.linkedin.com/company/hifive-developers/" target="_blank" rel="noreferrer">HiFive Developers</a></small>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default Registro;
