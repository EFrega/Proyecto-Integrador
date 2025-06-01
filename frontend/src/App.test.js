import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

test('renders login form when not logged in', () => {
  localStorageMock.getItem.mockReturnValue(null);
  
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
});

test('redirects to dashboard when logged in', () => {
  localStorageMock.getItem.mockReturnValue('true');
  
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Como redirige, no debería mostrar el login
  expect(screen.queryByText(/iniciar sesión/i)).not.toBeInTheDocument();
});
