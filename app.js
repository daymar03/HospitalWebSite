import express from 'express'
import cors from 'cors'
import Patient from './resources/Patient.js'
import User from './resources/User.js'
import Operation from './resources/Operation.js'
import Notification from './resources/Notifications.js'
import Auth from './utils/auth.js'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { createJWT, decryptJWT, validateDateTime } from './utils/utils.js'
import { passwordSchema, userSchema, patientSchema, operationSchema } from './utils/zod-schemas.js'

const Patient_Endpoints = new Patient()
const User_Endpoints = new User()
const Operation_Endpoints = new Operation()
const Notification_Endpoints = new Notification()
const auth = new Auth()

dotenv.config()
const app = express()
const port = 3000
const appPath = process.env.APP_PATH

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//+**********************************[app.use()]***************************************
app.use(auth.haveSession.bind(auth))
app.use(auth.access.bind(auth))
app.use('/img', express.static(path.join('./static/', 'img')));
app.use('/assets', express.static(path.join('./static/', 'assets')));
app.use('/css', express.static(path.join('./static/', 'css')));
app.use('/js', express.static(path.join('./static/', 'js')));


//**********************************[TEMPLATES]***************************************
app.get('/',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/salas.html`)
})

app.get('/login', async (req, res)=>{
  res.sendFile(`${appPath}/templates/login.html`)
})

app.get('/repitlogin', async (req, res)=>{
  res.sendFile(`${appPath}/templates/repitlogin.html`)
})

app.get('/salas',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/salas.html`)
})

app.get('/informacion',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/informacion.html`)
})

app.get('/ingresar',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/ingresar.html`)
})

app.get('/notificaciones',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/notificaciones.html`)
})

app.get('/admin',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/admin.html`)
})

app.get('/permissionDenied',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/permissionDenied.html`)
})

app.get('/changepassword',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/changepassword.html`)
})

//+**********************************[API RESOURCES]**********************************************
//+***********************************[/api/patients/]********************************************

//GET ALL
app.get('/api/patients/all',auth.login, async (req,res)=>{
  try {
    const roles = req.roles
		if (!roles.includes('1')){
			res.status(403).json({error: "Permission Denied"})
			return
		}
   const patients = await Patient_Endpoints.GET_Patients_All();
   res.json(patients);
  } catch(err) {
    res.status(500).json({error: 'Error fetching patients'})
  }
})

//GET ROOMS OCUPATION PERCENT
app.get('/api/patients/ocupation',auth.login, async (req,res)=>{
  try {
		if (!roles.includes('1')){
			res.status(403).json({error: "Permission Denied"})
			return
		}
	 	let percents = {}
		for (let i = 1; i < 5; i++){
      const patients = await Patient_Endpoints.GET_Patients_By_Room_Number(i)
			percents[`room ${i}`] = (patients.length / 10) * 100
		}
		res.json(percents)
  } catch (err){
    console.log(err)
		res.status(500).json({error: "error fetching patients"})
	}
})

//GET BY ROOM || BED || ID
app.get('/api/patients',auth.login, async (req,res)=>{
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

//CREATE PATIENT
app.post('/api/patients/create',auth.login, async (req,res)=>{
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

//UPDATE PATIENT
app.patch('/api/patients/update',auth.login, async (req, res) => {
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

//DELETE PATIENT
app.delete('/api/patients/delete',auth.login, async(req,res)=>{
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

//+***********************************[/api/users]**************************************


app.get('/api/users',auth.login, async (req, res)=>{
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

app.get('/api/users/highpriority',auth.login, async (req, res)=>{
	try{
		const { month, year } = req.query
		const result = await User_Endpoints.getUrgentsMonth(month, year)
		res.json(result)
	}catch(err){
		console.log(err)
		res.status(500).json({error: "Internal Server Error"})
	}
})

app.get('/api/users/bestdoctor',auth.login, async (req, res)=>{
	try{
		const result = await User_Endpoints.getBestDoctor()
		res.json(result)
	}catch(err){
		console.log(err)
		res.status(500).json({error: "Internal Server Error"})
	}
})

app.post('/api/users/register',auth.login, async (req, res)=>{
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

app.post('/api/users/changepassword',auth.login, async (req, res)=>{
  try {
	const username = req.username
  const { lastPassword, password, repitPassword } = req.body
	console.log(username, lastPassword)

	if (password !== repitPassword){
		res.status(400).json({success:false, error:"La nueva contraseña no coincide."})
		return
	}

	const passwords = {lastPassword, password}
	try {
  	passwordSchema.parse(password);
	} catch (e) {
  	res.status(400).json({success:false, error:"La contraseña debe tener 24 caracteres, ademas debe contener: Mayúsculas, Minúsculas, Números, Letras, Símbolos."});
		return
	}
  const hist = await User_Endpoints.changePassword(username, passwords)
	if (hist.success){
  	res.json(hist)
	} else {
		res.status(500).json(hist)
	}
  } catch(err){
    res.json(err)
  }
})

//+*****************************************[/api/operations/]*******************************

app.get('/api/operations/overdue',auth.login, async (req, res)=>{
  try{
		const roles = req.roles
		if (!roles.includes('1')){
			res.status(403).json({error: "Permission Denied"})
			return
		}
    const results = await Operation_Endpoints.getOverdueOperations()
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})


app.get('/api/operations/range',auth.login, async (req, res)=>{
  try{
		const { start, end } = req.query
		const roles = req.roles
		if (!roles.includes('1')){
			res.status(403).json({error: "Permission Denied"})
			return
		}
		if (!validateDateTime(start) || !validateDateTime(end)){
			res.status(400).json({success: false, error: "Invalid Date Format", e})
			return
		}
    const results = await Operation_Endpoints.getOperationsRange(start, end)
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

app.get('/api/operations',auth.login, async (req, res)=>{
  try{
		const responsable = req.username
    const results = await Operation_Endpoints.getOperations(responsable)
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

app.post('/api/operations',auth.login, async (req, res)=>{
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

app.patch('/api/operations/approve',auth.login, async (req, res)=>{
  const { operation_approval } = req.body
	const {date} = operation_approval

	if (!validateDateTime(date)){
		res.status(400).json({success: false, error: "Invalid Date Format", e})
		return
	}
	const roles = req.roles
	console.log("ROLESSS",roles)
	if (!roles.includes('1')){
		res.status(403).json({error: "Permission Denied"})
		return
	}
  try{
    const results = await Operation_Endpoints.approveOperation(operation_approval)
    res.json(results)
  } catch(err){
    res.status(500).json({error: err})
  }

})

app.patch('/api/operations/made',auth.login, async (req, res)=>{
  try{
    const { operation_results } = req.body
    if (!operation_results){
      res.status(400).json({error: "Bad request"})
    }
		const roles = req.roles
		if (!roles.includes(2)){
			res.status(403).json({error: "Permission Denied"})
		}

    const results = await Operation_Endpoints.madeOperation(operation_results)
    res.json({success: true})
  } catch(err){
    res.status(500).json({error: "Internal Server Error"})
  }
})

//*************************************[/api/notificatios]****************************************

app.post('/api/notifications/send',auth.login, async(req, res)=>{
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

app.get('/api/notifications',auth.login, async (req, res)=>{
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

app.patch('/api/notifications/read',auth.login, async (req, res)=>{
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

app.delete('/api/notifications/delete',auth.login, async (req, res)=>{
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

app.listen(port, ()=> {
 console.log(`Server listening on port ${port}`)
})
