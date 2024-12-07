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
('Diabetes'),
('Hipertensión'),
('Asma'),
('Alergias'),
('Enfermedad cardíaca');

-- Inserción de datos en la tabla Allergies
INSERT INTO Allergies (name) VALUES
( 'Polen'),
( 'Alimentos'),
( 'Medicamentos'),
( 'Ácaros'),
( 'Picaduras de insectos');

-- Inserción de datos en la tabla Current_Medications
INSERT INTO Current_Medications ( name) VALUES
( 'Metformina'),
( 'Lisinopril'),
( 'Salbutamol'),
( 'Ibuprofeno'),
( 'Aspirina');

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
(5, 5),
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

