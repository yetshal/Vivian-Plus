-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: vivian_plus_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `historial_tareas`
--

DROP TABLE IF EXISTS `historial_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tarea_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `accion` enum('crear','actualizar','eliminar','completar') COLLATE utf8mb4_unicode_ci NOT NULL,
  `campo_modificado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_anterior` text COLLATE utf8mb4_unicode_ci,
  `valor_nuevo` text COLLATE utf8mb4_unicode_ci,
  `fecha_accion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tarea` (`tarea_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_fecha` (`fecha_accion`),
  CONSTRAINT `historial_tareas_ibfk_1` FOREIGN KEY (`tarea_id`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historial_tareas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_tareas`
--

LOCK TABLES `historial_tareas` WRITE;
/*!40000 ALTER TABLE `historial_tareas` DISABLE KEYS */;
INSERT INTO `historial_tareas` VALUES (1,1,1,'crear',NULL,NULL,'Tarea creada: Completar documentación del proyecto','2025-11-20 13:55:21'),(2,2,1,'crear',NULL,NULL,'Tarea creada: Revisar código del backend','2025-11-20 13:55:21'),(3,3,1,'crear',NULL,NULL,'Tarea creada: Preparar presentación final','2025-11-20 13:55:21'),(40,12,2,'crear',NULL,NULL,'Tarea creada: Test 1','2025-11-26 20:42:30'),(41,12,2,'actualizar','estado','pendiente','en_progreso','2025-11-26 20:43:32'),(42,12,2,'actualizar','estado','en_progreso','completada','2025-11-26 20:43:33'),(43,12,2,'actualizar','estado','completada','pendiente','2025-11-26 20:43:34'),(44,12,2,'actualizar','estado','pendiente','en_progreso','2025-11-26 20:45:35'),(45,12,2,'actualizar','estado','en_progreso','pendiente','2025-11-26 20:45:38'),(46,12,2,'actualizar','estado','pendiente','completada','2025-11-26 21:01:48'),(47,13,2,'crear',NULL,NULL,'Tarea creada: Test 2','2025-11-26 21:06:00'),(49,12,2,'actualizar','titulo','Test 1','Test 1_1','2025-11-27 00:04:41'),(53,12,2,'actualizar','estado','completada','en_progreso','2025-11-27 01:23:07'),(54,12,2,'actualizar','titulo','Test 1_1','Test 1','2025-11-27 01:26:06'),(55,12,2,'actualizar','estado','en_progreso','completada','2025-11-27 01:26:14'),(56,12,2,'actualizar','titulo','Test 1','Finalizar el proyecto','2025-11-27 01:26:59'),(57,13,2,'actualizar','titulo','Test 2','Test','2025-11-27 01:27:13'),(58,15,3,'crear',NULL,NULL,'Tarea creada: Test 2','2025-11-27 01:28:55');
/*!40000 ALTER TABLE `historial_tareas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 20:31:24
