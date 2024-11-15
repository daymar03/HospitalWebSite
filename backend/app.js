const express = require('express')
let doctors = require('./doctors.json')
const path = require('node:path')
const crypto = require('node:crypto')
const z = require('zod')
const port = process.env.PORT ?? 1234
const cors = require('cors')

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(express.json()) //detecta los datos que se le han pasado y los convierte en req.body

const contactSchema = z.object({
  email: z.string().email().optional().default(""),
  phone: z.string().optional().default("")
})

const doctorSchema = z.object({
  name: z.string(),
  usuario: z.string(),
  roles: z.enum(['Director', 'Recepcionista', 'Doctor', 'Administrador']).array(),
  specialty: z.string()
})
//SOLIITUDES GET
app.get('/doctors', (req, res)=>{
  const { speciality } = req.query
  if(speciality){
    const filtDoctors = doctors.filter(
      doctor => doctor.speciality.toLowerCase === speciality.toLowerCase())
      res.json(filtDoctors)
  }else{
  res.json(doctors)}
})

app.get('/doctors/:id', (req, res)=>{
  const { id } = req.params
  const doctor = doctors.find(doctor => doctor.id == id)
  if (doctor) return res.json(doctor)
  res.status(404).end("Not Found")
})

//SOLICITUDES POST
app.post('/doctors', (req, res)=>{
  console.log(req.body)
  const result = doctorSchema.safeParse(req.body)
  console.log(result.error)
  const newDoctor = {
    id : crypto.randomUUID(),
    ...result.data
  }

  doctors.push(newDoctor)
  res.json(doctors)
})

//SOLICITUDES PATCH
//Actualizar un doctor
app.patch('/doctors/:id', (req, res)=>{
  const { id } = req.params
  const doctorIndex = doctors.findIndex(doctor => doctor.id == id)
  if (doctorIndex < 0){return res.status(400).json({message: "bad request"})}
  const changes = doctorSchema.partial().safeParse(req.body)

  const newDoctor = {
    ...doctors[doctorIndex],
    ...changes.data
  }

  doctors[doctorIndex] = newDoctor
  res.json(newDoctor)
})


//SOLICITUDES DELETE
app.delete('/doctors', (req, res)=>{
  const { id } = req.body
  console.log(id)
  doctors = doctors.filter(doctor => doctor.id != id)
  res.json(doctors)
})

app.listen(port, ()=>{
  console.log("Listening on port:", port)
})
