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
INSERT INTO `AgendaFeriados` VALUES ('2025-07-09','Día de la Independencia'),('2025-08-15','Dia no laborable con fines turísticos'),('2025-08-17','Paso a la Inmortalidad del Gral. José de San Martín'),('2025-10-12','Día de la Raza');
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
  PRIMARY KEY (`idprofesional`,`idservicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgendaProRegular`
--

LOCK TABLES `AgendaProRegular` WRITE;
/*!40000 ALTER TABLE `AgendaProRegular` DISABLE KEYS */;
INSERT INTO `AgendaProRegular` VALUES (13,9,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL,0,NULL,NULL,0,NULL,NULL),(13,11,0,NULL,NULL,0,NULL,NULL,0,NULL,NULL,1,'09:00:00','18:00:00',1,'09:00:00','18:00:00',0,NULL,NULL,0,NULL,NULL);
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
  `dia_inicio` datetime NOT NULL,
  `dia_fin` datetime DEFAULT NULL,
  `tipo_licencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idprofesional`,`dia_inicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgendaProfExcep`
--

LOCK TABLES `AgendaProfExcep` WRITE;
/*!40000 ALTER TABLE `AgendaProfExcep` DISABLE KEYS */;
INSERT INTO `AgendaProfExcep` VALUES (13,'2025-06-27 00:00:00','2025-06-28 00:00:00','Matrimonio');
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
  PRIMARY KEY (`idchat`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatIndex`
--

LOCK TABLES `ChatIndex` WRITE;
/*!40000 ALTER TABLE `ChatIndex` DISABLE KEYS */;
INSERT INTO `ChatIndex` VALUES (26,65,64),(27,65,67),(28,70,67),(29,70,64),(30,70,69);
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
  `msgtexto` varchar(500) NOT NULL,
  `msgtimesent` datetime DEFAULT NULL,
  `msgstatus` int DEFAULT '1',
  PRIMARY KEY (`idmsg`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatMsgs`
--

LOCK TABLES `ChatMsgs` WRITE;
/*!40000 ALTER TABLE `ChatMsgs` DISABLE KEYS */;
INSERT INTO `ChatMsgs` VALUES (1,26,65,'hola Monica','2025-06-24 02:18:15',1),(2,26,64,'Hola Dr., ¿como anda?','2025-06-24 02:22:20',1),(3,26,64,'hola','2025-06-24 03:14:01',1),(4,26,64,'buenas noches','2025-06-24 03:47:48',1),(5,26,64,'como anda doctor?','2025-06-24 03:48:17',1),(6,26,64,'hola','2025-06-24 03:49:06',1),(7,26,65,'hace frio por ahi?','2025-06-24 03:50:06',1),(8,26,65,'hola Monica','2025-06-24 04:01:33',1),(9,27,65,'hola Sofica','2025-06-24 04:01:44',1),(10,26,65,'monica sos vos','2025-06-24 04:01:59',1),(11,29,70,'hola monica','2025-06-24 04:04:12',1),(12,26,64,'Hola Dr. Si, soy yo','2025-06-24 15:13:55',1),(13,26,64,'le tengo que pedir unas recetas','2025-06-24 15:14:22',1),(14,26,64,'podran estar para hoy?','2025-06-24 15:14:38',1),(15,26,65,'si, por supuesto. Decime sobre que medicamentos','2025-06-24 15:14:55',1);
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
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `docum` varchar(50) NOT NULL,
  `tipodoc` varchar(20) NOT NULL,
  `fechanacim` datetime NOT NULL,
  `telcontacto` varchar(20) DEFAULT NULL,
  `telemergencia` varchar(20) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  PRIMARY KEY (`idcontacto`),
  UNIQUE KEY `Contactos_docum_unique` (`docum`),
  UNIQUE KEY `Contactos_correo_unique` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contactos`
--

LOCK TABLES `Contactos` WRITE;
/*!40000 ALTER TABLE `Contactos` DISABLE KEYS */;
INSERT INTO `Contactos` VALUES (1,'Usuario','Administrador','30123456','DNI','1980-01-15 00:00:00','1134567890','1198765432','admin@gmail.com','Calle Falsa 123'),(64,'Monica','Argento','12345678','DNI','1991-01-01 00:00:00','1155551234','','moni@example.com','Av. Segurola 456'),(65,'Flash','Gordon','1234679','DNI','1992-02-01 00:00:00','1155551234','','fgordon@example.com','Av. Santa Fe 1564'),(66,'Marta','Fernandez','9876543','DNI','2000-03-03 00:00:00','1155556497','','mfernandez@example.com','Av. Avellaneda 4567'),(67,'Sofia','Moreno','45678911','DNI','2001-06-05 00:00:00','115556566','','smoreno@example.com','Av. Carrasco 3456'),(68,'Homero','Simpson','64584636584','DNI','1989-02-25 00:00:00','015556688','015556644','hsimpson@example.com','quien sabe'),(69,'Lola','Perez','91222333','PASAPORTE','1950-01-31 00:00:00','1122223333','1133334444','lolaperez@example.com','Av. Siempreviva 742'),(70,'Pepe','Argento','19654866','PASAPORTE','1975-06-16 00:00:00','5553384','5554696','pepe@example.com','adwfgoergih');
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
  PRIMARY KEY (`idficha`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FichaMedica`
--

LOCK TABLES `FichaMedica` WRITE;
/*!40000 ALTER TABLE `FichaMedica` DISABLE KEYS */;
INSERT INTO `FichaMedica` VALUES (3,64,'0+','SwissMedical','Hipertensión','Medicamentos Crónicos'),(4,67,'A+','OSDE','Enfermedad Celíaca','Alimentos sin TACC');
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
  CONSTRAINT `ProfServicios_ibfk_1` FOREIGN KEY (`idservicio`) REFERENCES `Servicios` (`idservicio`) ON UPDATE CASCADE,
  CONSTRAINT `ProfServicios_ibfk_2` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfServicios`
--

LOCK TABLES `ProfServicios` WRITE;
/*!40000 ALTER TABLE `ProfServicios` DISABLE KEYS */;
INSERT INTO `ProfServicios` VALUES (9,13,1),(11,13,1);
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
  `matricula` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idprofesional`),
  KEY `idcontacto` (`idcontacto`),
  CONSTRAINT `Profesionales_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profesionales`
--

LOCK TABLES `Profesionales` WRITE;
/*!40000 ALTER TABLE `Profesionales` DISABLE KEYS */;
INSERT INTO `Profesionales` VALUES (13,65,'0',1),(14,68,'0',1),(15,70,'0',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Servicios`
--

LOCK TABLES `Servicios` WRITE;
/*!40000 ALTER TABLE `Servicios` DISABLE KEYS */;
INSERT INTO `Servicios` VALUES (8,'Dermatología',1,30),(9,'Clínica Médica',1,20),(10,'Endocrinología',1,40),(11,'Traumatología',1,25),(12,'Kinesiología',1,20),(13,'Pediatría',1,20),(14,'Diagnóstico por Imágenes',1,30),(15,'Cardiología',1,15);
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
  `idcontacto` int NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rolpaciente` tinyint(1) DEFAULT '0',
  `rolmedico` tinyint(1) DEFAULT '0',
  `roladministrativo` tinyint(1) DEFAULT '0',
  `rolsuperadmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `SystemUsers_usuario_unique` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemUsers`
--

LOCK TABLES `SystemUsers` WRITE;
/*!40000 ALTER TABLE `SystemUsers` DISABLE KEYS */;
INSERT INTO `SystemUsers` VALUES (1,1,'admin','$2a$12$yg9vDc5u6pOdC04qhahYBe8hf0Z14uuOslOkOKk/ueZUtIdAU.hBi',0,0,0,1),(53,64,'moni@example.com','$2a$10$SCy5Htdo7TIyWaOEarUCN.x39pxTtTSGwaSDdPlgYBTSh1oiOgeFa',1,0,0,0),(54,65,'fgordon@example.com','$2a$10$Upc5zErSaLK7LNSS.4BxT.5e0e/AO8YPyWKaFc7izXszNa5Rv8hIC',0,1,0,0),(55,66,'mfernandez@example.com','$2a$10$4hLOLX1Hwp5EVImLUsD9fe8PQXWFoAdLJLwKfocHjNkeRcxK5Pwqu',0,0,1,0),(56,67,'smoreno@example.com','$2a$10$PU7z4nHNbll99bx/j/Ow/ubveGgNpV1xCfteaxUQ.VZXEzznReILu',1,0,0,0),(57,68,'hsimpson@example.com','$2a$10$jBzbUcC1Owcr/5..i5UN6.L4yPR2aR0w.sglZ.hqWTal73Q/5px7C',0,1,0,0),(58,69,'lolaperez@example.com','$2a$10$T.a2Q.e5CABzAVCysZtJq.VzHHBAuuRZpqk4DwI92Lkb2K.MJ3Z5W',1,0,0,0),(59,70,'pepe@example.com','$2a$10$HUKkauzP312i9jhSWDYhee4Nw7wTpUf7nZ3S3v21d5HKZL522hbUG',0,1,0,0);
/*!40000 ALTER TABLE `SystemUsers` ENABLE KEYS */;
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
  CONSTRAINT `Turnos_ibfk_1` FOREIGN KEY (`idcontacto`) REFERENCES `Contactos` (`idcontacto`) ON UPDATE CASCADE,
  CONSTRAINT `Turnos_ibfk_2` FOREIGN KEY (`idservicio`) REFERENCES `Servicios` (`idservicio`) ON UPDATE CASCADE,
  CONSTRAINT `Turnos_ibfk_3` FOREIGN KEY (`idprofesional`) REFERENCES `Profesionales` (`idprofesional`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Turnos`
--

LOCK TABLES `Turnos` WRITE;
/*!40000 ALTER TABLE `Turnos` DISABLE KEYS */;
INSERT INTO `Turnos` VALUES (4,64,9,13,'10:00:00','2025-06-25',0,0,1,0,0,0,'',NULL,'2025-06-24 02:23:45'),(5,64,11,13,'12:20:00','2025-07-04',0,0,1,0,0,0,'',NULL,'2025-06-24 02:24:04'),(6,64,9,13,'13:00:00','2025-07-02',0,0,1,0,0,0,'',NULL,'2025-06-24 02:27:33'),(7,64,9,13,'09:00:00','2025-06-24',0,0,1,0,1,1,'Se recibe paciente con dolor abdominal',NULL,'2025-06-24 02:38:01'),(8,67,9,13,'10:40:00','2025-06-24',0,0,1,0,0,0,'',NULL,'2025-06-24 02:41:54'),(9,64,9,13,'11:00:00','2025-07-02',0,0,1,0,0,0,'',NULL,'2025-06-24 03:10:26');
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

-- Dump completed on 2025-06-24 12:57:45
