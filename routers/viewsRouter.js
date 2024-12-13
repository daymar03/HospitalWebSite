import express from 'express'
import Auth from '../utils/auth.js'
import dotenv from 'dotenv'

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
