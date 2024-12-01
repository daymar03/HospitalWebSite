import express from 'express'
import cors from 'cors'
import z from 'zod'
import Patient from './Patient.js'

const patientSchema = z.object({
  name: z.string(),
  age: z.number().int().positive().max(150),
})

const Patient_Endpoints = new Patient()
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


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

app.get('/patients',async (req,res)=>{
  const options= req.query;
  // by id
  if(options.id){
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
curl -X POST http://localhost:8001/patients/create \
     -H "Content-Type: application/json" \
     -d '{
           "patient": {
             "bed": 204,
             "dni": "23445678A",
             "name": "john Doe",
             "age": 30,
             "weight": 70,
             "height": 175,
             "phoneNumber": "123-456-7890",
             "sex": "M",
             "consultationReasons": 1
           }
         }'
*/

app.post('/patients/create', async (req,res)=>{
  const { patient } = req.body
  try {
    const insertResult = await Patient_Endpoints.CreatePatient(patient)
    res.json(insertResult)
  } catch(err){
    res.status(500).json(err)
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


