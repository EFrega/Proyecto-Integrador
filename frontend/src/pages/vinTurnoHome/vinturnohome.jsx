import React from 'react';
import { Col, Button } from 'react-bootstrap';

const VinTurnoHome = ({ 
  tipo = "Presencial", 
  icono = "bi-calendar", 
  nombreEspecialista = "Nombre especialista", 
  especialidad = "Especialidad", 
  fecha = "DD NN de MM AAAA hh:mm",
  tipoTurno = "presencial", // "presencial" o "consulta"
  onCancelar,
  onModificar,
  onConversar,
  className = ""
}) => {
  return (
    <Col md={4}>
      <div className={`border rounded-3 shadow-sm bg-white p-3 h-100 ${className}`}>
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">
            <i className={`${icono} fs-4 text-primary`}></i>
          </div>
          <strong>{tipo}</strong>
          <div className="ms-auto">
            <i className="bi bi-chevron-right"></i>
          </div>
        </div>
        <div className="mb-2">
          <div className="fw-semibold">{nombreEspecialista}</div>
          <div className="text-muted small">{especialidad}</div>
          <div className="text-muted small">{fecha}</div>
        </div>
        
        {/* Botones según el tipo de turno */}
        {tipoTurno === "consulta" ? (
          <div className="d-flex">
            <Button 
              variant="outline-secondary" 
              className="flex-fill"
              onClick={onConversar}
            >
              <i className="bi bi-chat-left-text me-1"></i> Chatear
            </Button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Button 
              variant="outline-danger" 
              className="flex-fill"
              onClick={onCancelar}
            >
              <i className="bi bi-x-circle me-1"></i> Cancelar
            </Button>
            <Button 
              variant="outline-secondary" 
              className="flex-fill"
              onClick={onModificar}
            >
              <i className="bi bi-pencil me-1"></i> Modificar
            </Button>
          </div>
        )}
      </div>
    </Col>
  );
};

export default VinTurnoHome;