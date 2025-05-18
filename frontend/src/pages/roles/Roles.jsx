import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Alert, Spinner, Container } from 'react-bootstrap';

const Roles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(() => setMensaje('Error al cargar usuarios'))
      .finally(() => setCargando(false));
  }, []);

  const toggleRol = (idusuario, rol) => {
    setUsuarios(prev =>
      prev.map(user =>
        user.idusuario === idusuario
          ? { ...user, [rol]: !user[rol] }
          : user
      )
    );
  };

  const guardarCambios = () => {
    setGuardando(true);
    setMensaje('');
    axios.put('http://localhost:5000/usuarios/roles', { usuarios })
      .then(() => setMensaje('Roles actualizados correctamente'))
      .catch(() => setMensaje('Error al actualizar roles'))
      .finally(() => setGuardando(false));
  };

  return (
    <Container className="bg-white shadow rounded p-4">
      <h3 className="mb-4 text-primary">Administración de Roles</h3>

      {mensaje && (
        <Alert variant={mensaje.includes('Error') ? 'danger' : 'success'}>
          {mensaje}
        </Alert>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Cargando usuarios...</div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="mb-4">
            <thead className="table-dark text-center">
              <tr>
                <th>Usuario</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Administrativo</th>
                <th>Superadmin</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
                <tr key={user.idusuario} className="text-center">
                  <td>{user.usuario}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={!!user.rolpaciente}
                      onChange={() => toggleRol(user.idusuario, 'rolpaciente')}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={!!user.rolmedico}
                      onChange={() => toggleRol(user.idusuario, 'rolmedico')}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={!!user.roladministrativo}
                      onChange={() => toggleRol(user.idusuario, 'roladministrativo')}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={!!user.rolsuperadmin}
                      onChange={() => toggleRol(user.idusuario, 'rolsuperadmin')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end">
            <Button variant="primary" onClick={guardarCambios} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Roles;
