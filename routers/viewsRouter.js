import express from 'express'
import Auth from '../utils/auth.js'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const roles = ["Admin", "Director", "Doctor", "Enfermera/o", "Recepcionista"]

const links = {
	salas: `<li><a href="/salas"><i class="fas fa-procedures"></i>Informacion de Salas</a></li>`,
	paciente: `<li><a href="/informacion"><i class="fas fa-notes-medical"></i>Información del Paciente</a></li>`,
	ingreso: `<li><a href="/ingresar"><i class="fas fa-user-plus"></i>Ingresar Pacientes</a></li>`,
	notificaciones: `<li><a href="/notificaciones"><i class="fas fa-bell"></i>Notificaciones</a></li>`
}

const nav = {
	admin: links.notificaciones,
	doctor: links.salas+links.paciente+links.ingreso+links.notificaciones,
	nurse: links.salas+links.paciente+links.notificaciones,
	recepcionist: links.salas+links.paciente+links.ingreso+links.notificaciones
}

const javs = {
	salas: `<script src="/js/script-salas.js"></script>`,
	informacion: `
<script src="/js/script-informacion.js"></script>
<script src="/js/get_by_bed-informacion.js"></script>
<script src="/js/update-informacion.js"></script>
`,
	ingresar: `<script src="/js/script-ingresar.js"></script>`,
	notificaciones: `<script src="/js/script-motoficaciones.js"></script>`
}

const titulos = {
	salas: `<h1 class="topnav-titulo"><i class='fas fa-bed' style='font-size:24px;'></i> Salas </h1>`,
	informacion: `<h1 class="topnav-titulo"><i class='fas fa-bed' style='font-size:24px;'></i> Información </h1>`,
	ingresar: `<h1 class="topnav-titulo"><i class='fas fa-bed' style='font-size:24px;'></i> Ingresar </h1>`,
	notificaciones: `<h1 class="topnav-titulo"><i class='fas fa-bed' style='font-size:24px;'></i> Notificaciones </h1>`
}

dotenv.config()
const appPath = process.env.APP_PATH
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

router.get('/director', async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/director.html`, 'utf8')
})


router.get('/ingresar', async (req, res)=>{
		res.sendFile(`${appPath}/plantilla/ingresar.html`, 'utf8')
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
