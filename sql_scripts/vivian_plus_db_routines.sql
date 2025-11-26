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
-- Temporary view structure for view `vista_credenciales_usuario`
--

DROP TABLE IF EXISTS `vista_credenciales_usuario`;
/*!50001 DROP VIEW IF EXISTS `vista_credenciales_usuario`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_credenciales_usuario` AS SELECT 
 1 AS `usuario_id`,
 1 AS `nombre`,
 1 AS `email`,
 1 AS `hash_password`,
 1 AS `fecha_creacion`,
 1 AS `fecha_actualizacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_tareas_vencidas`
--

DROP TABLE IF EXISTS `vista_tareas_vencidas`;
/*!50001 DROP VIEW IF EXISTS `vista_tareas_vencidas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_tareas_vencidas` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `usuario_id`,
 1 AS `usuario_nombre`,
 1 AS `usuario_email`,
 1 AS `fecha_vencimiento`,
 1 AS `dias_vencidos`,
 1 AS `prioridad`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_resumen_tareas`
--

DROP TABLE IF EXISTS `vista_resumen_tareas`;
/*!50001 DROP VIEW IF EXISTS `vista_resumen_tareas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_resumen_tareas` AS SELECT 
 1 AS `usuario_id`,
 1 AS `usuario_nombre`,
 1 AS `total_tareas`,
 1 AS `tareas_completadas`,
 1 AS `tareas_pendientes`,
 1 AS `tareas_en_progreso`,
 1 AS `tareas_canceladas`,
 1 AS `tareas_urgentes`,
 1 AS `total_carpetas`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vista_credenciales_usuario`
--

/*!50001 DROP VIEW IF EXISTS `vista_credenciales_usuario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_credenciales_usuario` AS select `usuarios`.`id` AS `usuario_id`,`usuarios`.`nombre` AS `nombre`,`usuarios`.`email` AS `email`,`usuarios`.`password` AS `hash_password`,`usuarios`.`fecha_creacion` AS `fecha_creacion`,`usuarios`.`fecha_actualizacion` AS `fecha_actualizacion` from `usuarios` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_tareas_vencidas`
--

/*!50001 DROP VIEW IF EXISTS `vista_tareas_vencidas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_tareas_vencidas` AS select `t`.`id` AS `id`,`t`.`titulo` AS `titulo`,`t`.`descripcion` AS `descripcion`,`t`.`usuario_id` AS `usuario_id`,`u`.`nombre` AS `usuario_nombre`,`u`.`email` AS `usuario_email`,`t`.`fecha_vencimiento` AS `fecha_vencimiento`,(to_days(curdate()) - to_days(`t`.`fecha_vencimiento`)) AS `dias_vencidos`,`t`.`prioridad` AS `prioridad`,`t`.`estado` AS `estado` from (`tareas` `t` join `usuarios` `u` on((`t`.`usuario_id` = `u`.`id`))) where ((`t`.`fecha_vencimiento` < curdate()) and (`t`.`estado` in ('pendiente','en_progreso'))) order by `t`.`fecha_vencimiento` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_resumen_tareas`
--

/*!50001 DROP VIEW IF EXISTS `vista_resumen_tareas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_resumen_tareas` AS select `u`.`id` AS `usuario_id`,`u`.`nombre` AS `usuario_nombre`,count(`t`.`id`) AS `total_tareas`,sum((case when (`t`.`estado` = 'completada') then 1 else 0 end)) AS `tareas_completadas`,sum((case when (`t`.`estado` = 'pendiente') then 1 else 0 end)) AS `tareas_pendientes`,sum((case when (`t`.`estado` = 'en_progreso') then 1 else 0 end)) AS `tareas_en_progreso`,sum((case when (`t`.`estado` = 'cancelada') then 1 else 0 end)) AS `tareas_canceladas`,sum((case when (`t`.`prioridad` = 'urgente') then 1 else 0 end)) AS `tareas_urgentes`,count(distinct `t`.`carpeta_id`) AS `total_carpetas` from (`usuarios` `u` left join `tareas` `t` on((`u`.`id` = `t`.`usuario_id`))) group by `u`.`id`,`u`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 15:48:30
