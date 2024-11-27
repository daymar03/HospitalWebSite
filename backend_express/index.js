import express from 'express'

import Patient from './Patient.js'

const Patient_Endpoints = new Patient()
const app = express()
const port = 80

app.use(express.json())
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


app.listen(port, ()=> {
 console.log(`Server listening on port ${port}`)
})


