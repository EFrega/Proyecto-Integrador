// frontend/src/pages/login/login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';

test('renderiza el formulario de login y muestra error en campos vacíos', () => {
  render(<Login />);
  fireEvent.click(screen.getByText(/Iniciar Sesión/i));
  expect(screen.getByText(/usuario es requerido/i)).toBeInTheDocument();
});
