import express from 'express'
import cors from 'cors'
import z from 'zod'
import Patient from './Patient.js'
import User from './User.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import cookieParser from 'cookie-parser'

const userSchema = z.object({
  name: z.string(),
  departament: z.number().int().positive().min(1).max(4),
  roles: z.number().int().positive().min(1).max(3)
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

const Patient_Endpoints = new Patient()
const User_Endpoints = new User()
const app = express()
const port = 3000
const adminRegex = /^\/admin(\/.*)?$/;

app.use(cors())
app.use(express.json())
app.use(cookieParser())

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
app.use('/informacion', express.static(path.join('./../../static/informacion/', 'informacion')));
app.use('/ingresarPaciente', express.static(path.join('./../../static/', 'ingresarPaciente')));
app.use('/login', express.static(path.join('./../../static/', 'login')));
app.use('/notificaciones', express.static(path.join('./../../static/', 'notificaciones')));
app.use('/salas', express.static(path.join('./../../static/', 'salas')));

app.post('/user/register', async (req, res)=>{
  const { user } = req.body

  const validUser = userSchema.safeParse(user)

  if(validUser){
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

/*
     -H "Content-Type: application/json" \
     -d '{
           "patient": {
             "bed": 402,
             "dni": "rffddfdo9886",
             "name": "Daymar Guerero",
             "age": 21,
             "weight": 75,
             "height": 180,
             "phoneNumber": "123-456-7890",
             "sex": "M",
             "consultationReasons": 1, "allergies": ["Guanabana", "Pera"], "preconditions": ["Ser un Tanque"], "medications":["ad", "joya"]
           }
         }'
*/

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
