CREATE DATABASE IF NOT EXISTS Hospital;

USE Hospital;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON Hospital.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `Patient` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `bed` integer UNIQUE,
  `dni` varchar(255) UNIQUE,
  `name` varchar(255),
  `age` integer,
  `weight` integer,
  `height` integer,
  `phoneNumber` varchar(255),
  `sex` varchar(255)
);

CREATE TABLE IF NOT EXISTS `Patient_Preconditions` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` integer,
  `preconditions_id` integer
);

CREATE TABLE IF NOT EXISTS `Preconditions` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Allergies` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` integer,
  `allergies_id` integer
);

CREATE TABLE IF NOT EXISTS `Allergies` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Current_Medications` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` integer,
  `current_medications_id` integer
);

CREATE TABLE IF NOT EXISTS `Current_Medications` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Entry_Dates` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` integer,
  `entry_dates_id` integer
);

CREATE TABLE IF NOT EXISTS `Entry_Dates` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `date` timestamp
);

CREATE TABLE IF NOT EXISTS `Entry_Dates_Consultation_Reasons` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `entry_dates_id` integer,
  `consultation_reasons_id` integer
);

CREATE TABLE IF NOT EXISTS `Consultation_Reasons` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `reason` text
);

CREATE TABLE IF NOT EXISTS `History` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS `Operation` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `priority` integer,
  `estimated_duration` int,
  `description` text,
  `real_duration` int,
  `made` bool,
  `date` timestamp,
  `results` text,
  `responsable` varchar(255)
);

CREATE TABLE IF NOT EXISTS `Patient_Operation` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` integer,
  `operation_id` integer
);

CREATE TABLE IF NOT EXISTS `Operation_Request` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `priority` integer,
  `estimated_duration` int,
  `description` text,
  `date` timestamp,
  `responsable` varchar(255),
  `approved` bool
);

CREATE TABLE IF NOT EXISTS `Patient_Operation_Request` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `patient_id` int,
  `operation_request_id` int
);

ALTER TABLE `Patient_Operation_Request` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Operation_Request` ADD FOREIGN KEY (`operation_request_id`) REFERENCES `Operation_Request` (`id`);

ALTER TABLE `Patient_Operation` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Operation` ADD FOREIGN KEY (`operation_id`) REFERENCES `Operation` (`id`);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`preconditions_id`) REFERENCES `Preconditions` (`id`);

ALTER TABLE `Patient_Preconditions` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`allergies_id`) REFERENCES `Allergies` (`id`);

ALTER TABLE `Patient_Allergies` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`current_medications_id`) REFERENCES `Current_Medications` (`id`);

ALTER TABLE `Patient_Current_Medications` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`entry_dates_id`) REFERENCES `Entry_Dates` (`id`);

ALTER TABLE `Patient_Entry_Dates` ADD FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`);

ALTER TABLE `Entry_Dates_Consultation_Reasons` ADD FOREIGN KEY (`entry_dates_id`) REFERENCES `Entry_Dates` (`id`);

ALTER TABLE `Entry_Dates_Consultation_Reasons` ADD FOREIGN KEY (`consultation_reasons_id`) REFERENCES `Consultation_Reasons` (`id`);
