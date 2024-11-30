CREATE DATABASE IF NOT EXISTS Hospital;

USE Hospital;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON Hospital.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `Patient` (
  `id` integer PRIMARY KEY,
  `createdAt` timestamp,
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
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `preconditions_id` integer
);

CREATE TABLE IF NOT EXISTS `Preconditions` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Allergies` (
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `allergies_id` integer
);

CREATE TABLE IF NOT EXISTS `Allergies` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Current_Medications` (
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `current_medications_id` integer
);

CREATE TABLE IF NOT EXISTS `Current_Medications` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS `Patient_Entry_Dates` (
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `entry_dates_id` integer
);

CREATE TABLE IF NOT EXISTS `Entry_Dates` (
  `id` integer PRIMARY KEY,
  `date` timestamp
);

CREATE TABLE IF NOT EXISTS `Entry_Dates_Consultation_Reasons` (
  `id` integer PRIMARY KEY,
  `entry_dates_id` integer,
  `consultation_reasons_id` integer
);

CREATE TABLE IF NOT EXISTS `Consultation_Reasons` (
  `id` integer PRIMARY KEY,
  `reason` text
);

CREATE TABLE IF NOT EXISTS `History` (
  `id` integer PRIMARY KEY,
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
  `sex` varchar(255)
);

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
