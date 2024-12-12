import express from 'express'
import Operation from '../resources/Operation.js'
import Auth from '../utils/auth.js'
import { operationSchema } from '../utils/zod-schemas.js'

const operation = express.Router()
const Operation_Endpoints = new Operation()
const auth = new Auth()

operation.use(auth.login)

operation.get('/overdue', async (req, res)=>{
  try{
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    const results = await Operation_Endpoints.getOverdueOperations()
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

//DIRECTOR QUERY
operation.get('/day', async (req, res)=>{
  try{
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    const date = req.query.date
    if (!date){
      const results = await Operation_Endpoints.getTodayOperations()
      res.json(results)
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(date)) {
          res.status(400).json({ success: false, error: "Invalid date format. Please use YYYY-MM-DD." });
        }
      const results = await Operation_Endpoints.getOperationsByDate(date)
      res.json(results)
    }
  }catch (err){
    res.status(500).json(err)
  }
})

//DIRECTOR QUERY
operation.get('/highpriority', async (req, res)=>{
  try{
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    const { month, year } = req.query
    const result = await User_Endpoints.getUrgentsMonth(month, year)
    res.json(result)
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})


//DIRECTOR QUERY
operation.get('/risk', async (req, res)=>{
  try{
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    let date = {}
    const options = req.query
    if(options){
      if(!options.month && !options.year){
      } else {
        if (options.month < 1 || options.month > 12){
          res.status(400).json({error: "Bad Request"})
        } else {
          date.month = options.month
          date.year = options.year
          const results = await Operation_Endpoints.getRiskOperations(date)
          res.json(results)
          return
        }
      }
    }
    console.log("DATE",date)
    const results = await Operation_Endpoints.getRiskOperations()
    res.json(results)
  }catch (err){
    console.log(err)
    res.status(500).json({error:err})
  }
})

//DIRECTOR QUERY
operation.get('/range', async (req, res)=>{
  try{
    const { start, end } = req.query
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
      return
    }
    if (!validateDateTime(start) || !validateDateTime(end)){
      res.status(400).json({success: false, error: "Invalid Date Format", e})
      return
    }
    const results = await Operation_Endpoints.getOperationsRange(start, end)
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

operation.get('/', async (req, res)=>{
  try{
    const responsable = req.username
    const results = await Operation_Endpoints.getOperations(responsable)
    res.json(results)
  }catch (err){
    res.status(500).json(err)
  }
})

operation.post('/', async (req, res)=>{
  const { operation } = req.body
  operation.responsable = req.username
  if (operation){
    try {
      let insertResults = await Operation_Endpoints.requestOperation(operation)
      res.status(200).json(insertResults)
    } catch (err){
      res.status(500).json(err)
    }
  } else{
    res.status(404).json({error: "Bad Request"})
    console.log("Bad operation request")
  }
})

operation.patch('/approve', async (req, res)=>{
  const { operation_approval } = req.body
  const {date} = operation_approval

  if (!validateDateTime(date)){
    res.status(400).json({success: false, error: "Invalid Date Format", e})
    return
  }
  const roles = req.roles
  console.log("ROLESSS",roles)
  if (!roles.includes('1')){
    res.status(403).json({error: "Permission Denied"})
    return
  }
  try{
    const results = await Operation_Endpoints.operation.oveOperation(operation_approval)
    res.json(results)
  } catch(err){
    console.log(err)
    res.status(500).json({error: err})
  }

})

operation.patch('/made', async (req, res)=>{
  try{
    const { operation_results } = req.body
    if (!operation_results){
      res.status(400).json({error: "Bad request"})
    }
    const roles = req.roles
    if (!roles.includes('1')){
      res.status(403).json({error: "Permission Denied"})
    }

    const results = await Operation_Endpoints.madeOperation(operation_results)
    res.json({success: true})
  } catch(err){
    res.status(500).json({error: "Internal Server Error"})
  }
})

export default operation
