USE Hospital;

-- Inserción de datos en la tabla Patient
INSERT INTO Patient (createdAt, bed, dni, name, age, weight, height, phoneNumber, sex, consultationReasons) VALUES
( NOW(), 101, '12345678A', 'Juan Pérez', 30, 70, 175, '555-1234', 'M', 'Dolor en el pie'),
( NOW(), 102, '23456789B', 'María López', 25, 60, 160, '555-2345', 'F', 'Le pica un ojo'),
( NOW(), 103, '34567890C', 'Carlos García', 40, 80, 180, '555-3456', 'M', 'Ataque de tarros'),
( NOW(), 104, '45678901D', 'Ana Martínez', 35, 55, 165, '555-4567', 'F', 'Jabón en el ojo'),
( NOW(), 105, '56789012E', 'Pedro Sánchez', 50, 90, 185, '555-5678', 'M', 'Le cayó mal el huevo del comedor'),
( NOW(), 106, '67890123F', 'Laura Fernández', 28, 65, 170, '555-6789', 'F', 'Dolor de ovarios'),
( NOW(), 107, '78901234G', 'Jorge Ramírez', 45, 75, 178, '555-7890', 'M', 'Le creció mucho la nariz'),
( NOW(), 108, '89012345H', 'Lucía Torres', 32, 68, 172, '555-8901', 'F', 'Dolor de muela'),
( NOW(), 109, '90123456I', 'Diego Ruiz', 29, 72, 177, '555-9012', 'M', 'Ni el mismo sabe'),
( NOW(), 110, '01234567J', 'Sofía Jiménez', 38, 58, 162, '555-0123', 'F', 'Ya no se que inventar');

-- Inserción de datos en la tabla Preconditions
INSERT INTO Preconditions (name) VALUES
( 'diabetes'),
( 'hipertensión'),
( 'asma'),
( 'alergias'),
( 'enfermedad cardíaca');

-- Inserción de datos en la tabla Allergies
INSERT INTO Allergies (name) VALUES
( 'polen'),
( 'alimentos'),
( 'medicamentos'),
( 'ácaros'),
( 'picaduras de insectos');

-- Inserción de datos en la tabla Current_Medications
INSERT INTO Current_Medications ( name) VALUES
( 'metformina'),
( 'lisinopril'),
( 'salbutamol'),
( 'ibuprofeno'),
( 'aspirina');

-- Inserción de datos en la tabla Entry_Dates
INSERT INTO Entry_Dates ( date) VALUES
( NOW()),
( NOW() - INTERVAL 1 DAY),
( NOW() - INTERVAL 2 DAY),
( NOW() - INTERVAL 3 DAY),
( NOW() - INTERVAL 4 DAY);

INSERT INTO Patient_Preconditions ( patient_id, preconditions_id) VALUES
( 1, 1),
( 2, 2),
( 3, 3),
( 4, 4),
( 5, 5),
( 6, 1),
( 7, 2),
( 8, 3),
( 9, 4),
( 10, 5);

-- Inserción de datos en la tabla Patient_Allergies
INSERT INTO Patient_Allergies (patient_id, allergies_id) VALUES
( 1, 1),
( 2, 2),
( 3, 3),
( 4, 4),
( 5, 5),
( 6, 1),
( 7, 2),
( 8, 3),
( 9, 4),
(10, 5);

-- Inserción de datos en la tabla Patient_Current_Medications
INSERT INTO Patient_Current_Medications (patient_id, current_medications_id) VALUES
( 1, 1),
( 2, 2),
( 3, 3),
( 4, 4),
( 5, 5),
( 6, 1),
( 7, 2),
( 8, 3),
( 9, 4),
( 10, 5);

-- Inserción de datos en la tabla Patient_Entry_Dates
INSERT INTO Patient_Entry_Dates (patient_id , entry_dates_id) VALUES
(1 ,1),
(2 ,2),
(3 ,3),
(4 ,4),
(5 ,5),
(6 ,1),
(7 ,2),
(8 ,3),
(9 ,4),
(10 ,5);

INSERT INTO Rol (id, name) VALUES
(0, 'Admin'),
(1, 'Director'),
(2, 'Doctor'),
(3, 'Nurse'),
(4, 'Recepcionist');

INSERT INTO User (name, username, password, department) VALUES
( 'Daymar David Guerrero Santiago', 'daymar03', '$2b$10$0W5iVmqFI3fI8Z6Ygd0SSedjPNObb..fN6JOr6D.q861qVSdufSGq', 'Admin'), -- admin123daymar
( 'Kevin Calaña Castellón', 'calanac', '$2b$10$swpXGMambxQNiPSEVKydhumP49qw2X7XLFkkgGVlvuSwaXeDJz04G', 'Admin'), -- admin123kevin
( 'Ramón Alejandro Mateo Ochoa', 'amateo', '$2b$10$O4JkUDtw1xNkcCXl2CisNucJK9xpGibs0nXc1l2VzOuuO7HjuV2Em', 'Admin'), -- admin123mateo
( 'Christopher Fernando Frias Ramos', 'ffrias', '$2b$10$ceeJCq2klpPp36CNoeeR7OaRP5syBS/9yZQCQqgxS6DLZXvmShSDe', 'Admin'), -- admin123chris
( 'Marc Anthony Echemendía Romero', 'marca', '$2b$10$wwlmSunz5nbwfAvOx.hCjuxdiV6MrhXzntk22It7mrvHPV1JWaLoC', 'Admin'); -- admin123marc

INSERT INTO User_Rol (user_id, rol_id) VALUES
(1,0),
(2,0),
(3,0),
(4,0),
(5,0);

INSERT INTO Password_History (passwords, user_id) VALUES
(CONCAT('[{"password": "$2b$10$0W5iVmqFI3fI8Z6Ygd0SSedjPNObb..fN6JOr6D.q861qVSdufSGq", "date":"', NOW(), '"}]'), 1),
(CONCAT('[{"password": "$2b$10$swpXGMambxQNiPSEVKydhumP49qw2X7XLFkkgGVlvuSwaXeDJz04G", "date":"', NOW(), '"}]'), 2),
(CONCAT('[{"password": "$2b$10$O4JkUDtw1xNkcCXl2CisNucJK9xpGibs0nXc1l2VzOuuO7HjuV2Em", "date":"', NOW(), '"}]'), 3),
(CONCAT('[{"password": "$2b$10$ceeJCq2klpPp36CNoeeR7OaRP5syBS/9yZQCQqgxS6DLZXvmShSDe", "date":"', NOW(), '"}]'), 4),
(CONCAT('[{"password": "$2b$10$wwlmSunz5nbwfAvOx.hCjuxdiV6MrhXzntk22It7mrvHPV1JWaLoC", "date":"', NOW(), '"}]'), 5);

INSERT INTO Notification (titulo, body) VALUES
('Welcome', 'Hi Admin, Welcome'),
('Welcome', 'Hi Admin, Welcome'),
('Welcome', 'Hi Admin, Welcome'),
('Welcome', 'Hi Admin, Welcome'),
('Welcome', 'Hi Admin, Welcome');

INSERT INTO User_Notification (user_id, notification_id) VALUES
(1 ,1),
(2 ,2),
(3 ,3),
(4 ,4),
(5 ,5);

INSERT INTO User (name, username, password, department) VALUES
( 'Ana María López Hernández', 'anamlh', '$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy', 'Admin'), -- Contraseña test
( 'Luis Alberto Gómez Pérez', 'lagp', '$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy', 'Director'), -- Contraseña test
( 'Laura Martínez Rivera', 'lmr', '$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy', 'Doctor'), -- Contraseña test
( 'Carlos Enrique Torres', 'cet', '$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy', 'Nurse'), -- Contraseña test
( 'Carmen Julia Ruiz', 'cjr', '$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy', 'Recepcionist'); -- Contraseña test

INSERT INTO User_Rol (user_id, rol_id) VALUES
(6, 0), -- Ana María López Hernández: Admin
(7, 1), -- Luis Alberto Gómez Pérez: Director
(8, 2), -- Laura Martínez Rivera: Doctor
(9, 3), -- Carlos Enrique Torres: Nurse
(10, 4); -- Carmen Julia Ruiz: Recepcionist


INSERT INTO Password_History (passwords, user_id) VALUES
(CONCAT('[{"password": "$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy", "date":"', NOW(), '"}]'), 6),
(CONCAT('[{"password": "$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy", "date":"', NOW(), '"}]'), 7),
(CONCAT('[{"password": "$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy", "date":"', NOW(), '"}]'), 8),
(CONCAT('[{"password": "$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy", "date":"', NOW(), '"}]'), 9),
(CONCAT('[{"password": "$2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy", "date":"', NOW(), '"}]'), 10);

INSERT INTO Notification (titulo, body) VALUES
('New Admin Task', 'Hi Ana, you have a new admin task assigned'),
('Director Meeting', 'Hi Luis, there is a meeting scheduled for directors'),
('Doctor Appointment', 'Hi Laura, you have a new patient appointment'),
('Nursing Duty', 'Hi Carlos, your nursing duty has been updated'),
('Reception Assignment', 'Hi Carmen, you have a new task at the reception');

INSERT INTO User_Notification (user_id, notification_id) VALUES
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);
