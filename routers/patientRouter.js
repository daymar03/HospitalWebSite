import express from 'express'
import Auth from '../utils/auth.js'
import Patient from '../resources/Patient.js'
import { patientSchema} from '../utils/zod-schemas.js'

const Patient_Endpoints = new Patient()
const patient = express.Router()
const auth = new Auth()

patient.use(auth.login)

//DIRECTOR QUERY (Returns the Ocupation percent by room)
patient.get('/ocupation', async (req, res)=>{
  try {
    const roles = req.roles
    if (!roles.includes('1') && !roles.includes('0')){
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

patient.get('/all', async (req, res)=>{
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

patient.get('/', async (req,res)=>{
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

patient.post('/create', async (req,res)=>{
  const { patient } = req.body
  const result = patientSchema.safeParse(patient)
  if (result.success) {
  try {
    const insertResult = await Patient_Endpoints.CreatePatient(patient)
    res.json({success:true})
  } catch(err){
    res.status(500).json({success:false, error: "Internal Server Error"})
  }
  } else {console.log(result.error);res.status(400).json({success:false, error:"Bad Request"})}
})


patient.patch('/update', async (req, res)=>{
  const { id, bed } = req.query;
  console.log("BODYYYYYY")
  console.log(req.body)
  // search by id or bed
  const { age, weight, height, phoneNumber, name, risk_patient,
          medications, allergies, bed_body } = req.body;
  if (!id && !bed) {
    return res.status(400).json({ success: false, message: "Bad request: id or bed is required" })
  }
  const fieldsToUpdate = {};
  if (age !== undefined) fieldsToUpdate.age = age;
  if (weight !== undefined) fieldsToUpdate.weight = weight;
  if (height !== undefined) fieldsToUpdate.height = height;
  if (phoneNumber !== undefined) fieldsToUpdate.phoneNumber = phoneNumber;
  if (risk_patient !== undefined) fieldsToUpdate.risk_patient = risk_patient;
  if (name !== undefined) fieldsToUpdate.name = name;
  if (bed_body !== undefined) fieldsToUpdate.bed = bed_body;
  try {
    const results = await Patient_Endpoints.PATCH_Patient(fieldsToUpdate,id,bed, medications, allergies)
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

patient.delete('/delete', async (req,res)=>{
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

export default patient
