import express from 'express'
import cors from 'cors'
import z from 'zod'
import Patient from './resources/Patient.js'
import User from './resources/User.js'
import Operation from './resources/Operation.js'
import Notification from './resources/Notifications.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { createSecretKey } from 'crypto'
import { createJWT, decryptJWT, getResource } from './utils/utils.js'
import { actionAccessControl, staticAccessControl } from './schemas/roles.schema.js'

const userSchema = z.object({
  name: z.string(),
  roles: z.array(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]))
})

const patientSchema = z.object({
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
  preconditions: z.array(z.string())
})

const OperationSchema = z.object({
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

const Patient_Endpoints = new Patient()
const User_Endpoints = new User()
const Operation_Endpoints = new Operation()
const Notification_Endpoints = new Notification()


dotenv.config()
const app = express()
const port = 3000
const appPath = process.env.APP_PATH
const secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');
const templates = ["admin", "informacion", "ingresar", "login", "notificaciones", "repitlogin", "salas", "permissionDenied"]
const actions = ["GET", "POST", "PATCH", "DELETE"]
const resources ={
  "api" : ["patients", "users", "notifications", "operations"],
  "template": templates,
  "static": ["css", "js", "img", "assets"]
}

if (!secretKey) {
  console.error("JWT_SECRET environment variable not set!");
}

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

/*
   -----------------
  |  PATIENTS CRUD  |
  __________________
  ** Endpoints:
   $ READ
    --> /patients
    --> /patients:id
    --> /patient:bed
    --> /patients/all
   $ CREATE
    --> /patients/create
   $ UPDATE
   $ DELETE
    --> /patients/delete
*/


/*function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  if (req.cookies.session){console.log(req.cookies.session)}
  if (adminRegex.test(req.path)) {
    console.log('Solicitud a /admin o subruta de /admin');
    res.status(403).send('<h1>You dont have permission to have this resourde</h1>')
  } else {
  next();}
}

app.use(logger);
*/

//+*********************************[MIDDLEWARES]**************************************

async function haveSession(req, res, next) {
  try {
    const session = req.cookies.session;
		console.log(session)
    if (session) { // Tiene token de sesión
      const payload = await decryptJWT(session);
			console.log(payload)
      if (payload) { // El token es válido
        req.session = true;
				req.username = payload.payload.username
        req.roles = payload.payload.roles.split(',');
        req.endpoint = req.path.split('/')[1];
        req.resource = getResource(req.path); // Ej: de /api/patients/all -> ["api", "/patients/all"]
        console.log("Resources:", req.resource);
        req.action = actions.indexOf(req.method);
        next();
      } else { // El token no es válido
        req.session = false;
        next();
      }
    } else { // No tiene token de sesión
      req.session = false;
      next();
    }
  } catch (err) {
    console.log(err);
    next(err); // Asegúrate de pasar el error al manejador de errores
  }
}


async function login(req, res, next){
  console.log("Entrando al middleware LOGIN")
  console.log(req.session, req.cookies)
  if (!req.session){
    console.log("PORBANDO, ENTRO A !SESSION")
    res.redirect('/login')
    return
  }else if(!req.permission){
    console.log("PORBANDO, ENTRO A !PERMISSION")
    res.redirect('/permissionDenied')
    next('route')
    return
  }
  else {
    console.log("PORBANDO, ENTRO A ELSE")
    next()
    return
  }
}

export async function access(req, res, next) {
  const { session, roles, endpoint, resource, action } = req;
  console.log("SESSSIOOON:", session);
  if (session) {
    console.log("Entrando en access()");
    req.permission = false;
    if (req.resource[0] === "static") { // Si accede a archivos estáticos (css, js, img)
      req.permission = true;
      return next(); // Está permitido
    } else if (req.resource[0] === "api") {
      for (const rol of roles) {
	console.log("RESOURCE BEFORE VALIDATION:", resource)
        if (await actionAccessControl(rol, action, resources.api.indexOf(resource[1]))) { // Si alguno de sus roles
          req.permission = true; // Le otorga permiso a acceder
          return next();
        }
      }
      return next(); // Si ninguno de los roles tiene permiso, pasar al siguiente middleware
    } else if (req.resource[0] === "template") {
      for (const rol of roles) {
        if (await staticAccessControl(rol, resource[1].split('/')[1])) { // Si alguno de sus roles
          req.permission = true; // Le otorga permiso a acceder
          return next();
        }
      }
      return next(); // Si ninguno de los roles tiene permiso, pasar al siguiente middleware
    } else {
      req.permission = true;
      return next();
    }
  } else {
    console.log("Saliendo de access (No autenticado)");
    return next('route');
  }
}


//+**********************************[app.use()]***************************************
app.use(haveSession)
app.use(access)
//app.use(permitDenied)
app.use('/img', express.static(path.join('./static/', 'img')));
app.use('/assets', express.static(path.join('./static/', 'assets')));
app.use('/css', express.static(path.join('./static/', 'css')));
app.use('/js', express.static(path.join('./static/', 'js')));


//**********************************[app.get()]***************************************
app.get('/login', async (req, res)=>{
  res.sendFile(`${appPath}/templates/login.html`)
})

app.get('/repitlogin', async (req, res)=>{
  res.sendFile(`${appPath}/templates/repitlogin.html`)
})

app.get('/salas',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/salas.html`)
})

app.get('/informacion',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/informacion.html`)
})

app.get('/ingresar',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/ingresar.html`)
})

app.get('/notificaciones',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/notificaciones.html`)
})

app.get('/admin',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/admin.html`)
})

app.get('/permissionDenied',login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/permissionDenied.html`)
})

app.get('/api/notifications',login, async (req, res)=>{
try{
	const username = req.username
	console.log(username)
	if(!username){
		res.status(400).json({error: "Bad Request"})
	}
	const notifications = await Notification_Endpoints.getNotifications(username)
	console.log("NOTIFICAAAA",notifications)
	if(notifications){
		res.json(notifications)
	}else{
		res.status(500).json({error: "Internal Server Error"})
	}
}catch(err){
	res.status(500).json(err)
}
})

app.get('/api/patients/all',login, async (req,res)=>{
  try {
   const patients = await Patient_Endpoints.GET_Patients_All();
   res.json(patients);
  } catch(err) {
    res.status(500).json({error: 'Error fetching patients'})
  }
})

app.get('/api/patients',login, async (req,res)=>{
  const options = req.query;
  // by room
  if (options.room){
    try {
      const patients = await Patient_Endpoints.GET_Patients_By_Room_Number(options.room)
      res.json(patients)
    } catch (err){
      res.status(500).json({error: "error fetching patients"})
    }
  }

  // by id
  else if(options.id){
   try {
    const patients = await Patient_Endpoints.GET_Patients_By_Id(options.id);
    res.json(patients);
   } catch(err) {
     res.status(500).json({error: 'Error fetching patient'})
   }
  // by bed
  } else if(options.bed) {
   try {
    const patients = await Patient_Endpoints.GET_Patients_By_Bed_Number(options.bed);
    res.json(patients);
   } catch(err) {
     res.status(500).json({error: 'Error fetching patients'})
   }
  // pages
  } else {
   try {
    const patients = await Patient_Endpoints.GET_Patients(options);
    res.json(patients);
   } catch(err) {
     res.status(500).json({error: 'Error fetching patients'})
   }
  }
})


app.get('/api/users', login, async (req, res)=>{
  const id = req.query.id
  if(!id){
  try{
    const users = await User_Endpoints.getUsers()
    res.json(users)
  } catch(err){
    console.log(err)
    res.status(500).json(err)
  }} else {
    try{
      const user = await User_Endpoints.getUserById(id)
      res.json(user)
    } catch(err){
      console.log(err)
      res.status(500).json(err)
    }
  }
})

app.get('/api/operations', login, async (req, res)=>{
  try{
    const results = await Operation_Endpoints.getOperations()
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})


//*************************************[app.post()]****************************************

app.post('/api/notifications/send', async(req, res)=>{
	try{
		const { notification } = req.body
		const send = await Notification_Endpoints.sendNotification(notification)
		if(send.success){
			res.status(201).json(send)
		} else {
			res.status(500).json({success: false})
		}
	}catch(err){
		console.log(err)
		res.json(err)
	}
})

app.post('/api/users/register', login, async (req, res)=>{
  let { user } = req.body
  if(!user){
    res.status(400).json({error: "Bad request"})
    return
  }
  const validUser = userSchema.safeParse(user)

  if(validUser.success){
    user = validUser.data
    try {
      const resp = await User_Endpoints.registerUser(user)
      res.json(resp)
    }
    catch (err){
      console.log(err)
      res.status(500).json(err)
    }
  } else{
    res.status(404).json({error: "Bad Request"})
  }
})

app.post('/api/users/login', async (req, res)=>{
  try {
  const { username, password } = req.body
  if(!username || !password){
    res.redirect( "/repitlogin")
    return
  } else{
    const isValidUser = await User_Endpoints.loginUser(password, username)
    if (isValidUser.success){
			const expirationTime = Math.floor(Date.now() / 1000) + (30 * 60);
      const jwt = await createJWT({
        "username": username,
        "roles": isValidUser.roles,
				"exp": expirationTime
      })
      res.cookie('session', jwt,{ //testing
        expires: new Date(Date.now() + 900000),
        httpOnly: true
      })
      res.redirect('/salas')
    } else {
      res.redirect('/repitlogin')
    }
  }}catch(err){
    res.redirect("/repitlogin")
    console.log(err)
  }
})



app.post('/api/users/changepassword', login, async (req, res)=>{
  try {
  const { username, password } = req.body
  const hist = await User_Endpoints.changePassword(username, password)
  res.json({resp: hist})
  } catch(err){
    res.json({error: err})
  }
})



app.post('/api/operations', login, async (req, res)=>{
  const { operation } = req.body
  if (operation){
    try {
      let insertResults = await Operation_Endpoints.requestOperation(operation)
      res.status(200).json(insertResults)
    } catch (err){
      res.status(500).json(err)
    }
  } else{
    res.status(404).json({error: "Bad Request"})
    console.log("Bad operation request")
  }
})

app.post('/api/patients/create', login, async (req,res)=>{
  const { patient } = req.body
  const result = patientSchema.safeParse(patient)
  if (result.success) {
  try {
    const insertResult = await Patient_Endpoints.CreatePatient(patient)
    res.json(insertResult)
  } catch(err){
    res.status(500).json(err)
  }
  } else {res.status(400).json({error:"Bad Request", message: result.error.errors[0].message})}

})

//***************************************[app.patch()]*************************************
app.patch('/api/notifications/read', async (req, res)=>{
	try{
		const { notification_id } = req.body
		const read = await Notification_Endpoints.readNotification(notification_id)
		if (read.success){
			res.json(read)
		} else{
			res.json({success: false})
		}
	}catch(err){
		console.log(err)
		res.status(500).json({error: "Internal Server Error"})
	}
})

app.patch('/api/operations/approve', login, async (req, res)=>{
  const { operation_approval } = req.body
  try{
    const results = await Operation_Endpoints.approveOperation(operation_approval)
    res.json(results)
  } catch(err){
    res.status(500).json({error: err})
  }

})

app.patch('/api/operations/made', login, async (req, res)=>{
  try{
    const { operation_results } = req.body
    if (!operation_results){
      res.status(400).json({error: "Bad request"})
    }
    const results = await Operation_Endpoints.madeOperation(operation_results)
    res.json(results)
  } catch(err){
    res.json(err)
  }
})


app.patch('/api/patients/update', login, async (req, res) => {
  const { id, bed } = req.query;
  // search by id or bed
  const { age, weight, height, phoneNumber, name,
          currentMedications } = req.body;
  if (!id && !bed) {
    return res.status(400).json({ success: false, message: "Bad request: id or bed is required" })
  }
  const fieldsToUpdate = {};
  if (age !== undefined) fieldsToUpdate.age = age;
  if (weight !== undefined) fieldsToUpdate.weight = weight;
  if (height !== undefined) fieldsToUpdate.height = height;
  if (phoneNumber !== undefined) fieldsToUpdate.phoneNumber = phoneNumber;
  if (name !== undefined) fieldsToUpdate.name = name;
  try {
    const results = await Patient_Endpoints.PATCH_Patient(fieldsToUpdate,id,bed, currentMedications)
    res.json(results)
  } catch(err) {
    console.error('Error updating patient:', err);
    if(err.message === "Neither the fields nor the medicines were given" ||
       err.message === "Patient does not exists") {
     res.status(400).json({ success: false, message: err.message})
     return
        }
    res.status(500).json({ success: false, message: 'Error updating patient' });
  }
})


//********************************************[app.delete()]***************************************
app.delete('/api/notifications/delete', async (req, res)=>{
	try{
		const {notification_id} = req.body
		const deleted = await Notification_Endpoints.deleteNotification(notification_id)
		if (deleted.success){
			res.json(deleted)
		}else{
			res.json({deleted})
		}
	}catch(err){
		console.log(err)
		res.status(500).json({error: "Internal Server Error"})
	}
})

app.delete('/api/patients/delete', login, async(req,res)=>{
  const options = req.query
  try {
    const results = await Patient_Endpoints.DELETE_Patient(options)
    res.json(results)
  } catch(err) {
    console.log(err)
    if(err.message === "Patient does not exists") {
     res.status(404).json({success:false, message:err.message})
     return
    } else if(err.message === "Patient successfully deleted") {
     res.status(400).json({success:false,message:err.message})
     return
    }
    res.status(500).json({success:false,message:err.message})
  }
})

app.listen(port, ()=> {
 console.log(`Server listening on port ${port}`)
})
