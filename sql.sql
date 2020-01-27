-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: site
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `experts`
--

DROP TABLE IF EXISTS `experts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experts` (
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subcat` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`username`,`service`,`subcat`),
  KEY `experts_FK_1` (`service`,`subcat`),
  CONSTRAINT `experts_FK` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `experts_FK_1` FOREIGN KEY (`service`, `subcat`) REFERENCES `subcats` (`service`, `subcat`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experts`
--

LOCK TABLES `experts` WRITE;
/*!40000 ALTER TABLE `experts` DISABLE KEYS */;
/*!40000 ALTER TABLE `experts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchases` (
  `id_p` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `service` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `details` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subcat` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_p`),
  KEY `purchases_FK` (`service`,`subcat`),
  CONSTRAINT `purchases_FK` FOREIGN KEY (`service`, `subcat`) REFERENCES `subcats` (`service`, `subcat`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `service` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc_se` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES ('1software','Sofversko servisiranje'),('2hardware','Promena hardvera'),('3apps','Aplikacije'),('4pentesting','Eticko hackovanje'),('5multimedia','Obrada sadrzaja'),('6classes','Casovi');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcats`
--

DROP TABLE IF EXISTS `subcats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcats` (
  `service` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` mediumint(8) unsigned NOT NULL DEFAULT 0,
  `subcat` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `desc_sc` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`service`,`subcat`),
  CONSTRAINT `subcats_FK` FOREIGN KEY (`service`) REFERENCES `services` (`service`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcats`
--

LOCK TABLES `subcats` WRITE;
/*!40000 ALTER TABLE `subcats` DISABLE KEYS */;
INSERT INTO `subcats` VALUES ('1software',500,'1install','(Re)instalacije'),('1software',500,'2perf','Optimizacije'),('1software',500,'3other','Drugo'),('2hardware',500,'conf','Konfiguracije'),('2hardware',500,'replace','Zamene delova'),('3apps',500,'1web','Web app'),('3apps',500,'2mobile','Mobilna app'),('3apps',500,'3desktop','Desktop app'),('4pentesting',500,'1security','Provera bezbednosti'),('4pentesting',500,'2rooting','Telefoni/Konzole'),('5multimedia',500,'1design','2D/3D dizajn'),('5multimedia',500,'2photo','Fotografije'),('5multimedia',500,'3video','Video snimci'),('6classes',400,'1java','Java'),('6classes',400,'2c_cpp','C, C++'),('6classes',400,'3python','Python'),('6classes',400,'4cs','C#'),('6classes',400,'5js_node','JavaScript, Node.js'),('6classes',400,'6db','Baze podataka'),('6classes',400,'7alg','Algoritmi i strukture'),('6classes',400,'8it','Opsta informatika');
/*!40000 ALTER TABLE `subcats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` tinyint(4) DEFAULT 0,
  `email` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3343576799017822',NULL,'Filip','Stojanovic',2,'filipmymail@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'site'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-09 20:35:22
