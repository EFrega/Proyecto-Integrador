import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const API = process.env.REACT_APP_API_URL;

const Login = ({ setIsLoggedIn }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API}/login`, {
                usuario,
                contrasena,
            });

            const { token, usuario: nombreUsuario, roles } = response.data;

            if (!roles || typeof roles !== 'object') {
                console.error('Roles inválidos:', roles);
                setError('Error al obtener roles del usuario');
                return;
            }

            // Guardamos datos en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('usuario', nombreUsuario);
            localStorage.setItem('roles', JSON.stringify(roles));

            setIsLoggedIn(true);

            alert('¡Login exitoso!');
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
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <div>
                    <button type="submit">Iniciar sesión</button>
                </div>
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
        </div>
    );
};

export default Login;
