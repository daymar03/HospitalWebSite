import Notification from '../resources/Notifications.js'
import Auth from '../utils/auth.js'
import express from 'express'

const notification = express.Router()
const auth = new Auth()
const Notification_Endpoints = new Notification()

notification.post('/send', auth.login, async(req, res)=>{
  try{
    const { notification } = req.body
    const send = await Notification_Endpoints.sendNotification(notification)
    if(send.success){
      res.status(201).json(send)
    } else {
      res.status(500).json({success: false})
    }
  }catch(err){
    console.log(err)
    res.json(err)
  }
})

notification.get('/', auth.login, async (req, res)=>{
try{
  const username = req.username
  if(!username){
    res.status(400).json({error: "Bad Request"})
  }
  const notifications = await Notification_Endpoints.getNotifications(username)
  if(notifications){
    res.json(notifications)
  }else{
    res.status(500).json({error: "Internal Server Error"})
  }
}catch(err){
  res.status(500).json(err)
}
})


// for admin
notification.get('/get', auth.login, async (req, res)=>{
try{
  const username = req.query.username || null
  if(!username){
    res.status(400).json({error: "Bad Request"})
  }
  const notifications = await Notification_Endpoints.getNotifications(username)
  if(notifications){
    res.json(notifications)
  }else{
    res.status(500).json({error: "Internal Server Error"})
  }
}catch(err){
  res.status(500).json(err)
}
})



notification.patch('/read', auth.login, async (req, res)=>{
  try{
    const { notification_id } = req.body
    const read = await Notification_Endpoints.readNotification(notification_id)
    if (read.success){
      res.json(read)
    } else{
      res.json({success: false})
    }
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

notification.delete('/delete', auth.login, async (req, res)=>{
  try{
    console.log(req.body)
    const {notification_id} = req.body
    console.log("NOOOOOTIIII", notification_id, req.body)
    const deleted = await Notification_Endpoints.deleteNotification(notification_id, req.username)
    if (deleted.success){
      res.json(deleted)
    }else{
      res.status(500).json({deleted})
    }
  }catch(err){
    console.log(err)
    res.status(500).json({success: false, error: "Internal Server Error"})
  }
})

export default notification
