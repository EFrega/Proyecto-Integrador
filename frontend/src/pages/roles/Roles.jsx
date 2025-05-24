import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Form,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  InputGroup,
  Modal
} from 'react-bootstrap';
import { FaEdit, FaEye } from 'react-icons/fa';

const Roles = () => {
  const [usuariosOriginal, setUsuariosOriginal] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contacto, setContacto] = useState(null);
  const [modalVista, setModalVista] = useState(false);
  const [contactoVista, setContactoVista] = useState(null);

  // Roles del usuario conectado
  const roles = JSON.parse(localStorage.getItem('roles') || '{}');
  const puedeVerSuperadmin = roles.rolsuperadmin;
  const puedeAcceder = roles.rolsuperadmin || roles.roladministrativo;

  useEffect(() => {
    if (!puedeAcceder) {
      alert('No tiene permiso para acceder a esta sección');
      window.location.href = '/dashboard';
    }
  }, [puedeAcceder]);

  const usuariosPorPagina = 10;

  useEffect(() => {
    axios
      .get('http://localhost:5000/usuarios')
      .then((res) => {
        setUsuariosOriginal(res.data);
        setUsuariosFiltrados(res.data);
      })
      .catch(() => setMensaje('Error al cargar usuarios'))
      .finally(() => setCargando(false));
  }, []);

  const toggleRol = (idusuario, rol) => {
    setUsuariosFiltrados((prev) =>
      prev.map((user) =>
        user.idusuario === idusuario ? { ...user, [rol]: !user[rol] } : user
      )
    );
  };

  const guardarCambios = () => {
    setGuardando(true);
    setMensaje('');
    axios
      .put('http://localhost:5000/usuarios/roles', { usuarios: usuariosFiltrados })
      .then(() => setMensaje('Roles actualizados correctamente'))
      .catch(() => setMensaje('Error al actualizar roles'))
      .finally(() => setGuardando(false));
  };

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const handleBuscar = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);
    setPaginaActual(1);
    if (texto.trim() === '') {
      setUsuariosFiltrados(usuariosOriginal);
    } else {
      const filtrados = usuariosOriginal.filter((u) =>
        u.usuario.toLowerCase().includes(texto) ||
        u.nombre?.toLowerCase().includes(texto) ||
        u.apellido?.toLowerCase().includes(texto)
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  const abrirFormularioEdicion = async (idusuario) => {
    try {
      const res = await axios.get(`http://localhost:5000/contactos/${idusuario}`);
      setContacto(res.data);
      setMostrarModal(true);
    } catch (err) {
      alert('Error al obtener los datos del contacto');
    }
  };

  const guardarContacto = async () => {
    try {
      await axios.put(`http://localhost:5000/contactos/${contacto.idcontacto}`, contacto);
      alert('Contacto actualizado correctamente');
      setMostrarModal(false);
    } catch (err) {
      alert('Error al actualizar el contacto');
    }
  };

  const verContacto = async (idusuario) => {
    try {
      const res = await axios.get(`http://localhost:5000/contactos/${idusuario}`);
      setContactoVista(res.data);
      setModalVista(true);
    } catch (err) {
      alert('Error al obtener los datos del contacto');
    }
  };

  return (
    <Container className="bg-white shadow rounded p-4">
      <style>
        {`
          .icon-action {
            cursor: pointer;
            color: #0d6efd;
            transition: color 0.2s ease;
            margin-right: 10px;
          }
          .icon-action:hover {
            color: #084298;
          }
        `}
      </style>

      <h3 className="mb-4 text-primary">Gestión de Usuarios</h3>

      {mensaje && (
        <Alert variant={mensaje.includes('Error') ? 'danger' : 'success'}>{mensaje}</Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={handleBuscar}
            />
            <Button
              variant="outline-secondary"
              onClick={() => {
                setBusqueda('');
                setUsuariosFiltrados(usuariosOriginal);
              }}
            >
              Limpiar
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Cargando usuarios...</div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="mb-3">
            <thead className="table-dark text-center">
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Administrativo</th>
                {puedeVerSuperadmin && <th>Superadmin</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((user) => (
                <tr key={user.idusuario} className="text-center">
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
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
                  {puedeVerSuperadmin && (
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={!!user.rolsuperadmin}
                        onChange={() => toggleRol(user.idusuario, 'rolsuperadmin')}
                      />
                    </td>
                  )}
                  <td>
                    <FaEye
                      className="icon-action"
                      title="Ver contacto"
                      onClick={() => verContacto(user.idusuario)}
                      size={18}
                    />
                    <FaEdit
                      className="icon-action"
                      title="Editar contacto"
                      onClick={() => abrirFormularioEdicion(user.idusuario)}
                      size={18}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="align-items-center justify-content-between">
            <Col xs="auto" className="text-muted">
              Mostrando {usuariosFiltrados.length === 0 ? 0 : (paginaActual - 1) * usuariosPorPagina + 1}
              {' '}–{' '}
              {Math.min(paginaActual * usuariosPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length}
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                className="me-2"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((prev) => prev - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                onClick={() => setPaginaActual((prev) => prev + 1)}
              >
                Siguiente
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={guardarCambios} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* Modal edición */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contacto && (
            <Form>
              {['nombre', 'apellido', 'docum', 'tipodoc', 'fechanacim', 'telcontacto', 'telemergencia', 'correo', 'direccion'].map((campo, idx) => (
                <Form.Group className="mb-2" key={idx}>
                  <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                  <Form.Control
                    type={campo === 'fechanacim' ? 'date' : 'text'}
                    value={campo === 'fechanacim' ? (contacto[campo]?.split('T')[0] || '') : contacto[campo] || ''}
                    onChange={(e) => setContacto({ ...contacto, [campo]: e.target.value })}
                  />
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarContacto}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal visualización */}
      <Modal show={modalVista} onHide={() => setModalVista(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Datos del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactoVista ? (
            <div>
              {[
                ['Nombre', contactoVista.nombre],
                ['Apellido', contactoVista.apellido],
                ['Documento', contactoVista.docum],
                ['Tipo Documento', contactoVista.tipodoc],
                ['Fecha de Nacimiento', contactoVista.fechanacim?.split('T')[0]],
                ['Tel. Contacto', contactoVista.telcontacto],
                ['Tel. Emergencia', contactoVista.telemergencia],
                ['Correo', contactoVista.correo],
                ['Dirección', contactoVista.direccion]
              ].map(([label, valor], idx) => (
                <p key={idx}>
                  <strong>{label}:</strong> {valor || '—'}
                </p>
              ))}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVista(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Roles;
