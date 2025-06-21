import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../helpers/api';
import './login.css';
import { Navbar, Container, Row, Col, Card, Form, Button, Alert, CardBody, FormLabel, FormControl, FormGroup } from 'react-bootstrap';


const Login = ({ setIsLoggedIn }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API.post(`/login`, {
                usuario,
                contrasena,
            });

            const { token, idusuario, idcontacto, nombre, apellido, usuario: nombreUsuario, roles } = response.data;

            if (!roles || typeof roles !== 'object') {
                console.error('Roles inválidos:', roles);
                setError('Error al obtener roles del usuario');
                return;
            }

            // Guardamos datos en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('usuario', JSON.stringify({
                idusuario,
                idcontacto,
                idprofesional: response.data.idprofesional ?? null,
                nombre,
                apellido,
                nombreUsuario
            }));
            localStorage.setItem('roles', JSON.stringify(roles));

            setIsLoggedIn(true);

            //alert('¡Login exitoso!');
            setUsuario('');
            setContrasena('');
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Error en la autenticación');
            }
        }
    };

    return (
        <div className='d-flex min-vh-100 flex-column'>
            <Navbar expand="lg" className='shadow bg-light px-4 py-2 justify-content-between'>
                <Navbar.Brand className='text-primary'>
                    <img src='logo.png' alt='logo' width={30} height={30} fluid className='d-inline-block align-top' />{' '}
                    Clínica<b>Medici</b>
                </Navbar.Brand>
            </Navbar>
            <div className='login-wrapper'>
                <Container>
                    <Row className='justify-content-center'>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card className='p-4 shadow bg-white bg-opacity-75 border-0 rounded'>
                                <CardBody>
                                    <h3 className='text-center mb-5'>Inicie sesión</h3>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup className='mb-4' controlId='formUsuario'>
                                            <FormLabel className='visually-hidden'>Usuario</FormLabel>
                                            <FormControl
                                                type='text'
                                                value={usuario}
                                                onChange={(e) => setUsuario(e.target.value)}
                                                placeholder='Ingrese su usuario'
                                                required />
                                        </FormGroup>
                                        <FormGroup className='mb-4' controlId='formContrasena'>
                                            <FormLabel className='visually-hidden'>Contraseña</FormLabel>
                                            <FormControl
                                                type='password'
                                                value={contrasena}
                                                onChange={(e) => setContrasena(e.target.value)}
                                                placeholder='Ingrese su contraseña'
                                                required />
                                        </FormGroup>
                                        <Button type='submit' variant='primary' className='w-100'>Iniciar sesión</Button>
                                    </Form>
                                    <div className='text-center mt-3'>
                                        {error && <Alert variant='danger'>{error} </Alert>}
                                    </div>
                                    <div className='text-center mt-3'>
                                        ¿No tiene una cuenta?{' '} <Link to="/register" className="text-decoration-none">Registrese</Link>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
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

export default Login;
