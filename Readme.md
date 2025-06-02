# Proyecto Integrador

**Plataforma de Gestión de Turnos para Clínicas y Consultorios**

---

## 🌐 Descripción

Aplicación fullstack desarrollada en Node.js, Express, React y MySQL, diseñada para administrar turnos médicos, registros de profesionales, servicios y más.

---

## 🧠 Base de Datos

Base externa de pruebas:

- **Motor:** MySQL
- **Host:** [db4free.net](https://www.db4free.net)
- **Nombre:** `pp4_clinica`
- **Usuario:** `pp4_root`
- **Contraseña:** `Sabbah2505`
- [phpMyAdmin](https://www.db4free.net/phpMyAdmin/index.php?route=/database/structure&db=pp4_clinica)

---

## ⚙️ Instalación Manual (sin Docker)

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd PROYECTO-INTEGRADOR
```

### 2. Instalar dependencias

```bash
# Dependencias raíz (si las hubiera)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Ejecutar el Backend

```bash
cd backend/server
node index.js
```

### 4. Ejecutar el Frontend

```bash
cd frontend
npm start
```

---

## 🐳 Ejecución con Docker

El proyecto incluye configuración para ejecutar todo con Docker:

### 1. Requisitos

- Tener instalados:
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

### 2. Ejecutar el proyecto

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levantará:

- **Backend** (Node.js + Express)
- **Frontend** (React)
- (Opcional) Podés modificar `docker-compose.yml` para levantar también un contenedor de MySQL.

### 3. Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🧪 Testing

### Backend

Se usa **Jest** + **Supertest**. Para correr los tests:

```bash
cd backend
npm test
```

> Se incluye una batería básica para login, registro y rutas protegidas.

---

## 📁 Estructura del Proyecto

```
PROYECTO-INTEGRADOR/
│── backend/
│   ├── config/
│   │   ├── database.js
│   ├── middlewares
│   │   ├── auth.js
│   ├── models/
│   │   ├── agendaferiados.js
│   │   ├── agendaprofexcep.js
│   │   ├── agendaproregular.js
│   │   ├── chat.js
│   │   ├── contactos.js
│   │   ├── fichamedica.js
│   │   ├── profesionales.js
│   │   ├── profservicios.js
│   │   ├── servicios.js
│   │   ├── systemusers.js
│   │   ├── turnos.js
│   ├── routes/
│   │   ├── contactosRoute.js
│   │   ├── excepcionesRoute.js
│   │   ├── feriadosRoute.js
│   │   ├── loginRoute.js
│   │   ├── profesionalesRoute.js
│   │   ├── registerRoute.js
│   │   ├── rolesRoute.js
│   │   ├── serviciosRoute.js
│   │   ├── usuariosRoute.js
│   ├── server/
│   │   ├── index.js
│   │   ├── logs.txt
│   ├── tests/
│   │   ├── api.test.js
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── logs.txt
│   ├── package.json
│ 
│── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   ├── src/
│   │   ├── pages/
│   │   │   ├── agendas/
│   │   │   │   ├── agendas.jsx
│   │   │   ├── cargaServicios/
│   │   │   │   ├── cargarServicios.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.css
│   │   │   │   ├── dashboard.jsx
│   │   │   │   ├── dashboard.test.js
│   │   │   ├── excepcionesProf/
│   │   │   │   ├── excepcionesProf.css
│   │   │   │   ├── excepcionesProf.jsx
│   │   │   ├── login/
│   │   │   │   ├── login.css
│   │   │   │   ├── login.jsx
│   │   │   │   ├── login.test.js
│   │   │   ├── register/
│   │   │   │   ├── register.css
│   │   │   │   ├── register.jsx
│   │   │   ├── roles/
│   │   │   │   ├── Roles.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
├── node_modules/
├── .env
├── .gitignore
├── chat-datamodel.sql
├── docker-compose.yml
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
```

---

## ✅ Estado actual

- ✔️ Login y Registro de Usuarios
- ✔️ Rutas protegidas con JWT
- ✔️ Gestión de Turnos, Profesionales y Servicios
- ✔️ Pruebas unitarias básicas
- ✔️ Configuración con Docker

---

## ✨ Autor

- Proyecto realizado como parte del ciclo formativo en Desarrollo de Software por HiFive Developers.