CREATE DATABASE  IF NOT EXISTS `pp4_clinica` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pp4_clinica`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: db4free.net    Database: pp4_clinica
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AgendaFeriados`
--

DROP TABLE IF EXISTS `AgendaFeriados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AgendaFeriados` (
  `dia` date NOT NULL,
  `motivoferiado` text,
  PRIMARY KEY (`dia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgendaFeriados`
--

LOCK TABLES `AgendaFeriados` WRITE;
/*!40000 ALTER TABLE `AgendaFeriados` DISABLE KEYS */;
INSERT INTO `AgendaFeriados` VALUES ('2025-01-01','Año Nuevo'),('2025-03-24','Día de la Memoria por la Verdad y la Justicia'),('2025-04-18','Viernes Santo'),('2025-05-01','Día del Trabajador'),('2025-06-16','Feriado Paso a la Inmortalidad del General Martín Güemes');
/*!40000 ALTER TABLE `AgendaFeriados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AgendaProRegular`
--

DROP TABLE IF EXISTS `AgendaProRegular`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AgendaProRegular` (
  `idprofesional` int NOT NULL,
  `idservicio` int NOT NULL,
  `lun` tinyint(1) DEFAULT NULL,
  `hora_init_lun` time DEFAULT NULL,
  `hora_fin_lun` time DEFAULT NULL,
  `mar` tinyint(1) DEFAULT NULL,
  `hora_init_mar` time DEFAULT NULL,
  `hora_fin_mar` time DEFAULT NULL,
  `mie` tinyint(1) DEFAULT NULL,
  `hora_init_mie` time DEFAULT NULL,
  `hora_fin_mie` time DEFAULT NULL,
  `jue` tinyint(1) DEFAULT NULL,
  `hora_init_jue` time DEFAULT NULL,
  `hora_fin_jue` time DEFAULT NULL,
  `vie` tinyint(1) DEFAULT NULL,
  `hora_init_vie` time DEFAULT NULL,
  `hora_fin_vie` time DEFAULT NULL,
  `sab` tinyint(1) DEFAULT NULL,
  `hora_init_sab` time DEFAULT NULL,
  `hora_fin_sab` time DEFAULT NULL,
  `dom` tinyint(1) DEFAULT NULL,
  `hora_init_dom` time DEFAULT NULL,
  `hora_fin_dom` time DEFAULT NULL,
  PRIMARY KEY (`idprofesional`,`idservicio`),
  KEY `idservicio` (`idservicio`),
  CONSTRAINT `AgendaProRegular_ibfk_1` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`),
  CONSTRAINT `AgendaProRegular_ibfk_2` FOREIGN KEY (`idservicio`) REFERENCES `Servicios` (`idservicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgendaProRegular`
--

LOCK TABLES `AgendaProRegular` WRITE;
/*!40000 ALTER TABLE `AgendaProRegular` DISABLE KEYS */;
INSERT INTO `AgendaProRegular` VALUES (4,3,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL),(5,1,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL),(7,2,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL),(8,1,1,'09:00:00','12:00:00',0,NULL,NULL,0,NULL,NULL,0,NULL,NULL,0,NULL,NULL,0,NULL,NULL,0,NULL,NULL),(8,4,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `AgendaProRegular` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AgendaProfExcep`
--

DROP TABLE IF EXISTS `AgendaProfExcep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AgendaProfExcep` (
  `idprofesional` int NOT NULL,
  `dia_inicio` date NOT NULL,
  `dia_fin` date DEFAULT NULL,
  `tipo_licencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idprofesional`,`dia_inicio`),
  CONSTRAINT `AgendaProfExcep_ibfk_1` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgendaProfExcep`
--

LOCK TABLES `AgendaProfExcep` WRITE;
/*!40000 ALTER TABLE `AgendaProfExcep` DISABLE KEYS */;
INSERT INTO `AgendaProfExcep` VALUES (5,'2025-06-25','2025-07-04','Matrimonio'),(8,'2025-06-03','2025-06-03','Fallecimiento (hermano)'),(8,'2025-06-17','2025-07-14','Vacaciones anuales pagas (10-20 años)'),(10,'2025-06-03','2025-06-30','Vacaciones anuales pagas (10-20 años)');
/*!40000 ALTER TABLE `AgendaProfExcep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chat`
--

DROP TABLE IF EXISTS `Chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chat` (
  `idmsg` int NOT NULL AUTO_INCREMENT,
  `idchat` int DEFAULT NULL,
  `idcontactoemisor` int DEFAULT NULL,
  `idcontactoreceptor` int DEFAULT NULL,
  `msgdia` date DEFAULT NULL,
  `msghora` time DEFAULT NULL,
  `msgtexto` text,
  `msgstatus` int DEFAULT NULL,
  PRIMARY KEY (`idmsg`),
  KEY `idcontactoreceptor` (`idcontactoreceptor`),
  KEY `idcontactoemisor` (`idcontactoemisor`),
  CONSTRAINT `Chat_ibfk_1` FOREIGN KEY (`idcontactoreceptor`) REFERENCES `Contactos` (`idcontacto`),
  CONSTRAINT `Chat_ibfk_2` FOREIGN KEY (`idcontactoemisor`) REFERENCES `Contactos` (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chat`
--

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;
INSERT INTO `Chat` VALUES (1,1,10,12,'2025-04-10','10:00:00','Hola, quería confirmar mi turno con el Dr. Pérez.',1),(2,1,12,10,'2025-04-10','10:05:00','Hola Andrea, sí está confirmado para el lunes a las 9:00.',1),(3,2,11,12,'2025-04-10','11:00:00','¿Podés indicarme la dirección del consultorio?',1);
/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChatIndex`
--

DROP TABLE IF EXISTS `ChatIndex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChatIndex` (
  `idchat` int NOT NULL AUTO_INCREMENT,
  `idsystemuser1` int NOT NULL,
  `idsystemuser2` int NOT NULL,
  `iduserlow` int GENERATED ALWAYS AS (least(`idsystemuser1`,`idsystemuser2`)) STORED,
  `iduserhigh` int GENERATED ALWAYS AS (greatest(`idsystemuser1`,`idsystemuser2`)) STORED,
  PRIMARY KEY (`idchat`),
  UNIQUE KEY `uq_unique_chat_between_users` (`iduserlow`,`iduserhigh`),
  KEY `idsystemuser1` (`idsystemuser1`),
  KEY `idsystemuser2` (`idsystemuser2`),
  CONSTRAINT `ChatIndex_ibfk_1` FOREIGN KEY (`idsystemuser1`) REFERENCES `Contactos` (`idcontacto`),
  CONSTRAINT `ChatIndex_ibfk_2` FOREIGN KEY (`idsystemuser2`) REFERENCES `Contactos` (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatIndex`
--

LOCK TABLES `ChatIndex` WRITE;
/*!40000 ALTER TABLE `ChatIndex` DISABLE KEYS */;
INSERT INTO `ChatIndex` (`idchat`, `idsystemuser1`, `idsystemuser2`) VALUES (24,14,5),(25,14,7);
/*!40000 ALTER TABLE `ChatIndex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChatMsgs`
--

DROP TABLE IF EXISTS `ChatMsgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChatMsgs` (
  `idmsg` int NOT NULL AUTO_INCREMENT,
  `idchat` int NOT NULL,
  `idsystemuseremisor` int NOT NULL,
  `msgtimesent` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `msgtimerecieved` datetime DEFAULT NULL,
  `msgtimeread` datetime DEFAULT NULL,
  `msgtexto` text,
  `msgvisibletoemiter` int NOT NULL DEFAULT '1',
  `msgvisibletoreciever` int NOT NULL DEFAULT '1',
  `msgstatus` int NOT NULL DEFAULT '0',
  `msglastupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmsg`),
  UNIQUE KEY `uq_unique_msg_in_chat` (`idchat`,`idsystemuseremisor`,`msgtimesent`),
  KEY `idsystemuseremisor` (`idsystemuseremisor`),
  KEY `msgstatus` (`msgstatus`),
  CONSTRAINT `ChatMsgs_ibfk_1` FOREIGN KEY (`idsystemuseremisor`) REFERENCES `Contactos` (`idcontacto`),
  CONSTRAINT `ChatMsgs_ibfk_2` FOREIGN KEY (`msgstatus`) REFERENCES `ChatStatus` (`msgstatus`),
  CONSTRAINT `ChatMsgs_ibfk_3` FOREIGN KEY (`idchat`) REFERENCES `ChatIndex` (`idchat`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatMsgs`
--

LOCK TABLES `ChatMsgs` WRITE;
/*!40000 ALTER TABLE `ChatMsgs` DISABLE KEYS */;
INSERT INTO `ChatMsgs` VALUES (55,24,14,'2025-06-09 00:31:43',NULL,NULL,'hola Dr. Sosa',1,1,1,'2025-06-09 00:31:43'),(56,24,5,'2025-06-09 00:32:11',NULL,NULL,'hola Mónica',1,1,1,'2025-06-09 00:32:12'),(57,24,14,'2025-06-09 00:32:40',NULL,NULL,'hola',1,1,1,'2025-06-09 00:32:41'),(58,24,5,'2025-06-09 00:33:01',NULL,NULL,'hola',1,1,1,'2025-06-09 00:33:07'),(59,25,14,'2025-06-09 00:33:35',NULL,NULL,'hola Diego',1,1,1,'2025-06-09 00:33:36'),(60,25,7,'2025-06-09 00:34:15',NULL,NULL,'hola Mónica',1,1,1,'2025-06-09 00:34:17'),(61,25,14,'2025-06-09 00:34:35',NULL,NULL,'hola',1,1,1,'2025-06-09 00:34:36');
/*!40000 ALTER TABLE `ChatMsgs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChatStatus`
--

DROP TABLE IF EXISTS `ChatStatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChatStatus` (
  `msgstatus` int NOT NULL AUTO_INCREMENT,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`msgstatus`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatStatus`
--

LOCK TABLES `ChatStatus` WRITE;
/*!40000 ALTER TABLE `ChatStatus` DISABLE KEYS */;
INSERT INTO `ChatStatus` VALUES (1,'pendiente'),(2,'entregado'),(3,'leído');
/*!40000 ALTER TABLE `ChatStatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contactos`
--

DROP TABLE IF EXISTS `Contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contactos` (
  `idcontacto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `docum` varchar(50) DEFAULT NULL,
  `tipodoc` varchar(20) DEFAULT NULL,
  `fechanacim` date DEFAULT NULL,
  `telcontacto` varchar(20) DEFAULT NULL,
  `telemergencia` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contactos`
--

LOCK TABLES `Contactos` WRITE;
/*!40000 ALTER TABLE `Contactos` DISABLE KEYS */;
INSERT INTO `Contactos` VALUES (1,'Usuario','Administrador','30123456','DNI','1980-01-15','1134567890','1198765432','admin@gmail.com','Calle Falsa 123'),(2,'Analía','Gómes','31123456','DNI','1985-03-22','1134567891','1198765433','ana.gomez@example.com','Av. Siempreviva 456'),(3,'Luis','Martínez','32123456','DNI','1978-07-12','1134567892','1198765434','luis.martinez@example.com','Calle 8 1010'),(4,'Marta','Fernández','33123458','DNI','1990-12-01','1134567893','1198765435','marta.fernandez@example.com','Mitre 2020'),(5,'Carlos','Sosa','34123456','DNI','1982-11-30','1134567894','1198765436','carlos.sosa@example.com','Belgrano 3300'),(6,'Lucía','Ramírez','35123458','DNI','1987-06-15','1134567895','1198765437','lucia.ramirez@example.com','San Martín 550'),(7,'Diego','Suárez','36123456','DNI','1975-08-23','1134567896','1198765438','diego.suarez@example.com','Lavalle 700'),(8,'Paula','Rivas','37123456','DNI','1992-02-17','1134567897','1198765439','paula.rivas@example.com','Av. Córdoba 808'),(9,'Matías','Ibarra','38123456','DNI','1983-10-03','1134567898','1198765440','matias.ibarra@example.com','Rivadavia 1200'),(10,'Andrea','López','39123456','DNI','1989-05-20','1134567899','1198765441','andrea.lopez@example.com','Catamarca 345'),(11,'Sofía','Moreno','40123456','DNI','1993-04-10','1134567800','1198765442','sofia.moreno@example.com','Independencia 321'),(12,'Javier','Vega','41123456','DNI','1986-10-05','1134567801','1198765443','javier.vega@example.com','Corrientes 1500'),(13,'Jose','Argento','1616517','DNI','1995-01-14','65131665','65165161','peargento@example.com','iuhapiugh'),(14,'Monica','Argento','561384316','DNI','1998-06-18','65131665','65165161','moniargento@example.com','iuhapiugh'),(15,'homer','simpson','564698466','Pasaporte','1990-07-06','5558897','5559788','hsimpson@example.com','wergferg'),(16,'marge','simpsons','658496846','Pasaporte','1990-06-05','5558897','5559788','msimpson@example.com','wergferg'),(17,'lisa','simpson','654616','Pasaporte','1995-04-06','5558897','5559788','lsimpson@example.com','grvagr'),(19,'maggie','simpson','78678678','Pasaporte','1993-06-17','65131665','5559788','masimpson@example.com','srhwrh'),(20,'peter','grifin','68464864','Pasaporte','2002-03-14','5557767','5554465','pgrifin@example.com','dhrtherjh'),(21,'Flash','Gordon','46864136','DNI','1950-05-06','5552244','5555432','fgordon@example.com','srthwe'),(22,'Lorenzo','Ramirez','234213','DNI','2025-05-20','23123412','23421421','sdfasdfasd@asdfasdfasd','sdfasfdas'),(24,'Ana','Menttos','1234567','DNI','1941-01-31','1122223333','','ana.menttos@example.com','Los Pinos 123'),(34,'Test','Usuario','32456789','DNI','2025-05-24','0303456','','test@test.com','testadress 123'),(36,'lionel','messi','64168416','DNI','1987-06-24','5552233','','liomessi@example.com','vsuihqfio'),(37,'Usuario','Prueba','23546798','DNI','2004-12-28','0303456','','usuario@prueba.com','testadress 123');
/*!40000 ALTER TABLE `Contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FichaMedica`
--

DROP TABLE IF EXISTS `FichaMedica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FichaMedica` (
  `idficha` int NOT NULL AUTO_INCREMENT,
  `idcontacto` int DEFAULT NULL,
  `gruposang` varchar(5) DEFAULT NULL,
  `cobertura` varchar(100) DEFAULT NULL,
  `histenfermflia` text,
  `observficha` text,
  PRIMARY KEY (`idficha`),
  KEY `idcontacto` (`idcontacto`),
  CONSTRAINT `FichaMedica_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FichaMedica`
--

LOCK TABLES `FichaMedica` WRITE;
/*!40000 ALTER TABLE `FichaMedica` DISABLE KEYS */;
INSERT INTO `FichaMedica` VALUES (1,10,'A+','OSDE','Padre con hipertensión','Paciente sin antecedentes propios'),(2,11,'O-','Swiss Medical','Madre con diabetes','Consulta por control anual');
/*!40000 ALTER TABLE `FichaMedica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfServicios`
--

DROP TABLE IF EXISTS `ProfServicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfServicios` (
  `idservicio` int NOT NULL,
  `idprofesional` int NOT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idservicio`,`idprofesional`),
  KEY `idprofesional` (`idprofesional`),
  CONSTRAINT `ProfServicios_ibfk_1` FOREIGN KEY (`idservicio`) REFERENCES `Servicios` (`idservicio`),
  CONSTRAINT `ProfServicios_ibfk_2` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfServicios`
--

LOCK TABLES `ProfServicios` WRITE;
/*!40000 ALTER TABLE `ProfServicios` DISABLE KEYS */;
INSERT INTO `ProfServicios` VALUES (1,5,1),(2,7,1),(3,4,1),(4,8,1);
/*!40000 ALTER TABLE `ProfServicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Profesionales`
--

DROP TABLE IF EXISTS `Profesionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Profesionales` (
  `idprofesional` int NOT NULL AUTO_INCREMENT,
  `idcontacto` int DEFAULT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  `matricula` varchar(100) NOT NULL,
  PRIMARY KEY (`idprofesional`),
  KEY `idcontacto` (`idcontacto`),
  CONSTRAINT `Profesionales_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profesionales`
--

LOCK TABLES `Profesionales` WRITE;
/*!40000 ALTER TABLE `Profesionales` DISABLE KEYS */;
INSERT INTO `Profesionales` VALUES (1,1,1,'0'),(2,2,1,'0'),(3,3,1,'0'),(4,4,1,'0'),(5,5,1,'0'),(6,6,1,'0'),(7,7,1,'0'),(8,8,1,'0'),(9,9,1,'0'),(10,13,1,'0'),(11,10,1,'0'),(12,12,1,'0');
/*!40000 ALTER TABLE `Profesionales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Servicios`
--

DROP TABLE IF EXISTS `Servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Servicios` (
  `idservicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  `duracionturno` int DEFAULT NULL,
  PRIMARY KEY (`idservicio`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Servicios`
--

LOCK TABLES `Servicios` WRITE;
/*!40000 ALTER TABLE `Servicios` DISABLE KEYS */;
INSERT INTO `Servicios` VALUES (1,'Dermatología',1,30),(2,'Clínica Médica',1,20),(3,'Endocrinología',1,40),(4,'Traumatología',1,25),(5,'Kinesiología',1,20),(6,'Pediatría',1,20),(7,'Diagnóstico por Imágenes',1,30);
/*!40000 ALTER TABLE `Servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemUsers`
--

DROP TABLE IF EXISTS `SystemUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemUsers` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `idcontacto` int DEFAULT NULL,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena` varchar(100) DEFAULT NULL,
  `rolpaciente` tinyint(1) DEFAULT NULL,
  `rolmedico` tinyint(1) DEFAULT NULL,
  `roladministrativo` tinyint(1) DEFAULT NULL,
  `rolsuperadmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  KEY `idcontacto` (`idcontacto`),
  CONSTRAINT `SystemUsers_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemUsers`
--

LOCK TABLES `SystemUsers` WRITE;
/*!40000 ALTER TABLE `SystemUsers` DISABLE KEYS */;
INSERT INTO `SystemUsers` VALUES (1,1,'admin','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,0,1),(2,2,'agomez@gmail.com','$2a$10$IWcr482lDCBuvVS1MqwUPewGOmQ/x0WC6Cd4UhPR5ZZk.hp5YMdWm',0,0,1,0),(3,3,'lmartinez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,1,0),(4,4,'mfernandez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(5,5,'csosa@gmail.com','$2a$10$QTChLFBQyDVCVSdoqmy76.Y65qyyKBSzINgUS71Ad6.JQxHjYHh3a',0,1,0,0),(6,6,'lramirez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,1,1),(7,7,'dsuarez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(8,8,'privas@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(9,9,'mibarra@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(10,10,'alopez@gmail.com','$2b$10$sthCE5ZLTSfLdIY4CZwpd.M1mdQXVRMTMgtUgxqIVR0x7PKQMxsZe',1,0,0,0),(11,11,'smoreno@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',1,0,0,0),(12,12,'jvega@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(13,13,'pepe@gmail.com','$2a$10$BC9pDu3AUfqLSjndYygtyeN.wk2SdexQv.dhzwhOlrzJLxvv39EsG',0,1,0,0),(14,14,'moni@example.com','$2a$10$QPlCJiaYfSl8K/TAz41lj.mGGfXXhcq/3dGrPHwDBtL1b/ZokrjRa',1,0,0,0),(15,15,'lisa@exam.com','$2b$10$F/kA0rhWu6KEMMJOQ0/mh.4BrBsLup2H.8guipEJoS/7oP2zurBW6',1,0,0,0),(16,16,'papa@exa.com','$2b$10$bXHCNAFoB74i2GbKglfOp.B2O8gGvTfLv0nhmId2tfxf1NMH.hAgm',1,0,0,0),(17,17,'kk@exa.com','$2b$10$j/skmSJ5K06UEKieN1/xZeVDnRyeJQ5wsnn1DEpng10TTXBnq71UW',1,0,0,0),(19,19,'masimpson@example.com','$2b$10$C9Ua3PmOvXD.QlXxQCiPSe6wWtUzrhzcpZJBU0dTqXBFmkFzp3MQK',1,0,0,0),(20,20,'pgrifin@example.com','$2b$10$bw88TGsRL40UPwpsRmBm..ByvYu33AjnOBkDYG1z29jvJI6eA1TDW',1,0,0,0),(21,21,'fgordon@example.com','$2a$10$ie9c5N0MGIalP.8bnquG0e42RUodxh6UuLIioaamuOPO0/mJjPZvq',0,1,0,0),(22,22,'lorenzor@example.com','$2b$10$zLrOt5n6K7bLEjYaaOY4ieq3..vmVt4uayxq0LNtiQtP3P6/IGFwe',1,0,0,0),(24,24,'ana.menttos@example.com','$2b$10$h3Od60kEDOyOqfXeCTStceENwzS.JdPN/1MnNHGpi.1XK4jxNBQSS',1,0,0,0),(34,34,'test@test.com','$2a$10$UF3zrDIlsCTxnpmp42gb2exLv1OCp5TKHE/LJPBvwSwCnnfVT5xfG',1,0,0,1),(36,36,'liomessi@example.com','$2b$10$Gxlxq0Yw3Sg0lfNIan5bnu/.HNZ97PmVAVP5QoOqo4OnU2Uef4Nsy',1,0,0,0),(37,37,'usuario@prueba.com','$2a$10$blFe0jWhXEsNhOOJVCg7cO/4smV5MMhOwmyTNVMtXSvNnQ9peRPua',1,0,0,0);
/*!40000 ALTER TABLE `SystemUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemUsers_backup`
--

DROP TABLE IF EXISTS `SystemUsers_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemUsers_backup` (
  `idusuario` int NOT NULL DEFAULT '0',
  `idcontacto` int DEFAULT NULL,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contrasena` varchar(100) DEFAULT NULL,
  `rolpaciente` tinyint(1) DEFAULT NULL,
  `rolmedico` tinyint(1) DEFAULT NULL,
  `roladministrativo` tinyint(1) DEFAULT NULL,
  `rolsuperadmin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemUsers_backup`
--

LOCK TABLES `SystemUsers_backup` WRITE;
/*!40000 ALTER TABLE `SystemUsers_backup` DISABLE KEYS */;
INSERT INTO `SystemUsers_backup` VALUES (1,1,'admin','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,0,1),(2,2,'agomez@gmail.com','$2a$10$AIBx3bohwXPtzGAhpqo8heWj5nYDKehjlsDXfhlRBykspLX2Bty1m',0,0,1,0),(3,3,'lmartinez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,1,0),(4,4,'mfernandez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(5,5,'csosa@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(6,6,'lramirez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,1,1),(7,7,'dsuarez@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(8,8,'privas@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(9,9,'mibarra@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(10,10,'alopez@gmail.com','$2b$10$sthCE5ZLTSfLdIY4CZwpd.M1mdQXVRMTMgtUgxqIVR0x7PKQMxsZe',1,0,0,0),(11,11,'smoreno@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',1,0,0,0),(12,12,'jvega@gmail.com','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,1,0,0),(13,13,'pepe@gmail.com','$2a$10$BC9pDu3AUfqLSjndYygtyeN.wk2SdexQv.dhzwhOlrzJLxvv39EsG',0,1,0,0),(14,14,'moni@example.com','$2a$10$QPlCJiaYfSl8K/TAz41lj.mGGfXXhcq/3dGrPHwDBtL1b/ZokrjRa',1,0,0,0),(15,15,'lisa@exam.com','$2b$10$F/kA0rhWu6KEMMJOQ0/mh.4BrBsLup2H.8guipEJoS/7oP2zurBW6',1,0,0,0),(16,16,'papa@exa.com','$2b$10$bXHCNAFoB74i2GbKglfOp.B2O8gGvTfLv0nhmId2tfxf1NMH.hAgm',1,0,0,0),(17,17,'kk@exa.com','$2b$10$j/skmSJ5K06UEKieN1/xZeVDnRyeJQ5wsnn1DEpng10TTXBnq71UW',1,0,0,0),(18,19,'masimpson@example.com','$2b$10$C9Ua3PmOvXD.QlXxQCiPSe6wWtUzrhzcpZJBU0dTqXBFmkFzp3MQK',1,0,0,0),(19,20,'pgrifin@example.com','$2b$10$bw88TGsRL40UPwpsRmBm..ByvYu33AjnOBkDYG1z29jvJI6eA1TDW',1,0,0,0),(20,21,'fgordon@example.com','$2a$10$ie9c5N0MGIalP.8bnquG0e42RUodxh6UuLIioaamuOPO0/mJjPZvq',0,1,0,0),(21,22,'lorenzor@example.com','$2b$10$zLrOt5n6K7bLEjYaaOY4ieq3..vmVt4uayxq0LNtiQtP3P6/IGFwe',1,0,0,0),(23,24,'ana.menttos@example.com','$2b$10$h3Od60kEDOyOqfXeCTStceENwzS.JdPN/1MnNHGpi.1XK4jxNBQSS',1,0,0,0),(34,34,'test@test.com','$2a$10$UF3zrDIlsCTxnpmp42gb2exLv1OCp5TKHE/LJPBvwSwCnnfVT5xfG',0,0,0,1),(35,36,'liomessi@example.com','$2b$10$Gxlxq0Yw3Sg0lfNIan5bnu/.HNZ97PmVAVP5QoOqo4OnU2Uef4Nsy',1,0,0,0);
/*!40000 ALTER TABLE `SystemUsers_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Turnos`
--

DROP TABLE IF EXISTS `Turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Turnos` (
  `idturno` int NOT NULL AUTO_INCREMENT,
  `idcontacto` int DEFAULT NULL,
  `idservicio` int DEFAULT NULL,
  `idprofesional` int DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `dia` date DEFAULT NULL,
  `tipo` int DEFAULT NULL,
  `prioridad` int DEFAULT NULL,
  `reservado` tinyint(1) DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `acreditado` tinyint(1) DEFAULT NULL,
  `atendido` tinyint(1) DEFAULT NULL,
  `observaciones` text,
  `updsystemuser` int DEFAULT NULL,
  `updatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`idturno`),
  KEY `idcontacto` (`idcontacto`),
  KEY `idservicio` (`idservicio`),
  KEY `idprofesional` (`idprofesional`),
  KEY `updsystemuser` (`updsystemuser`),
  CONSTRAINT `Turnos_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`),
  CONSTRAINT `Turnos_ibfk_2` FOREIGN KEY (`idservicio`) REFERENCES `Servicios` (`idservicio`),
  CONSTRAINT `Turnos_ibfk_3` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`),
  CONSTRAINT `Turnos_ibfk_4` FOREIGN KEY (`updsystemuser`) REFERENCES `SystemUsers` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Turnos`
--

LOCK TABLES `Turnos` WRITE;
/*!40000 ALTER TABLE `Turnos` DISABLE KEYS */;
INSERT INTO `Turnos` VALUES (1,10,1,1,'09:00:00','2025-04-21',1,1,1,1,1,0,'Consulta de piel',12,'2025-05-09 03:12:58'),(2,11,2,4,'09:30:00','2025-04-21',1,2,1,1,1,0,'Dolor de cabeza',12,'2025-05-09 03:12:58'),(3,10,3,7,'10:00:00','2025-04-21',1,3,1,1,1,0,'Chequeo post cirugía',12,'2025-05-09 03:12:58');
/*!40000 ALTER TABLE `Turnos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09  1:34:44
