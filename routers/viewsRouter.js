import express from 'express'
import Auth from '../utils/auth.js'

const auth = new Auth()
const router = express.Router()

router.get('/',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/salas.html`)
})

router.get('/login', async (req, res)=>{
  res.sendFile(`${appPath}/templates/login.html`)
})

router.get('/repitlogin', async (req, res)=>{
  res.sendFile(`${appPath}/templates/repitlogin.html`)
})

router.get('/salas',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/salas.html`)
})

router.get('/informacion',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/informacion.html`)
})

router.get('/ingresar',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/ingresar.html`)
})

router.get('/notificaciones',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/notificaciones.html`)
})

router.get('/admin',auth.login, async (req, res)=>{
  res.render(`${appPath}/templates/admin.ejs`,{name:req.username})
})

router.get('/permissionDenied',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/permissionDenied.html`)
})

router.get('/changepassword',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/changepassword.html`)
})

export default router
