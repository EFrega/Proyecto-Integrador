import React, { useState } from 'react';
import { Col, Button, Modal, Alert } from 'react-bootstrap';

const VinTurnoHome = ({ 
  id, // ID del turno para las operaciones
  tipo = "Presencial", 
  icono = "bi-calendar", 
  nombreEspecialista = "Nombre especialista", 
  especialidad = "Especialidad", 
  fecha = "DD NN de MM AAAA hh:mm",
  tipoTurno = "presencial", // "presencial" o "consulta"
  estado = "activo", // estado del turno
  onCancelar,
  onModificar,
  onConversar,
  onTurnoActualizado, // Callback para actualizar la lista después de una operación
  className = ""
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para cancelar turno con confirmación
  const handleCancelarClick = () => {
    setShowCancelModal(true);
  };

  const confirmarCancelacion = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/turnos/${id}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setShowCancelModal(false);
        if (onCancelar) onCancelar(id);
        if (onTurnoActualizado) onTurnoActualizado();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al cancelar el turno');
      }
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      setError('Error de conexión al cancelar el turno');
    } finally {
      setLoading(false);
    }
  };

  // Función para modificar turno
  const handleModificarClick = () => {
    if (onModificar) onModificar(id);
  };

  // Función para conversar
  const handleConversarClick = () => {
    if (onConversar) onConversar(id);
  };

  // Determinar el color del borde según el estado y tipo
  const getBorderClass = () => {
    if (tipoTurno === "consulta") return "border-primary";
    if (estado === "cancelado") return "border-danger";
    if (estado === "completado") return "border-success";
    return "";
  };

  // Determinar si el turno está próximo (dentro de 24 horas)
  const esTurnoProximo = () => {
    if (tipoTurno === "consulta") return false;
    
    const fechaTurno = new Date(fecha);
    const ahora = new Date();
    const diferencia = fechaTurno.getTime() - ahora.getTime();
    const horasDiferencia = diferencia / (1000 * 3600);
    
    return horasDiferencia <= 24 && horasDiferencia > 0;
  };

  return (
    <>
      <Col md={4}>
        <div className={`border rounded-3 shadow-sm bg-white p-3 h-100 ${className} ${getBorderClass()} ${esTurnoProximo() ? 'border-warning border-2' : ''}`}>
          <div className="d-flex align-items-center mb-2">
            <div className="me-2">
              <i className={`${icono} fs-4 text-primary`}></i>
            </div>
            <strong>{tipo}</strong>
            
            {/* Indicador de estado */}
            {estado && estado !== 'activo' && (
              <span className={`badge ms-2 ${
                estado === 'cancelado' ? 'bg-danger' : 
                estado === 'completado' ? 'bg-success' : 
                'bg-secondary'
              }`}>
                {estado}
              </span>
            )}
            
            {/* Indicador de turno próximo */}
            {esTurnoProximo() && (
              <span className="badge bg-warning text-dark ms-2">
                Próximo
              </span>
            )}
            
            <div className="ms-auto">
              <i className="bi bi-chevron-right"></i>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="fw-semibold">{nombreEspecialista}</div>
            <div className="text-muted small">{especialidad}</div>
            <div className="text-muted small">{fecha}</div>
          </div>
          
          {/* Mostrar error si existe */}
          {error && (
            <Alert variant="danger" className="py-2 mb-2 small">
              {error}
            </Alert>
          )}
          
          {/* Botones según el tipo de turno */}
          {tipoTurno === "consulta" ? (
            <div className="d-flex">
              <Button 
                variant="outline-primary" 
                className="flex-fill"
                onClick={handleConversarClick}
                disabled={loading}
              >
                <i className="bi bi-chat-left-text me-1"></i> 
                {loading ? 'Conectando...' : 'Chatear'}
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button 
                variant="outline-danger" 
                className="flex-fill"
                onClick={handleCancelarClick}
                disabled={loading || estado === 'cancelado'}
              >
                <i className="bi bi-x-circle me-1"></i> 
                {loading ? 'Procesando...' : 'Cancelar'}
              </Button>
              <Button 
                variant="outline-secondary" 
                className="flex-fill"
                onClick={handleModificarClick}
                disabled={loading || estado === 'cancelado'}
              >
                <i className="bi bi-pencil me-1"></i> Modificar
              </Button>
            </div>
          )}
        </div>
      </Col>

      {/* Modal de confirmación para cancelar */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas cancelar este turno?</p>
          <div className="bg-light p-3 rounded">
            <strong>{tipo}</strong><br />
            <span className="text-muted">{nombreEspecialista}</span><br />
            <span className="text-muted">{especialidad}</span><br />
            <span className="text-muted">{fecha}</span>
          </div>
          <small className="text-muted mt-2 d-block">
            Esta acción no se puede deshacer.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCancelModal(false)}
            disabled={loading}
          >
            No, mantener turno
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmarCancelacion}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cancelando...
              </>
            ) : (
              'Sí, cancelar turno'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VinTurnoHome;