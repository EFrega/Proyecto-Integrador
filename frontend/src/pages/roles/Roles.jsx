import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, Form, Alert, Spinner,
  Container, Row, Col, InputGroup, Modal
} from 'react-bootstrap';
import { FaEdit, FaEye } from 'react-icons/fa';

const Roles = () => {
  const [usuariosOriginal, setUsuariosOriginal] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [ordenCampo, setOrdenCampo] = useState('apellido');
const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contacto, setContacto] = useState(null);
  const [modalVista, setModalVista] = useState(false);
  const [contactoVista, setContactoVista] = useState(null);

  const roles = JSON.parse(localStorage.getItem('roles') || '{}');
  const usuarioLogueado = localStorage.getItem('usuario') || '';
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
    axios.get('http://localhost:5000/usuarios')
      .then((res) => {
        const ordenado = [...res.data].sort((a, b) => a.apellido?.localeCompare(b.apellido));
        setUsuariosOriginal(ordenado);
        setUsuariosFiltrados(ordenado);
      })
      .catch(() => setMensaje('Error al cargar usuarios'))
      .finally(() => setCargando(false));
  }, []);

  const ordenarPorCampo = (campo) => {
    const ascendente = campo === ordenCampo ? !ordenAscendente : true;
    setOrdenCampo(campo);
    setOrdenAscendente(ascendente);

    const ordenado = [...usuariosFiltrados].sort((a, b) => {
      const valA = a[campo]?.toString().toLowerCase() || '';
      const valB = b[campo]?.toString().toLowerCase() || '';
      return ascendente ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    setUsuariosFiltrados(ordenado);
  };
  const toggleRol = (idusuario, rol) => {
    setUsuariosFiltrados((prev) =>
      prev.map((user) =>
        user.idusuario === idusuario
          ? { ...user, [rol]: !user[rol] }
          : user
      )
    );
  };

  const guardarCambios = async () => {
    setGuardando(true);
    setMensaje('');

    try {
      // 1. Guardar cambios en roles de usuarios
      await axios.put('http://localhost:5000/usuarios/roles', {
        usuarios: usuariosFiltrados
      });

      // 2. Procesar los cambios en el rol médico
      for (const user of usuariosFiltrados) {
        const original = usuariosOriginal.find(u => u.idusuario === user.idusuario);
        if (!original) continue;

        const cambioEnRolMedico = original.rolmedico !== user.rolmedico;

        if (cambioEnRolMedico) {
          await axios.put(
            `http://localhost:5000/profesionales/actualizar-medico/${user.idusuario}`,
            { rolmedico: user.rolmedico }
          );
        }
      }

      setMensaje('Roles actualizados correctamente');
      setUsuariosOriginal([...usuariosFiltrados]);
    } catch (error) {
      console.error(error);
      setMensaje('Error al actualizar roles');
    } finally {
      setGuardando(false);
    }
  };


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
        u.apellido?.toLowerCase().includes(texto) ||
        u.docum?.toLowerCase().includes(texto)
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const abrirFormularioEdicion = async (idusuario) => {
    try {
      const res = await axios.get(`http://localhost:5000/contactos/${idusuario}`);
      setContacto({ ...res.data, idusuario });
      setMostrarModal(true);
    } catch (err) {
      alert('Error al obtener los datos del contacto');
    }
  };

  const aplicarOrdenamientoActual = (lista) => {
    return [...lista].sort((a, b) => {
      const valA = a[ordenCampo]?.toString().toLowerCase() || '';
      const valB = b[ordenCampo]?.toString().toLowerCase() || '';
      return ordenAscendente ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  };
  const guardarContacto = async () => {
    try {
      await axios.put(`http://localhost:5000/contactos/${contacto.idcontacto}`, contacto);
      alert('Contacto actualizado correctamente');

      // Actualizamos datos y reordenamos visualmente
      const actualizarYOrdenar = (lista) =>
        aplicarOrdenamientoActual(
          lista.map((user) =>
            user.idusuario === contacto.idusuario
              ? {
                  ...user,
                  nombre: contacto.nombre,
                  apellido: contacto.apellido,
                  docum: contacto.docum
                }
              : user
          )
        );

      setUsuariosOriginal((prev) => actualizarYOrdenar(prev));
      setUsuariosFiltrados((prev) => actualizarYOrdenar(prev));

      // Forzar refresco visual re-triggering paginación
      setPaginaActual((prev) => prev);

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
              placeholder="Buscar usuario, nombre, apellido o documento..."
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
                {['nombre', 'apellido', 'usuario', 'docum'].map((campo) => (
                  <th
                    key={campo}
                    onClick={() => ordenarPorCampo(campo)}
                    style={{ cursor: 'pointer' }}
                  >
                    {campo === 'docum' ? 'Documento' : campo.charAt(0).toUpperCase() + campo.slice(1)}
                    {ordenCampo === campo && (ordenAscendente ? '▲' : '▼')}
                  </th>
                ))}
                <th>Paciente</th>
                <th>Médico</th>
                <th>Administrativo</th>
                {puedeVerSuperadmin && <th>Superadmin</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((user) => {
                const esAdmin = user.usuario === 'admin';
                const noSoyAdmin = usuarioLogueado !== 'admin';
                const filaBloqueada = esAdmin && noSoyAdmin;

                return (
                  <tr key={user.idusuario} className="text-center">
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.usuario}</td>
                    <td>{user.docum || '—'}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={!!user.rolpaciente}
                        disabled={filaBloqueada}
                        onChange={() => toggleRol(user.idusuario, 'rolpaciente')}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={!!user.rolmedico}
                        disabled={filaBloqueada}
                        onChange={() => toggleRol(user.idusuario, 'rolmedico')}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={!!user.roladministrativo}
                        disabled={filaBloqueada}
                        onChange={() => toggleRol(user.idusuario, 'roladministrativo')}
                      />
                    </td>
                    {puedeVerSuperadmin && (
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={!!user.rolsuperadmin}
                          disabled={filaBloqueada || user.usuario === 'admin'}
                          onChange={() => toggleRol(user.idusuario, 'rolsuperadmin')}
                        />
                      </td>
                    )}
                    <td>
                      <FaEye
                        className="icon-action"
                        title="Ver contacto"
                        onClick={() => !filaBloqueada && verContacto(user.idusuario)}
                        size={18}
                        style={{ pointerEvents: filaBloqueada ? 'none' : 'auto', opacity: filaBloqueada ? 0.3 : 1 }}
                      />
                      <FaEdit
                        className="icon-action"
                        title="Editar contacto"
                        onClick={() => !filaBloqueada && abrirFormularioEdicion(user.idusuario)}
                        size={18}
                        style={{ pointerEvents: filaBloqueada ? 'none' : 'auto', opacity: filaBloqueada ? 0.3 : 1 }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Row className="align-items-center justify-content-between mt-3">
            <Col xs={12}>
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center justify-content-center gap-2 mx-auto">
                  <Button variant="outline-secondary" size="sm" disabled={paginaActual === 1} onClick={() => setPaginaActual(1)} title="Primera página">⏮️</Button>
                  <Button variant="outline-secondary" size="sm" disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)} title="Anterior">◀️</Button>
                  <span style={{ whiteSpace: 'nowrap', display: 'inline-block', minWidth: '110px', textAlign: 'center' }}>
                    Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                  </span>
                  <Button variant="outline-secondary" size="sm" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)} title="Siguiente">▶️</Button>
                  <Button variant="outline-secondary" size="sm" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(totalPaginas)} title="Última página">⏭️</Button>
                </div>

                <div>
                  <Button variant="primary" onClick={guardarCambios} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </div>
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
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarContacto}>Guardar Cambios</Button>
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
          <Button variant="secondary" onClick={() => setModalVista(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Roles;
