import React from 'react';
import { Col, Button } from 'react-bootstrap';

const VinTurnoHome = ({
  id,
  tipo = "Presencial",
  icono = "bi-calendar",
  nombreEspecialista = "Nombre especialista",
  especialidad = "Especialidad",
  fecha = "DD NN de MM AAAA hh:mm",
  tipoTurno = "presencial",
  estado = "activo",
  acreditado = true,
  onModificar,
  onConversar,
  className = ""
}) => {

  const getBorderClass = () => {
    if (tipoTurno === "consulta") return "border-primary";
    if (estado === "cancelado") return "border-danger";
    if (estado === "completado") return "border-success";
    return "";
  };

  const esTurnoProximo = () => {
    if (tipoTurno === "consulta") return false;

    const fechaTurno = new Date(fecha);
    const ahora = new Date();
    const diferencia = fechaTurno.getTime() - ahora.getTime();
    const horasDiferencia = diferencia / (1000 * 3600);

    return horasDiferencia <= 24 && horasDiferencia > 0;
  };

  return (
    <Col md={4}>
      <div className={`border rounded-3 shadow-sm bg-white p-3 h-100 ${className} ${getBorderClass()} ${esTurnoProximo() ? 'border-warning border-2' : ''}`}>
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">
            <i className={`${icono} fs-4 text-primary`}></i>
          </div>
          <strong>{tipo}</strong>

          {estado && estado !== 'activo' && (
            <span className={`badge ms-2 ${
              estado === 'cancelado' ? 'bg-danger' :
              estado === 'completado' ? 'bg-success' :
              'bg-secondary'
            }`}>
              {estado}
            </span>
          )}

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

        {tipoTurno === "consulta" ? (
          <div className="d-flex">
            <Button
              variant="outline-primary"
              className="flex-fill"
              onClick={() => onConversar && onConversar(id)}
            >
              <i className="bi bi-chat-left-text me-1"></i>
              Chatear
            </Button>
          </div>
        ) : (
          <div className="d-flex">
            {estado !== 'completado' && acreditado && onModificar && (
              <Button
                variant="outline-success"
                className="flex-fill"
                onClick={() => onModificar(id)}
              >
                <i className="bi bi-person-check me-1"></i>
                Atender
              </Button>
            )}
          </div>
        )}
      </div>
    </Col>
  );
};

export default VinTurnoHome;
