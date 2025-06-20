import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Registro from './pages/register/register';
import AtencionTurno from './pages/atencionTurno/atencionTurno';
import socket from './pages/socket/socket';
import API from './helpers/api';

function App() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tieneMensajesNuevos, setTieneMensajesNuevos] = useState(false); // 👉 nuevo


  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);

    }    
  
    API.get(`/healthcheck`)

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
        <Route
          path="/atencion-turno/:idturno"
          element={
            isLoggedIn ? <AtencionTurno /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
