# Proyecto Integrador

**Plataforma de Gestión de Turnos para Clínicas y Consultorios** 

Este sistema busca optimizar la gestión de citas médicas en clínicas y consultorios, reduciendo tiempos de espera y maximizando la eficiencia de los profesionales de la salud. 
Permitirá a los pacientes reservar, modificar o cancelar turnos de manera online, con recordatorios automatizados para evitar ausencias. El software integrará un calendario inteligente que asignará turnos según la disponibilidad y urgencia de los casos, además de permitir a los médicos visualizar el historial de cada paciente antes de la consulta. 

También incluirá un chat interno entre pacientes y especialistas para consultas rápidas. Para mejorar la experiencia del usuario, se implementarán encuestas de satisfacción y análisis de métricas sobre tiempos de espera y calidad del servicio. La plataforma será adaptable a distintos tipos de centros médicos, desde consultorios independientes hasta grandes clínicas. Agregar posibilidad de avisos.


## Datos de la DDBB 

DDBB MySQL: https://www.db4free.net 

- MySQL database name: pp4_clinica 
- MySQL username: pp4_root 
- MySQL user password: Sabbah2505 
- https://www.db4free.net/phpMyAdmin/index.php?route=/database/structure&db=pp4_clinica 

## Instalar dependencias 

cd <carpeta raiz del proyecto> 
npm install react@^19.1.0 react-dom@^19.1.0 bcryptjs@^3.0.2 body-parser@^2.2.0 cors@^2.8.5 express@^4.21.2 jsonwebtoken@^9.0.2 mysql2@^3.14.0 sequelize@^6.37.7 socket.io@^4.8.1 

cd <carpeta raiz frontend> 
npm install axios@^1.8.4 react-bootstrap@^2.10.9 bootstrap@^5.3.5 bootstrap-icons@^1.11.3 react-icons@5.5.0 socket.io-client@^4.8.1 web-vitals@^2.1.4 react-router-dom@^7.5.3 

## Ejecutar el Backend 

cd .\backend\server 

node index.js 

## Ejecutar el Frontend 

cd .\frontend 

npm start 
