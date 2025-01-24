CREATE DATABASE IF NOT EXISTS Hospital;

USE Hospital;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON Hospital.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `Patient` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `createdAt` timestamp,
  `bed` integer UNIQUE,
  `dni` varchar(255) UNIQUE,
  `name` varchar(255),
  `age` integer,
  `weight` integer,
  `height` integer,
  `phoneNumber` varchar(255),
  `sex` varchar(255),
  `consultationReasons` text,
  `risk_patient` bool
);

CREATE TABLE IF NOT EXISTS `Patient_Preconditions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `preconditions_id` integer
);

CREATE TABLE IF NOT EXISTS `Preconditions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Allergies` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `allergies_id` integer
);

CREATE TABLE IF NOT EXISTS `Allergies` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Current_Medications` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `current_medications_id` integer
);

CREATE TABLE IF NOT EXISTS `Current_Medications` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Entry_Dates` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `entry_dates_id` integer
);

CREATE TABLE IF NOT EXISTS `Entry_Dates` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `date` timestamp
);

CREATE TABLE IF NOT EXISTS `History` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `createdAt` timestamp,
  `bed` integer,
  `dni` varchar(255),
  `name` varchar(255),
  `age` integer,
  `weight` integer,
  `height` integer,
  `phoneNumber` varchar(255),
  `preconditions` varchar(255),
  `allergies` varchar(255),
  `medications` varchar(255),
  `entry_date` timestamp,
  `consultation_reasons` text,
  `departure_date` timestamp,
  `leaving_reasons` text,
  `risk_patient` bool
);

CREATE TABLE IF NOT EXISTS `Operation` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `priority` integer,
  `estimated_duration` int,
  `description` text,
  `real_duration` int,
  `made` bool DEFAULT false,
  `request_date` timestamp,
  `scheduled_date` timestamp DEFAULT null,
  `results` text,
  `responsable` varchar(255) NOT NULL,
  `patient_id` int,
  `approved` bool DEFAULT false
);

CREATE TABLE IF NOT EXISTS `User_Notification` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `notification_id` int
);

CREATE TABLE IF NOT EXISTS `Notification` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `body` text,
  `titulo` varchar(255),
  `date` timestamp,
  `readed` bool,
  `deleted` bool
);

CREATE TABLE IF NOT EXISTS `User` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `tryes` int DEFAULT 0,
  `blocked` bool DEFAULT false,
  `department` varchar(255),
  `last_login` timestamp DEFAULT null,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
	`last_logout` varchar(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `User_Rol` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `rol_id` integer
);

CREATE TABLE IF NOT EXISTS `Rol` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE IF NOT EXISTS `Password_History` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `passwords` JSON,
  `user_id` int
);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`preconditions_id`) REFERENCES `Preconditions` (`id`);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`allergies_id`) REFERENCES `Allergies` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`current_medications_id`) REFERENCES `Current_Medications` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`entry_dates_id`) REFERENCES `Entry_Dates` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `User_Rol` ADD FOREIGN KEY (`rol_id`) REFERENCES `Rol` (`id`);

ALTER TABLE `User_Rol` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `User_Notification` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `User_Notification` ADD FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`id`);

ALTER TABLE `Operation` ADD FOREIGN KEY (`responsable`) REFERENCES `User` (`username`);

ALTER TABLE `Password_History` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Operation` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

/* IP */
CREATE TABLE IF NOT EXISTS login_bans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempts INT DEFAULT 1,
    ban_start_time TIMESTAMP NULL,
    ban_end_time TIMESTAMP NULL,
    is_banned BOOLEAN DEFAULT FALSE,
    reason VARCHAR(255) NULL,
    INDEX (ip_address),
    INDEX (attempt_time),
    INDEX (ban_end_time),
    INDEX (is_banned)
);

