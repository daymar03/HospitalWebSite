import express from 'express'
import Auth from '../utils/auth.js'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const roles = ["Admin", "Director", "Doctor", "Enfermera/o", "Recepcionista"]

dotenv.config()
const appPath = process.cwd()
const auth = new Auth()
const router = express.Router()

router.get('/', async (req, res, next)=>{
	if(!req.session){
		res.redirect('/login')
		return
	}else{
  	next()
	}
})

router.get('/profile', auth.login, (req, res)=>{
  res.sendFile(`${appPath}/plantilla/profile.html`)
})

router.get('/',auth.login, (req,res)=>{
	if(req.roles.includes('0')){
		res.redirect('/admin')
		return
	} else if(req.roles.includes('1')){
		res.redirect('/director')
		return
	} else {
		res.redirect('/salas')
	}
})

router.get('/login', async (req, res)=>{
	if (!req.session){
  	res.sendFile(`${appPath}/templates/login.html`)
	} else {
		res.redirect('/')
	}
})

router.get('/repitlogin', async (req, res)=>{
  res.sendFile(`${appPath}/templates/repitlogin.html`)
})

router.get('/salas',auth.login, async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/salas.html`, 'utf8')
})

router.get('/informacion',auth.login, async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/informacion.html`, 'utf8')
})

router.get('/director', auth.login, async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/director.html`, 'utf8')
})


router.get('/admin', async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/admin.html`, 'utf8')
})

router.get('/operaciones', auth.login, (req, res)=>{
  res.sendFile(`${appPath}/plantilla/operations.html`)
})

router.get('/notificaciones',auth.login, async (req, res)=>{
		const content = fs.readFileSync(`${appPath}/plantilla/notificaciones.html`, 'utf8')
		if (req.roles.includes('1') || req.roles.includes('2')){
  	res.render(`${appPath}/plantilla/index.ejs`, {titulo:titulos.notificaciones, contenido:content, link:nav.doctor, username:req.username, rol:roles[req.roles[0]],css:"notificaciones", js:javs.notificaciones})
		return
	} else if (req.roles.includes('3')){
		res.render(`${appPath}/plantilla/index.ejs`, {titulo:titulos.ingresar, contenido:content, link:nav.nurse, username:req.username, rol:roles[req.roles[0]],css:"notificaciones", js:javs.notificaciones})
	} else if (req.roles.includes('4')){
		res.render(`${appPath}/plantilla/index.ejs`, {titulo:titulos.ingresar, contenido:content, link:nav.recepcionist, username:req.username, rol:roles[req.roles[0]],css:"notificaciones", js:javs.notificaciones})
	} else{
		next()
	}
})

router.get('/permissionDenied',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/permissionDenied.html`)
})

router.get('/changepassword',auth.login, async (req, res)=>{
  res.sendFile(`${appPath}/templates/changepassword.html`)
})

export default router
