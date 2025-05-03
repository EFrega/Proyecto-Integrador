import React from 'react';

import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaFolder,
  FaSignOutAlt
} from 'react-icons/fa';

const Dashboard = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r shadow-sm flex flex-col items-center py-4">
        <FaHome className="mb-6 text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />
        <FaCalendarAlt className="mb-6 text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />
        <FaComments className="mb-6 text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />
        <FaFileAlt className="mb-6 text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />
        <FaFolder className="mb-6 text-xl text-gray-600 hover:text-blue-500 cursor-pointer" />

        {/* Logout Button */}
        <FaSignOutAlt
          onClick={handleLogout}
          className="mt-auto mb-2 text-xl text-gray-600 hover:text-red-500 cursor-pointer"
          title="Cerrar sesión"
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-xl font-semibold text-blue-700">
            Clínica<span className="text-black">Medica</span>
          </h1>
          <div className="flex items-center gap-4">
            {/* Placeholder icons or avatars */}
            <div className="w-8 h-8 rounded-full bg-red-200" />
            <div className="w-8 h-8 rounded-full bg-blue-200" />
            <span className="text-sm text-gray-600">nombreapellido@example.com</span>
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 p-6">
          <h2 className="text-lg font-medium text-blue-700">Inicio</h2>
          {/* Acá va el contenido dinámico */}
        </main>

        {/* Footer */}
        <footer className="bg-blue-900 text-white p-6 text-sm">
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold">ClínicaMedica</h3>
            </div>
            <div>
              <p>Información Institucional</p>
              <p>Especialidades médicas</p>
              <p>Calidad y seguridad del paciente</p>
            </div>
            <div>
              <p>Información Útil</p>
              <p>Coberturas médicas</p>
              <p>Solicite turno</p>
              <p>Preguntas frecuentes</p>
            </div>
          </div>
          <div className="text-center mt-4 text-xs">
            ©2025 Diseñado y desarrollado por{' '}
            <a className="underline" href="https://hehex.dev" target="_blank" rel="noreferrer">
              HeHex Developers
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
