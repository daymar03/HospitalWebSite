import z from 'zod'

export const passwordSchema = z.string()
  .min(24, { message: "La contraseña debe tener más de 24 caracteres" })
  .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
  .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
  .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
  .regex(/[\W_]/, { message: "La contraseña debe contener al menos un símbolo" });

export const userSchema = z.object({
  name: z.string(),
  roles: z.array(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]))
});

export const patientSchema = z.object({
  bed: z.string(),
  name: z.string().min(1, "el nombre no debe estar vacío."),
  age: z.number().int().positive().max(150),
  height: z.number().int().positive().max(250),
  weight: z.number().int().positive().max(500),
  dni: z.string().regex(/^\d{11}$/, "El número de identidad debe tener 11 dígitos"),
  phoneNumber: z.string().regex(/^\d{8}$/, "El número de teléfono debe tener 8 dígitos"),
  sex: z.enum(["M", "F"], "El sexo debe ser 'M' o 'F'"),
  consultationReasons: z.string(),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  preconditions: z.array(z.string()),
	risk_patient: z.boolean()
});

export const operationSchema = z.object({
  id: z.number().int().positive().optional(),
  priority: z.enum([0, 1]).optional(),
  estimated_duration: z.number().int().positive().optional(),
  description: z.string().optional(),
  real_duration: z.number().int().positive().optional(),
  scheduled_date: z.string().optional(),
  results: z.string().optional(),
  responsable: z.string().optional(),
  patient_id: z.number().int().positive().optional(),
});

