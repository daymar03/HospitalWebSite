import bcrypt from 'bcrypt';
import {SignJWT, jwtVerify} from "jose"

const templates = ["admin", "informacion", "ingresar", "login", "notificaciones", "repitlogin", "salas", "permissionDenied"]
const actions = ["GET", "POST", "PATCH", "DELETE"]
const resources ={
  "api" : ["patients", "users", "notifications", "operations"],
  "template": templates,
  "static": ["css", "js", "img", "assets"]
}

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

function generateUsername(name){
  console.log(name)
  let offset
  let usernameParts = name.split(' ')
  let length = usernameParts.length
  let n1 = Math.floor(Math.random()*10) % length
  let n2 = Math.floor(Math.random()*10) % length
  let username = usernameParts[n1].substring(0, 1) + usernameParts[n2]

  if (username.length < 7){
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

export function getResource(path){
  const base = path.split('/')[1]
  if (base === "api"){
    return ["api", path.split('/')[2]]
  }else if (resources["static"].includes(base)){
    return ["static", `/${path.split('/').slice(1).join('/')}`]
  } else {
    return ["template", `${path}`]
  }
}
