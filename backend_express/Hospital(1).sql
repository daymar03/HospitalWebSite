CREATE DATABASE IF NOT EXISTS Hospital;

USE Hospital;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON Hospital.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE `Patient` (
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
  `consultationReasons` text
);

CREATE TABLE `Patient_Preconditions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `preconditions_id` integer
);

CREATE TABLE `Preconditions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `Patient_Allergies` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `allergies_id` integer
);

CREATE TABLE `Allergies` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `Patient_Current_Medications` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `current_medications_id` integer
);

CREATE TABLE `Current_Medications` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `Patient_Entry_Dates` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `entry_dates_id` integer
);

CREATE TABLE `Entry_Dates` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `date` timestamp
);

CREATE TABLE `History` (
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
  `leaving_reasons` text
);

CREATE TABLE `Operation` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `priority` integer,
  `estimated_duration` int,
  `description` text,
  `real_duration` int,
  `made` bool,
  `date` timestamp,
  `results` text,
  `responsable` varchar(255)
);

CREATE TABLE `Patient_Operation` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` integer,
  `operation_id` integer
);

CREATE TABLE `Operation_Request` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `priority` integer,
  `estimated_duration` int,
  `description` text,
  `date` timestamp,
  `responsable` varchar(255),
  `approved` bool
);

CREATE TABLE `Patient_Operation_Request` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `patient_id` int,
  `operation_request_id` int
);

CREATE TABLE `User_Notification` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `notification_id` int
);

CREATE TABLE `Notification` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `body` text,
  `titulo` varchar(255),
  `date` timestamp,
  `readed` bool
);

CREATE TABLE `User` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `departament` int,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL
);

CREATE TABLE `User_Rol` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `rol_id` integer
);

CREATE TABLE `Rol` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `Permission` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `rol_id` int
);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`preconditions_id`) REFERENCES `Preconditions` (`id`);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`allergies_id`) REFERENCES `Allergies` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`current_medications_id`) REFERENCES `Current_Medications` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`entry_dates_id`) REFERENCES `Entry_Dates` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Permission` ADD FOREIGN KEY (`rol_id`) REFERENCES `Rol` (`id`);

ALTER TABLE `User_Rol` ADD FOREIGN KEY (`rol_id`) REFERENCES `Rol` (`id`);

ALTER TABLE `User_Rol` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `User_Notification` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `User_Notification` ADD FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`id`);

ALTER TABLE `Operation` ADD FOREIGN KEY (`responsable`) REFERENCES `User` (`username`);

ALTER TABLE `Patient_Operation` ADD FOREIGN KEY (`operation_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Operation` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Operation_Request` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Operation_Request` ADD FOREIGN KEY (`operation_request_id`) REFERENCES `Operation_Request` (`id`);

ALTER TABLE `Operation_Request` ADD FOREIGN KEY (`responsable`) REFERENCES `User` (`username`);