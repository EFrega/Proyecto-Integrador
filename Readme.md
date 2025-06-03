# Proyecto Integrador

**Plataforma de Gestión de Turnos para Clínicas y Consultorios**

---

## 🌐 Descripción

Aplicación **fullstack** desarrollada con **Node.js**, **Express**, **React** y **MySQL**, diseñada para administrar turnos médicos, registro de profesionales, servicios ofrecidos y manejo de usuarios autenticados por JWT.

---

## 🧠 Base de Datos

Base externa de pruebas:

- **Motor:** MySQL
- **Host:** [db4free.net](https://www.db4free.net)
- **Nombre:** `pp4_clinica`
- **Usuario:** `pp4_root`
- **Contraseña:** `Sabbah2505`
- [phpMyAdmin](https://www.db4free.net/phpMyAdmin/index.php?route=/database/structure&db=pp4_clinica)

> ⚠️ Considerar migrar a una base en Docker o local para producción.
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

- **Backend (API):** http://localhost:5000
- **Frontend (React):** http://localhost:3000

> La configuración actual **utiliza una base externa**, pero puede adaptarse fácilmente para levantar un contenedor `mysql` desde el `docker-compose.yml`.

---

## 🧪 Testing

### Herramientas

- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)

### Comandos disponibles

```bash
# Todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Solo validaciones de modelos
npm run test:models

# Solo autenticación
npm run test:auth

# Solo flujo completo login → token → ruta protegida
npm run test:integration
```

> Las pruebas incluyen validación de modelos, validaciones de base de datos, login y flujo de autenticación, rutas protegidas, y verificación de cifrado de contraseñas.

---

## 🔐 Seguridad y Validaciones

### Validaciones del lado del backend (Sequelize)

- **`contactos.js`**:
  - Email válido y único.
  - Documento único.
  - Tipo de documento permitido.
  - Fecha de nacimiento válida (no futura, no anterior a 1900).
  - Nombre, apellido y dirección con longitud mínima.

- **`systemusers.js`**:
  - Usuario con formato email y único.
  - Contraseña mínima de 6 caracteres.
  - Roles (`paciente`, `médico`, `administrativo`, `superadmin`) como booleanos.
  - Contraseña cifrada con `bcryptjs` en `beforeCreate` y `beforeUpdate`.

> Todos estos campos son verificados también por los tests automatizados.

---

## 📁 Estructura del Proyecto

```
PROYECTO-INTEGRADOR/
├── backend/
│   ├── models/            # Modelos Sequelize validados
│   ├── routes/            # Rutas Express separadas
│   ├── server/            # App Express principal + WebSockets
│   ├── tests/             # Jest + Supertest organizados por tipo
│   └── Dockerfile
├── frontend/
│   ├── src/pages/         # Vistas agrupadas por función
│   └── Dockerfile
├── docker-compose.yml     # Configuración completa para contenedores
```

---

## ✅ Funcionalidades implementadas

- ✅ Registro y Login de Usuarios con cifrado de contraseña.
- ✅ Rutas protegidas por JWT (`/usuarios/:id`, etc).
- ✅ Administración de Contactos, Profesionales, Servicios, Turnos y Excepciones.
- ✅ WebSockets configurado para futura mensajería en tiempo real.
- ✅ Testing completo backend (validaciones, autenticación, integridad referencial).
- ✅ Documentación clara y modularización adecuada.
- ✅ Compatible con ejecución local y en Docker.

---

## 🚧 Pendientes / Ideas futuras

- [ ] Implementar recuperación de contraseña por email.
- [ ] Subida de documentos personales (DNI, carnet médico).
- [ ] Pagos online y gestión de facturación.
- [ ] Panel de administración más avanzado (estadísticas, logs).
- [ ] Internacionalización y multilenguaje.

---

## ✨ Autor

Proyecto desarrollado como parte del Ciclo Formativo en Desarrollo de Software por **HiFive Developers**.