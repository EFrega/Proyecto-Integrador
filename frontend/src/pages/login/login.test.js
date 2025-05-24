import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './login';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock localStorage
const localStorageMock = {
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

const renderLogin = (setIsLoggedIn = jest.fn()) => {
  return render(
    <BrowserRouter>
      <Login setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
};

test('renders login form elements', () => {
  renderLogin();
  
  expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('shows error message on invalid credentials', async () => {
  mockedAxios.post.mockRejectedValue({
    response: { data: { message: 'Credenciales incorrectas' } }
  });

  renderLogin();
  
  fireEvent.change(screen.getByLabelText(/usuario/i), {
    target: { value: 'wrong@user.com' }
  });
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: 'wrongpass' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
  });
});