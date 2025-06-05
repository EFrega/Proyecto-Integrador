import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [idusuario, setIdusuario] = useState(null);
  const [usuario, setUsuario] = useState({});
  const contenedorMensajesRef = useRef(null);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    console.log('storedUsuario:', storedUsuario);
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
  }, []);

  const cargarChats = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/chat/chats/${id}`);
      setChats(res.data);
    } catch (error) {
      console.error('Error al cargar chats:', error);
    }
  };

  const cargarContactos = async (idactual) => {
    try {
      const res = await axios.get(`http://localhost:5000/contactos?excluir=${idactual}`);
      setContactos(res.data);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  };

  const abrirChat = async (chat) => {
    try {
      setChatActivo(chat);
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

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    try {
      await axios.post('http://localhost:5000/chat/mensajes', {
        idchat: chatActivo.idchat,
        idsystemuseremisor: idusuario,
        msgtexto: nuevoMensaje
      });
      setNuevoMensaje('');
      abrirChat(chatActivo);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const scrollAlFinal = () => {
    setTimeout(() => {
      if (contenedorMensajesRef.current) {
        contenedorMensajesRef.current.scrollTop = contenedorMensajesRef.current.scrollHeight;
      }
    }, 100);
  };

  const nombreContacto = (c) => `${c.nombre} ${c.apellido}`;

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
            >
              {chat.idsystemuser1 === idusuario ? `Usuario ${chat.idsystemuser2}` : `Usuario ${chat.idsystemuser1}`}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <h6>Iniciar nuevo chat</h6>
        <ListGroup>
          {contactos.length > 0 ? (
            contactos.map(c => (
              <ListGroup.Item key={c.idcontacto} className="d-flex justify-content-between align-items-center">
                <span>{nombreContacto(c)}</span>
                <Button size="sm" onClick={() => iniciarChat(c.idcontacto)}>Iniciar</Button>
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
                <span className="fw-bold">Conversación</span>
                <span className="text-muted small">
                  {usuario?.nombre} {usuario?.apellido}
                </span>
              </div>
            </Card.Header>
            <div className="chat-messages" ref={contenedorMensajesRef}>
              {mensajes.map(msg => (
                <div
                  key={msg.idmsg}
                  className={msg.idsystemuseremisor === idusuario ? 'chat-msg-sent' : 'chat-msg-received'}
                >
                  <div className="bubble">
                    {msg.msgtexto}
                    <div className="chat-msg-time">
                      {new Date(msg.msgtimesent).toLocaleTimeString()}
                    </div>
                  </div>
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