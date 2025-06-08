import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/login/login';  // Importa el componente Login
import Dashboard from './pages/dashboard/dashboard'; // importa el componente Dashboard
import Registro from './pages/register/register'; // importa el componente Register

function App() {
  const [, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para gestionar si el usuario está logueado

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }    
    // Esta parte es opcional, depende de si quieres mostrar un mensaje del servidor
    axios.get('http://localhost:5000')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.log('Hubo un error al conectarse con el servidor:', error);
      });
  }, []);

/*  const handleLoginSuccess = () => {
    setIsLoggedIn(true);  // Cambia el estado a "logueado"
  };*/

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
              <Dashboard setIsLoggedIn={setIsLoggedIn} />
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
