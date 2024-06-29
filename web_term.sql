-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: web_term
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `amenity`
--

DROP TABLE IF EXISTS `amenity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenity` (
  `amenity_id` int NOT NULL AUTO_INCREMENT,
  `amenity_name` varchar(45) NOT NULL,
  PRIMARY KEY (`amenity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subsite_id` int NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `adult` int NOT NULL,
  `child` int NOT NULL,
  `price` int NOT NULL,
  `accept` tinyint NOT NULL,
  `cancel` tinyint NOT NULL,
  PRIMARY KEY (`book_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `subsite_id_idx` (`subsite_id`),
  CONSTRAINT `subsite_id` FOREIGN KEY (`subsite_id`) REFERENCES `subsite` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campsite`
--

DROP TABLE IF EXISTS `campsite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campsite` (
  `campsite_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `contact` varchar(45) NOT NULL,
  `information` varchar(45) DEFAULT NULL,
  `check_in_time` time NOT NULL,
  `check_out_time` time NOT NULL,
  `thumbnail` mediumblob,
  `start_manner_time` time DEFAULT NULL,
  `end_manner_time` time DEFAULT NULL,
  `owner_id` int NOT NULL,
  PRIMARY KEY (`campsite_id`),
  KEY `owner_id_idx` (`owner_id`),
  CONSTRAINT `owner_id` FOREIGN KEY (`owner_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campsite_amenity`
--

DROP TABLE IF EXISTS `campsite_amenity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campsite_amenity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campsite_id` int NOT NULL,
  `amenity_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `amenity_id_idx` (`amenity_id`),
  KEY `campsite_id_idx` (`campsite_id`),
  CONSTRAINT `amenity_id` FOREIGN KEY (`amenity_id`) REFERENCES `amenity` (`amenity_id`),
  CONSTRAINT `campsite_id` FOREIGN KEY (`campsite_id`) REFERENCES `campsite` (`campsite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `writer_id` int NOT NULL,
  `content` varchar(45) NOT NULL,
  `star` int NOT NULL,
  `created_at` date NOT NULL,
  `thumbnail` mediumblob,
  PRIMARY KEY (`id`),
  KEY `book_id_idx` (`book_id`) /*!80000 INVISIBLE */,
  KEY `user_id_idx` (`writer_id`),
  CONSTRAINT `book_id` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`),
  CONSTRAINT `writer_id` FOREIGN KEY (`writer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subsite`
--

DROP TABLE IF EXISTS `subsite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subsite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campsite_id` int NOT NULL,
  `site_type` varchar(10) NOT NULL,
  `capacity` int NOT NULL,
  `price` int NOT NULL,
  `site_thumbnail` mediumblob,
  PRIMARY KEY (`id`),
  KEY `campsite_id_idx` (`campsite_id`),
  CONSTRAINT `camp_id` FOREIGN KEY (`campsite_id`) REFERENCES `campsite` (`campsite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(20) NOT NULL,
  `user_id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(20) NOT NULL,
  `user_type` tinyint NOT NULL DEFAULT '1',
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-29 22:01:44
