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
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `carpeta_id` int DEFAULT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('pendiente','en_progreso','completada','cancelada') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `prioridad` enum('baja','media','alta','urgente') COLLATE utf8mb4_unicode_ci DEFAULT 'media',
  `fecha_vencimiento` date DEFAULT NULL,
  `enlace` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fecha_completada` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_prioridad` (`prioridad`),
  KEY `idx_fecha_vencimiento` (`fecha_vencimiento`),
  KEY `idx_tareas_usuario_estado` (`usuario_id`,`estado`),
  KEY `idx_tareas_usuario_prioridad` (`usuario_id`,`prioridad`),
  KEY `idx_tareas_fecha_creacion` (`fecha_creacion`),
  KEY `idx_carpeta` (`carpeta_id`),
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`carpeta_id`) REFERENCES `carpetas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (1,1,NULL,'Completar documentación del proyecto','Finalizar la documentación técnica de Vivian+','en_progreso','alta','2025-11-27',NULL,'2025-11-20 13:55:21','2025-11-20 13:55:21',NULL),(2,1,NULL,'Revisar código del backend','Hacer code review de las funcionalidades implementadas','pendiente','media','2025-11-23',NULL,'2025-11-20 13:55:21','2025-11-20 13:55:21',NULL),(3,1,NULL,'Preparar presentación final','Crear slides para la presentación del proyecto','pendiente','urgente','2025-11-22',NULL,'2025-11-20 13:55:21','2025-11-20 13:55:21',NULL),(12,2,6,'Finalizar el proyecto',':p','completada','urgente','2025-11-27','','2025-11-26 20:42:30','2025-11-27 01:27:46','2025-11-27 01:26:14'),(13,2,NULL,'Test','Test descripcion','pendiente','baja','2025-11-28','https://www.youtube.com/','2025-11-26 21:06:00','2025-11-27 01:27:13',NULL),(15,3,NULL,'Test 2',':p','pendiente','media','2025-11-27',NULL,'2025-11-27 01:28:55','2025-11-27 01:28:55',NULL);
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 20:31:25
