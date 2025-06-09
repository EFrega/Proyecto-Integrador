import './chat.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Card, Button, Form, ListGroup, Row, Col, InputGroup } from 'react-bootstrap';
import socket from '../socket/socket'; // 👉 usamos socket global

const Chat = ({ setTieneMensajesNuevos }) => {
  const [chats, setChats] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [idusuario, setIdusuario] = useState(null);
  const [usuario, setUsuario] = useState({});
  const contenedorMensajesRef = useRef(null);
  const [rolusuario, setRolusuario] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [chatsConMensajesNuevos, setChatsConMensajesNuevos] = useState([]);

  const handleBuscar = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);
    cargarContactos(idusuario, texto);
  };

  const cargarContactos = useCallback(async (idactual, filtroBusqueda = '') => {
    const roles = JSON.parse(localStorage.getItem('roles') || '{}');

    let rol = '';
    if (roles.rolpaciente) rol = 'rolpaciente';
    else if (roles.rolmedico) rol = 'rolmedico';
    else if (roles.roladministrativo || roles.rolsuperadmin) rol = 'roladministrativo';

    setRolusuario(rol);

    if (rol === 'roladministrativo') {
      setContactos([]);
      return;
    }

    try {
      const params = {
        excluir: idactual,
        rolusuario: rol
      };

      const res = await axios.get(`http://localhost:5000/contactos`, { params });
      const contactosData = Array.isArray(res.data) ? res.data : [];

      if (filtroBusqueda.trim() === '') {
        setContactos(contactosData);
        return;
      }

      const filtro = filtroBusqueda.toLowerCase();

      const filtrados = contactosData.filter(c => {
        if (rol === 'rolpaciente') {
          return (
            c.nombre?.toLowerCase().includes(filtro) ||
            c.apellido?.toLowerCase().includes(filtro) ||
            c.nombre_servicio?.toLowerCase().includes(filtro)
          );
        }

        if (rol === 'rolmedico') {
          return (
            c.nombre?.toLowerCase().includes(filtro) ||
            c.apellido?.toLowerCase().includes(filtro) ||
            c.docum?.toLowerCase().includes(filtro)
          );
        }

        return false;
      });

      setContactos(filtrados);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  }, []);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      try {
        const usuarioParseado = JSON.parse(storedUsuario);
        setUsuario(usuarioParseado);
        if (usuarioParseado?.idcontacto) {
          setIdusuario(usuarioParseado.idcontacto);
          cargarChats(usuarioParseado.idcontacto);
          cargarContactos(usuarioParseado.idcontacto);
        }
      } catch (e) {
        console.error('No se pudo parsear localStorage usuario:', e);
      }
    }
  }, [cargarContactos, idusuario]);

  useEffect(() => {
    const handleNuevoMensaje = (msg) => {
      if (msg.idchat === chatActivo?.idchat) {
        setMensajes(prev => [...prev, msg]);
        scrollAlFinal();
        setTieneMensajesNuevos(false);
      } else {
        setChatsConMensajesNuevos(prev => {
          if (!prev.includes(msg.idchat)) {
            const nuevos = [...prev, msg.idchat];

            setTieneMensajesNuevos(true); // ✅ ACTUALIZADO

            return nuevos;
          }
          return prev;
        });

        if (idusuario) {
          cargarChats(idusuario);
        }
      }
    };

    socket.on('nuevo-mensaje', handleNuevoMensaje);

    return () => {
      socket.off('nuevo-mensaje', handleNuevoMensaje);
    };
  }, [chatActivo, idusuario, setTieneMensajesNuevos]);

  const cargarChats = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/chat/chats/${id}`);
      setChats(res.data);
    } catch (error) {
      console.error('Error al cargar chats:', error);
    }
  };

  const abrirChat = async (chat) => {
    try {
      setChatActivo(chat);

      setChatsConMensajesNuevos(prev => {
        const nuevos = prev.filter(id => id !== chat.idchat);

        if (nuevos.length === 0) {
          setTieneMensajesNuevos(false); // ✅ ACTUALIZADO
        }

        return nuevos;
      });

      const res = await axios.get(`http://localhost:5000/chat/mensajes/${chat.idchat}`);
      setMensajes(res.data);
      scrollAlFinal();
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  const iniciarChat = async (idReceptor) => {
    try {
      const res = await axios.post('http://localhost:5000/chat/chats', {
        id1: idusuario,
        id2: idReceptor
      });
      abrirChat(res.data);
      cargarChats(idusuario);
    } catch (error) {
      console.error('Error al iniciar chat:', error);
    }
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    const nuevo = {
      idchat: chatActivo.idchat,
      idsystemuseremisor: idusuario,
      msgtexto: nuevoMensaje,
      msgtimesent: new Date().toISOString()
    };

    socket.emit('enviar-mensaje', nuevo);
    setNuevoMensaje('');
    scrollAlFinal();
  };

  const agruparPorFecha = (mensajes) => {
    const agrupados = {};

    mensajes.forEach(msg => {
      const fecha = new Date(msg.msgtimesent).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!agrupados[fecha]) agrupados[fecha] = [];
      agrupados[fecha].push(msg);
    });

    return agrupados;
  };

  const scrollAlFinal = () => {
    setTimeout(() => {
      if (contenedorMensajesRef.current) {
        contenedorMensajesRef.current.scrollTop = contenedorMensajesRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <Row className="p-4">
      <Col md={4}>
        <h5>Mis chats</h5>
        <ListGroup className="mb-4">
          {chats.map(chat => (
            <ListGroup.Item
              key={chat.idchat}
              action
              active={chatActivo?.idchat === chat.idchat}
              onClick={() => abrirChat(chat)}
              style={{
                fontWeight: chatsConMensajesNuevos.includes(chat.idchat) ? 'bold' : 'normal',
                color: chatsConMensajesNuevos.includes(chat.idchat) ? 'red' : 'inherit'
              }}
            >
              {chat.nombreOtro} {chat.apellidoOtro}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <h6 className="mt-4 mb-3 fw-bold text-secondary">Iniciar nuevo chat</h6>
        <Form className="mb-3">
          <Row className="mb-3">
            <Col md={12}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder={
                    rolusuario === 'rolpaciente'
                      ? 'Buscar por nombre, apellido o servicio...'
                      : rolusuario === 'rolmedico'
                      ? 'Buscar por nombre, apellido o documento...'
                      : 'Buscar por nombre, apellido o documento...'
                  }
                  value={busqueda}
                  onChange={handleBuscar}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setBusqueda('');
                    cargarContactos(idusuario);
                  }}
                >
                  Limpiar
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>

        <ListGroup className="chat-iniciar-lista">
          {contactos.length > 0 ? (
            contactos.map(c => (
              <ListGroup.Item
                key={c.idcontacto}
                className="d-flex justify-content-between align-items-center chat-iniciar-item px-3 py-2"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor: '#fff'
                }}
              >
                <div className="fw-medium text-dark">
                  {rolusuario === 'rolpaciente' && (
                    <>
                      {c.nombre} {c.apellido} ({c.nombre_servicio})
                    </>
                  )}
                  {rolusuario === 'rolmedico' && (
                    <>
                      {c.nombre} {c.apellido} ({c.docum})
                    </>
                  )}
                </div>

                <div className="ms-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-iniciar-chat"
                    onClick={() => iniciarChat(c.idcontacto)}
                  >
                    Iniciar
                  </Button>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted">No hay otros contactos disponibles</p>
          )}
        </ListGroup>
      </Col>

      <Col md={8}>
        {chatActivo ? (
          <div className="chat-container">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">
                  Conversación entre {usuario?.nombre} {usuario?.apellido} y {chatActivo?.nombreOtro} {chatActivo?.apellidoOtro}
                </span>
              </div>
            </Card.Header>

            <div className="chat-messages" ref={contenedorMensajesRef}>
              {Object.entries(agruparPorFecha(mensajes)).map(([fecha, mensajesDelDia]) => (
                <div key={fecha}>
                  <div className="text-center text-muted my-2 fw-bold">{fecha}</div>
                  {mensajesDelDia.map(msg => (
                    <div
                      key={msg.idmsg}
                      className={msg.idsystemuseremisor === idusuario ? 'chat-msg-sent' : 'chat-msg-received'}
                    >
                      <div className="bubble">
                        {msg.msgtexto}
                        <div className="chat-msg-time">
                          {new Date(msg.msgtimesent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <Form onSubmit={e => { e.preventDefault(); enviarMensaje(); }} className="chat-input-form">
              <Form.Control
                type="text"
                value={nuevoMensaje}
                onChange={e => setNuevoMensaje(e.target.value)}
                placeholder="Escribí un mensaje..."
              />
              <Button variant="primary" type="submit">Enviar</Button>
            </Form>
          </div>
        ) : (
          <p className="text-danger">Seleccioná un chat para comenzar.</p>
        )}
      </Col>
    </Row>
  );
};

export default Chat;
