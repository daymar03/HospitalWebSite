import express from 'express'
import User from '../resources/User.js'
import Auth from '../utils/auth.js'
import { createJWT, decryptJWT, validateDateTime } from '../utils/utils.js'
import { passwordSchema, userSchema, patientSchema, operationSchema } from '../utils/zod-schemas.js'

const user = express.Router()
const User_Endpoints = new User()
const auth = new Auth()



user.get('/',auth.login, async (req,res)=>{
  const id = req.query.id
  if(!id){
  try{
    const users = await User_Endpoints.getUsers()
    res.json(users)
  } catch(err){
    console.log(err)
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
    user = validUser.data
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
    const isValidUser = await User_Endpoints.loginUser(password, username)
    console.log("VAAAALID:", isValidUser)
    if (isValidUser.success){
      const expirationTime = Math.floor(Date.now() / 1000) + (120 * 60);
      const jwt = await createJWT({
        "username": username,
        "roles": isValidUser.roles,
        "exp": expirationTime
      })
      res.cookie('session', jwt,{ //testing
        expires: new Date(expirationTime * 1000),
        httpOnly: true
      })
			if (isValidUser.roles === '0'){
				res.redirect('/admin')
			} else{
      res.redirect('/salas')}
    } else {
      res.redirect('/repitlogin')
    }
  }}catch(err){
    console.log(err)
    res.redirect("/repitlogin")
  }
})

user.post('/changepassword',auth.login, async (req, res)=>{
  try {
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
  const hist = await User_Endpoints.changePassword(username, passwords)
  if (hist.success){
    res.json(hist)
  } else {
    res.status(500).json(hist)
  }
  } catch(err){
    res.json(err)
  }
})

export default user
