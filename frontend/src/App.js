import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Registro from './pages/register/register';
import socket from './pages/socket/socket';
const API = process.env.REACT_APP_API_URL;
function App() {
  const [, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tieneMensajesNuevos, setTieneMensajesNuevos] = useState(false); // 👉 nuevo

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }    
  
    axios.get(`${API}`)
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.log('Hubo un error al conectarse con el servidor:', error);
      });
  }, []);

  useEffect(() => {
    const idusuario = JSON.parse(localStorage.getItem('usuario') || '{}').idcontacto;

    const handleNuevoMensaje = (msg) => {
      console.log('[App] Recibido nuevo mensaje:', msg);
      if (msg.idsystemuserreceptor === idusuario) {
        console.log('[App] Mensaje para mí → actualizo icono global');
        setTieneMensajesNuevos(true);
      }
    };

    socket.on('nuevo-mensaje', handleNuevoMensaje);

    return () => {
      socket.off('nuevo-mensaje', handleNuevoMensaje);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/register" element={<Registro />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                setIsLoggedIn={setIsLoggedIn}
                tieneMensajesNuevos={tieneMensajesNuevos}
                setTieneMensajesNuevos={setTieneMensajesNuevos}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
