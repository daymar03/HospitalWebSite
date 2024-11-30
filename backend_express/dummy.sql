USE Hospital;

-- Inserción de datos en la tabla Patient
INSERT INTO Patient (id, createdAt, bed, dni, name, age, weight, height, phoneNumber, sex) VALUES
(1, NOW(), 101, '12345678A', 'Juan Pérez', 30, 70, 175, '555-1234', 'M'),
(2, NOW(), 102, '23456789B', 'María López', 25, 60, 160, '555-2345', 'F'),
(3, NOW(), 103, '34567890C', 'Carlos García', 40, 80, 180, '555-3456', 'M'),
(4, NOW(), 104, '45678901D', 'Ana Martínez', 35, 55, 165, '555-4567', 'F'),
(5, NOW(), 105, '56789012E', 'Pedro Sánchez', 50, 90, 185, '555-5678', 'M'),
(6, NOW(), 106, '67890123F', 'Laura Fernández', 28, 65, 170, '555-6789', 'F'),
(7, NOW(), 107, '78901234G', 'Jorge Ramírez', 45, 75, 178, '555-7890', 'M'),
(8, NOW(), 108, '89012345H', 'Lucía Torres', 32, 68, 172, '555-8901', 'F'),
(9, NOW(), 109, '90123456I', 'Diego Ruiz', 29, 72, 177, '555-9012', 'M'),
(10, NOW(), 110, '01234567J', 'Sofía Jiménez', 38, 58, 162, '555-0123', 'F');

-- Inserción de datos en la tabla Preconditions
INSERT INTO Preconditions (id, name) VALUES
(1, 'Diabetes'),
(2, 'Hipertensión'),
(3, 'Asma'),
(4, 'Alergias'),
(5, 'Enfermedad cardíaca');

-- Inserción de datos en la tabla Allergies
INSERT INTO Allergies (id, name) VALUES
(1, 'Polen'),
(2, 'Alimentos'),
(3, 'Medicamentos'),
(4, 'Ácaros'),
(5, 'Picaduras de insectos');

-- Inserción de datos en la tabla Current_Medications
INSERT INTO Current_Medications (id, name) VALUES
(1, 'Metformina'),
(2, 'Lisinopril'),
(3, 'Salbutamol'),
(4, 'Ibuprofeno'),
(5, 'Aspirina');

-- Inserción de datos en la tabla Entry_Dates
INSERT INTO Entry_Dates (id, date) VALUES
(1, NOW()),
(2, NOW() - INTERVAL 1 DAY),
(3, NOW() - INTERVAL 2 DAY),
(4, NOW() - INTERVAL 3 DAY),
(5, NOW() - INTERVAL 4 DAY);

-- Inserción de datos en la tabla Consultation_Reasons
INSERT INTO Consultation_Reasons (id, reason) VALUES
(1, 'Chequeo general'),
(2, 'Dolor de cabeza'),
(3, 'Dificultad para respirar'),
(4, 'Cita de seguimiento'),
(5, 'Reacción alérgica');

-- Inserción de datos en la tabla Patient_Preconditions
INSERT INTO Patient_Preconditions (id, patient_id, preconditions_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 1),
(7, 7, 2),
(8, 8, 3),
(9, 9, 4),
(10, 10, 5);

-- Inserción de datos en la tabla Patient_Allergies
INSERT INTO Patient_Allergies (id, patient_id, allergies_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 1),
(7, 7, 2),
(8, 8, 3),
(9, 9, 4),
(10, 10, 5);

-- Inserción de datos en la tabla Patient_Current_Medications
INSERT INTO Patient_Current_Medications (id, patient_id, current_medications_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 1),
(7, 7, 2),
(8, 8, 3),
(9, 9, 4),
(10, 10, 5);

-- Inserción de datos en la tabla Patient_Entry_Dates
INSERT INTO Patient_Entry_Dates (id, patient_id , entry_dates_id) VALUES
(1 ,1 ,1),
(2 ,2 ,2),
(3 ,3 ,3),
(4 ,4 ,4),
(5 ,5 ,5),
(6 ,6 ,1),
(7 ,7 ,2),
(8 ,8 ,3),
(9 ,9 ,4),
(10 ,10 ,5);

-- Inserción de datos en la tabla Entry_Dates_Consultation_Reasons
INSERT INTO Entry_Dates_Consultation_Reasons (id , entry_dates_id , consultation_reasons_id) VALUES
(1 ,1 ,1),
(2 ,2 ,2),
(3 ,3 ,3),
(4 ,4 ,4),
(5 ,5 ,5);

