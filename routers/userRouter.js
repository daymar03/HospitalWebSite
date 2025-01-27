import express from 'express'
import User from '../resources/User.js'
import Auth from '../utils/auth.js'
import { createJWT, decryptJWT, validateDateTime } from '../utils/utils.js'
import { passwordSchema, userSchema, patientSchema, operationSchema } from '../utils/zod-schemas.js'
import dotenv from 'dotenv'

dotenv.config()

const appPath = process.cwd()
const user = express.Router()
const User_Endpoints = new User()
const auth = new Auth()

user.patch('/update',auth.login, async (req, res) => {
  try {
    const { id, name, username, rol } = req.body;

    if (!id || !name || !username || !rol) {
      res.status(400).json({ success: false, error: "Bad Request" });
      return;
    }

    const result = await User_Endpoints.updateUser({ id, name, username, rol });

    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


user.get('/rol', (req,res) =>{
  if(!req.session) return res.json({success:false})
  res.send({roles: req.roles})
})

user.get('/self', async (req,res, next)=>{
  if (!req.query.id){
  const username = req.username
  try{
    if(!req.session) return res.redirect('/login')
    let user = await User_Endpoints.getUserByUsername(username)
    user[0].username = username
    res.json(user)
  } catch(err){
    console.log(err)
    res.status(500).json(err)
  }} else {
    next()
  }
})


user.get('/',auth.login, async (req,res)=>{
  const id = req.query.id
  if(!id){
  try{
    const limit = req.query.limit ?? 10
    const page = req.query.page ?? 1
    const name = req.query.name ?? ""
    const rol = req.query.rol ?? ""
    const options = {page : parseInt(page) ?? 1, limit: parseInt(limit) ?? 10, name, rol}
    console.log("OPTIONS:", options)
    const users = await User_Endpoints.getUsers(options)
    res.json(users)
    return
  } catch(err){
    console.log("ERRORRR:",err)
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

user.get('/inactive',auth.login, async (req, res)=>{
  try{
    const roles = req.roles
    if (!roles.includes('0')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    const result = await User_Endpoints.getInactiveUsers()
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

//DIRECTOR QUERY
user.get('/bestdoctor',auth.login, async (req, res)=>{
  try{
    const result = await User_Endpoints.getBestDoctor()
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

user.post('/register',auth.login, async (req, res)=>{
  let { user } = req.body
  if(!user){
    res.status(400).json({error: "Bad request"})
    return
  }
  const validUser = userSchema.safeParse(user)

  if(validUser.success){
    console.log("ORIGINAL USERRRRR")
    console.log(user)
    user = validUser.data
    console.log("VALIDATED USERRRRR")
    console.log(user)
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

user.post('/login', async (req, res)=>{
  try {
  const { username, password } = req.body
  console.log(username, password)
  if(!username || !password){
    res.redirect( "/repitlogin")
    return
  } else{
    const isValidUser = await User_Endpoints.loginUser(password, username,req.ip)
		if (isValidUser.status === "blocked"){
			res.status(403).render(`${appPath}/templates/blocked.ejs`, {username})
			return
		}
    if (isValidUser.success){
      const expirationTimeAccess = Math.floor(Date.now() / 1000) + (60 * 15); //An hour
      const expirationTimeRefresh = Math.floor(Date.now() / 1000) + (120 * 60 * 24 * 7); //7 days
      const jwt = await createJWT({
        "username": username,
        "roles": isValidUser.roles,
        "exp": expirationTimeAccess
      })
      res.cookie('access_token', jwt,{ //testing
        expires: new Date(expirationTimeAccess * 1000),
        httpOnly: false // cambiar luego
      })
      const refresh_jwt = await createJWT({
				"refresh":true,
        "username": username,
        "roles": isValidUser.roles,
        "exp": expirationTimeRefresh
      })
      res.cookie('refresh_token', refresh_jwt,{ //testing
        expires: new Date(expirationTimeRefresh * 1000),
        httpOnly: true
      })

			if (isValidUser.roles === '0'){
				res.redirect('/admin')
			} else{
      res.redirect('/profile')}
    } else {
      res.redirect('/repitlogin')
    }
  }}catch(err){
    console.log("EEEEEER",err)
    res.redirect("/repitlogin")
  }
})

user.post('/logout', async (req, res)=>{
  try {
	if(!req.session){
		console.log("NO TIENE SECCION")
		res.redirect('/login')
		return
	}
	console.log("ENTRO EN LOGOUT")
  const username = req.username
  const logoutTime = Math.floor(Date.now() / 1000);

	const result = await User_Endpoints.logoutUser(username, logoutTime)
	if(result.success){
		res.clearCookie('access_token')
		res.clearCookie('refresh_token').redirect('/login')
	} else {
		res.json({success:false, error:"Something Went Wrong"})
	}

  }catch(err){
    console.log(err)
    res.status(500).json({success: false, error: "Internal Server Error"})
  }
})


user.post('/changepassword', async (req, res)=>{
  try {
    if(!req.session) res.redirect('/login')
  const username = req.username
  const { lastPassword, password, repitPassword } = req.body
  console.log(username, lastPassword)

  if (password !== repitPassword){
    res.status(400).json({success:false, error:"La nueva contraseña no coincide."})
    return
  }

  const passwords = {lastPassword, password}
  try {
    passwordSchema.parse(password);
  } catch (e) {
    res.status(400).json({success:false, error:"La contraseña debe tener 24 caracteres, ademas debe contener: Mayúsculas, Minúsculas, Números, Letras, Simbolos"})
    return
  }
  const hist = await User_Endpoints.changePassword(username, passwords,req.ip)
  if (hist.success){
    res.json(hist)
  } else {
    res.status(500).json(hist)
  }
  } catch(err){
    res.json(err)
  }
})

user.delete('/delete', async (req, res)=>{
  try{
    const {user_id} = req.body
    if (!user_id){
      res.status(400).json({success: false, error: "Bad Request"})
    }else {
      const result = await User_Endpoints.deleteUser(user_id)
      if(result.success){
        res.json({success: true})
        return
      }else{
        res.status(500).json({success: false, error: "Internal Server Error"})
      }
    }
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

user.get('/search', async (req, res)=>{
  try{
    const {name} = req.query
    if (!name) {
      res.status(400).json({success: false, error: "Bad Request"})
    }else{
      const resp = await User_Endpoints.searchUsersByName
      if (resp.success){
        return res.json(resp.results)
      }else{
        res.status(500).json({success: false, error: "Something Went Wrong"})
      }
    }
  }catch(err){
    console.log(err)
    res.status(500).json({success: false, error: "Something Went Wrong"})
  }
})


export default user
