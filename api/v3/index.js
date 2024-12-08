import express from 'express'
import cors from 'cors'
import z from 'zod'
import Patient from './Patient.js'
import User from './User.js'
import Operation from './Operation.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import cookieParser from 'cookie-parser'

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

const app = express()
const port = 3000
const adminRegex = /^\/admin(\/.*)?$/;

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
app.use('/admin', express.static(path.join('./../../static/', 'admin')));
/*app.use('/assets', express.static(path.join('./../../', 'assets')));*/
app.use('/director', express.static(path.join('./../../static/', 'director')));
app.use('/informacion', express.static(path.join('./../../static/', 'informacion')));
app.use('/ingresarPaciente', express.static(path.join('./../../static/', 'ingresarPaciente')));
app.use('/login', express.static(path.join('./../../static/', 'login')));
app.use('/notificaciones', express.static(path.join('./../../static/', 'notificaciones')));
app.use('/salas', express.static(path.join('./../../static/', 'salas')));


app.post('/api/users/register', async (req, res)=>{
  let { user } = req.body
  if(!user){
    res.status(400).json({error: "Bad request"})
    return
  }
  const validUser = userSchema.safeParse(user)

  if(validUser.success){
    console.log(validUser)
    userred = validUser.data
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
    res.status(400).json({error: "Bad request"})
    return
  } else{
    const isValidUser = await User_Endpoints.loginUser(password, username)
    console.log(isValidUser)
    if (isValidUser.success){
      res.cookie('session', 'sessionCookie',{ //testing
        expires: new Date(Date.now() + 900000),
        httpOnly: true
      })
      res.redirect(301, '/salas')
    } else {
      res.json({"status": isValidUser.success, message: isValidUser.message})
    }
  }}catch(err){
    res.status(500).json()
  }
})

app.get('/api/users', async (req, res)=>{
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


app.post('/api/users/changepassword', async (req, res)=>{
  try {
  const { username, password } = req.body
  const hist = await User_Endpoints.changePassword(username, password)
  res.json({resp: hist})
  } catch(err){
    res.json({error: err})
  }
})


app.get('/api/operations', async (req, res)=>{
  try{
    const results = await Operation_Endpoints.getOperations()
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

app.post('/api/operations', async (req, res)=>{
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

app.patch('/api/operations/approve', async (req, res)=>{
  const { operation_approval } = req.body
  try{
    const results = await Operation_Endpoints.approveOperation(operation_approval)
    res.json(results)
  } catch(err){
    res.status(500).json({error: err})
  }

})

app.patch('/api/operations/made', async (req, res)=>{
  try{
    const { operation_results } = req.body
    console.log(operation_results)
    if (!operation_results){
      res.status(400).json({error: "Bad request"})
    }
    const results = await Operation_Endpoints.madeOperation(operation_results)
    res.json(results)
  } catch(err){
    res.json(err)
  }
})

app.get('/patients',async (req,res)=>{
  const options= req.query;
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

app.get('/patients/all',async (_,res)=>{
  try {
   const patients = await Patient_Endpoints.GET_Patients_All();
   res.json(patients);
  } catch(err) {
    res.status(500).json({error: 'Error fetching patients'})
  }
})


app.post('/patients/create', async (req,res)=>{
  const { patient } = req.body
  console.log(patient)
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

app.patch('/patients/update', async (req, res) => {
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



app.delete('/patients/delete', async(req,res)=>{
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
