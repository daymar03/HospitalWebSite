import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from "jose"
import z from 'zod'
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url';

const templates = ["admin", "informacion", "ingresar", "login", "notificaciones", "repitlogin", "salas", "permissionDenied"]
const actions = ["GET", "POST", "PATCH", "DELETE"]
const resources = {
  "api": ["patients", "users", "notifications", "operations"],
  "template": templates,
  "static": ["css", "js", "img", "assets"]
}
const dateTimeSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  {
    message: "La fecha debe estar en el formato YYYY-MM-DD HH:MM:SS"
  }
);


export function isValidBase64(str) {
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
}

// Función para generar una contraseña aleatoria
function generarContraseña(longitud = 16) {
  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*_-"ñ!·$%&/';
  return Array.from({ length: longitud }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
}

// Función para generar un nombre de usuario basado en un nombre
function generarNumeroAleatorio(n) {
  let numeroAleatorio = '';
  for (let i = 0; i < n; i++) {
    numeroAleatorio += Math.floor(Math.random() * 10);
  }
  return numeroAleatorio;
}

function generateUsername(name) {
  console.log(name)
  let offset
  let usernameParts = name.split(' ')
  let length = usernameParts.length
  let n1 = Math.floor(Math.random() * 10) % length
  let n2 = Math.floor(Math.random() * 10) % length
  let username = usernameParts[n1].substring(0, 1) + usernameParts[n2]

  if (username.length < 7) {
    offset = 10 - username.length
    username += generarNumeroAleatorio(offset)
  } else {
    username = username.substring(0, 7) + generarNumeroAleatorio(3)
    username = username
  }
  return username.toLowerCase()
}


// Función para generar usuario y contraseña
export function generarUsuarioContrasena(nombre, longitudContraseña = 24) {
  const username = generateUsername(nombre);
  const password = generarContraseña(longitudContraseña);
  return { username, password };
}

export async function createJWT(payload) {
  const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!encodedKey) {
    console.error("JWT_SECRET environment variable not set!");
    return null; // or throw an error
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decryptJWT(session) {
  try {
    const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!encodedKey) {
      console.error("JWT_SECRET environment variable not set!");
      return null; // or throw an error
    }
    const payload = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (err) {
    console.error("Error decrypting JWT:", err); // Use console.error for better error handling
    return null;
  }
}

export function getResource(path) {
  const base = path.split('/')[1]
  if (base === "api") {
    return ["api", path.split('/')[2]]
  } else if (resources["static"].includes(base)) {
    return ["static", `/${path.split('/').slice(1).join('/')}`]
  } else {
    return ["template", `${path}`]
  }
}

// Función para validar los valores de la fecha y hora
export function validateDateTime(dateTimeString) {
  // Verificar el formato base primero
  const result = dateTimeSchema.safeParse(dateTimeString);
  if (!result.success) {
    return false
  }

  // Extraer las partes de la fecha y hora
  const [date, time] = dateTimeString.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);

  // Validar las partes de la fecha y hora
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false
  if (hour < 0 || hour >= 24) return false
  if (minute < 0 || minute >= 60) return false
  if (second < 0 || second >= 60) return false

  // Validación adicional para meses específicos
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // Año bisiesto
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    daysInMonth[1] = 29;
  }
  if (day > daysInMonth[month - 1]) return false

  return true; // Retornar la fecha y hora válida
};

export function compareDates(request, scheduled) {
  // Convertir las cadenas de fecha en objetos Date
  const parsedDate1 = new Date(request.replace(' ', 'T'));
  const parsedDate2 = new Date(scheduled.replace(' ', 'T'));

  // Comparar las fechas
  return parsedDate2 > parsedDate1;
};

// Configuracion local
export function readConfig() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.join(__dirname, '..', 'config.json');
  const data = fs.readFileSync(configPath);
  return JSON.parse(data);
};

export async function writeMaxLogins(num) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.join(__dirname, '..', 'config.json');
  let data = JSON.parse(fs.readFileSync(configPath));
  if (num.MAX_LOGIN_ATTEMPTS > 6) {
    data.MAX_LOGIN_ATTEMPTS = 6
  } else {
    data.MAX_LOGIN_ATTEMPTS = num.MAX_LOGIN_ATTEMPTS
  }
  try {
    fs.writeFileSync(configPath, JSON.stringify(data))
    return {success: true}
  } catch (err) {
    console.log(err)
    return { success: false, error: err }
  }
}
