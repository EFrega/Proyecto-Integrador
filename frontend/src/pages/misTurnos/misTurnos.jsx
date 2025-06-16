import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const MisTurnos = () => {
  const API = process.env.REACT_APP_API_URL;
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(usuarioLocal);

    if (usuarioLocal?.idcontacto) {
      axios.get(`${API}/turnos/mis-turnos/${usuarioLocal.idcontacto}`)
        .then(res => setTurnos(res.data))
        .catch(err => console.error('Error al obtener mis turnos:', err));
    }
  }, [API]);

  const cancelarTurno = async (idturno) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar este turno?')) return;

    try {
      await axios.delete(`${API}/turnos/cancelar/${idturno}`);
      alert('Turno cancelado correctamente');
      // refrescar
      const res = await axios.get(`${API}/turnos/mis-turnos/${usuario.idcontacto}`);
      setTurnos(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar turno');
    }
  };

  return (
    <Container>
      <h3>Mis Turnos Reservados</h3>

      {turnos.length === 0 ? (
        <p>No tenés turnos reservados.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Profesional</th>
              <th>Servicio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map(t => {
                console.log(t); // 👈 ponelo acá

                return (
                <tr key={t.idturno}>
                    <td>{t.dia}</td>
                    <td>{t.hora.substring(0, 5)}</td>
                    <td>{t.Profesional?.contacto?.nombre} {t.Profesional?.contacto?.apellido}</td>
                    <td>{t.Servicio?.nombre}</td>
                    <td>
                    <Button variant="danger" size="sm" onClick={() => cancelarTurno(t.idturno)}>
                        Cancelar
                    </Button>
                    </td>
                </tr>
                );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MisTurnos;
