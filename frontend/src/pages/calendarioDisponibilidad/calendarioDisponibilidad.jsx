import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarioDisponibilidad = ({ diasDisponibles, onSelectDia }) => {
  const diasSet = new Set(diasDisponibles.map(d => d.dia));

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const fechaStr = date.toISOString().slice(0, 10);
      return !diasSet.has(fechaStr);
    }
    return false;
  };

  return (
    <Calendar
      onClickDay={(value) => onSelectDia(value.toISOString().slice(0, 10))}
      tileDisabled={tileDisabled}
    />
  );
};

export default CalendarioDisponibilidad;
