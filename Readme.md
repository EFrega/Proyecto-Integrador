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

### 3. Ejecutar en el raíz

```bash
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
cd <Carpeta-Raiz>
docker-compose up --build
```

Esto levantará:

- **Backend (API):** http://localhost:5000
- **Frontend (React):** http://localhost:80

> La configuración actual **utiliza una base externa**, pero puede adaptarse fácilmente para levantar un contenedor `mysql` desde el `docker-compose.yml`.

---

## 🧪 Testing

El proyecto cuenta con pruebas automatizadas implementadas con **Jest** y **Supertest**, abarcando desde validaciones básicas hasta flujos completos de autenticación y WebSockets.

### Herramientas utilizadas

- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)

### Comandos disponibles

```bash
# Ejecutar todos los tests (solo estando el contenedor de Backend funcionando)
cd backend
npm run test:all
```

```bash
# Test de Registro de usuario
#   Registra un nuevo usuario con datos válidos.
#   Rechaza el registro con datos incompletos.
#   Falla correctamente con usuario duplicado.

cd backend
npm run test:register
```

![Test de Registro de usuario](img/register.test.jpeg)


```bash
# Test de Autenticación de usuario
#   Autenticación exitosa con credenciales válidas.
#   Falla con contraseña incorrecta.
#   Falla con usuario inexistente.

cd backend
npm run test:login
```

![Test de Autenticación de usuario](img/login.test.jpeg)

```bash
# Test de Acceso a rutas protegidas
#   Autenticación exitosa con credenciales válidas.
#   Falla con contraseña incorrecta.
#   Falla con usuario inexistente.

cd backend
npm run test:protected
```

![Test de Acceso a rutas protegidas](img/protected.test.jpeg)

```bash
# Test de Comunicación WebSocket
#   Envía y recibe mensajes en tiempo real a través de WebSocket.

cd backend
npm run test:chat
```

![Test de Comunicación WebSocket](img/chat.test.jpeg)

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
- ✅ WebSockets configurado para mensajería en tiempo real.
- ✅ Testing completo backend (validaciones, autenticación, integridad referencial).
- ✅ Documentación clara y modularización adecuada.
- ✅ Compatible con ejecución local y en Docker.

---

## 🚧 Mejoras a implementar / Ideas futuras

- [ ] Implementar recuperación de contraseña por email.
- [ ] Confirmación del turno por email.
- [ ] Subida de documentos personales (DNI, carnet médico).
- [ ] Pagos online y gestión de facturación.
- [ ] Panel de administración más avanzado (estadísticas, logs).
- [ ] Internacionalización y multilenguaje.

---

## Usuarios del sistema en la DB remota:

-  Paciente: 
    pgriffin@example.com / password
-  Medico: 
    fgordon@example.com / password 
-  Tester:
    test@test.com / 123456
-  Superadmin:
    admin / password

---

## ✨ Autor

Proyecto desarrollado como parte del Ciclo Formativo en Desarrollo de Software por **HiFive Developers**.