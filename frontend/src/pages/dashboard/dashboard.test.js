import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

test('renders dashboard with basic elements', () => {
  localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'isLoggedIn') return 'true';
    if (key === 'usuario') return 'TestUser';
    if (key === 'roles') return JSON.stringify({ rolpaciente: true });
    return null;
  });

  render(<Dashboard setIsLoggedIn={jest.fn()} />);
  
  expect(screen.getByText(/clínicamedica/i)).toBeInTheDocument();
  expect(screen.getByText(/testuser/i)).toBeInTheDocument();
});

test('shows configuration icon for superadmin', () => {
  localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'isLoggedIn') return 'true';
    if (key === 'roles') return JSON.stringify({ rolsuperadmin: true });
    return null;
  });

  render(<Dashboard setIsLoggedIn={jest.fn()} />);
  
  // Verifica que el ícono de configuración esté presente
  expect(screen.getByTitle(/configuración/i)).toBeInTheDocument();
});