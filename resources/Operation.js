import { getPool } from '../utils/db.js'

class Operation {
  constructor(){
    this.pool = getPool();
  }

  async requestOperation(operation){
    return new Promise(async (resolve, reject)=>{
      try {
        const {
          priority,
          estimated_duration,
          description,
          responsable,
          patient_bed
        } = operation

//Validacion de entrada:
        if(typeof(priority) == undefined || !estimated_duration || !description || !responsable || !patient_bed){
          reject({error: "Bad operation request"})
          console.log({error: "Bad operation request"})
          return
        }
//Recuperar id de usuario por cama
        let selectQuery = `SELECT id FROM Patient WHERE bed = ?`
        let patient_id
        let patientResult = await this.pool.query(selectQuery, [patient_bed])
        if (patientResult[0].length == 0){
          reject({error: "Patient not found"})
          return
        } else {
          patient_id = patientResult[0][0].id
        }
        if (!patient_id){
          reject({error: "Failed to request operation"})
          return
        }

//Insertar Solicitud de operacion:
    let insertQuery = `
        INSERT INTO Operation (priority, estimated_duration, description, responsable, patient_id)
        VALUES (?, ?, ?, ?, ?)
        `
        let insertResults = await this.pool.query(insertQuery, [
          priority,
          estimated_duration,
          description,
          responsable,
          patient_id
        ])
        if (insertResults[0].affectedRows === 0){
          reject({error: "Error Inserting Operation"})
          return
        } else {
          resolve ({succes: "true", id: insertResults.insertId})
        }
      } catch (err) {
        console.log(err)
        reject({error: err})
      }
    })
  }

  async approveOperation(operation_approval){
    return new Promise(async (resolve, reject)=>{
      try{
        const {
          id,
          date
        } = operation_approval

        if (!id || !date){
          reject({error: "Bad Request"})
          return
        }
//Comprobando si la operación ya está aprobada
          let selectQuery = 'SELECT approved FROM Operation WHERE id = ?'
          let selectQueryResults = await this.pool.query(selectQuery, [id])
          if (selectQueryResults[0][0].approved){
            reject({error: "The Operation is already approved"})
            return
          }

        const updateOperationQuery = "UPDATE Operation SET scheduled_date = ?, approved = true WHERE id = ?"
        let updateResults = await this.pool.query(updateOperationQuery, [date, id])
        console.log(updateResults)
        resolve({succes: "true", results: updateResults[0]})
      }catch(err){
        reject({error: err})
        return
      }
    })
  }

  async madeOperation(operation_results) {
    return new Promise(async (resolve, reject)=>{
      try {
        const {
          id,
          real_duration,
          results
        } = operation_results

//Validacion de entrada
        if (!id || !real_duration || !results){
          console.log("bad request")
          reject({error: "Bad request"})
          return
        } else {
//Comprobando si la operación ya está aprobada
          let selectQuery = 'SELECT approved FROM Operation WHERE id = ?'
          let selectQueryResults = await this.pool.query(selectQuery, [id])
          if (!selectQueryResults[0][0].approved){
            reject({error: "The Operation is not approved"})
            return
          }

//Comprobando si la operacion ya fue realizada
          selectQuery = 'SELECT made FROM Operation WHERE id = ?'
          selectQueryResults = await this.pool.query(selectQuery, [id])
          if (selectQueryResults[0][0].made){
            reject({error: "The Operation is already made"})
            return
          }

//Insertando los resultados
          const updateOperationQuery = "UPDATE Operation SET results = ?, made = true, real_duration = ? WHERE id = ?"
          let updateResults = await this.pool.query(updateOperationQuery, [results, real_duration, id])
          console.log(updateResults)
          resolve({succes: "true", results: updateResults[0]})
          }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//************************************************[GET OPERATIONS]*********************************************************************

  async getOperations(){
    return new Promise( async(resolve, reject)=>{
      try {
        const selectQuery = "SELECT * FROM Operation"
        const selectQueryResults = await this.pool.query(selectQuery)
        resolve(selectQueryResults[0])
      } catch(err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//************************************************[GET REQUEST OPERATIONS]*********************************************************************

  async getRequestOperations(){
    return new Promise(async (resolve, reject)=>{
      try{
        const selectQuery = "SELECT * FROM Operation WHERE approved = false"
        const selectQueryResults = await this.pool.query(selectQuery)
        const operations = selectQueryResults[0]
        if (operations.length == 0){
          resolve({"operations":"the are no request operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//************************************************[GET APPROVED OPERATIONS]************************************************************
//**************[0-> APPROVED, 1-> APPROVED & MADE, 2-> APPROVED & NO MADE]************************************************************

  async getApprovedOperations(){
    return new Promise(async (resolve, reject)=>{
      try{
        let operations = []
        //APPROVED
        let selectQuery = "SELECT * FROM Operation WHERE approved = true"
        let selectQueryResults = await this.pool.query(selectQuery)
        operations.push(selectQueryResults[0])
        //APPROVED & MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = true"
        selectQueryResults = await this.pool.query(selectQuery)
        operations.push(selectQueryResults[0])
        //APPROVED & NO MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = false"
        selectQueryResults = await this.pool.query(selectQuery)
        operations.push(selectQueryResults[0])
        if (operations.length == 0){
          resolve({"operations":"the are no request operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//************************************[GET PATIENT APPROVED OPERATIONS]*********************************************************************
//**************[0-> APPROVED, 1-> APPROVED & MADE, 2-> APPROVED & NO MADE]************************************************************

  async getPatientApprovedOperations(patient_id){
    return new Promise(async (resolve, reject)=>{
      try{
        let operations = []
        //APPROVED
        let selectQuery = "SELECT * FROM Operation WHERE approved = true and patient_id = ?"
        let selectQueryResults = await this.pool.query(selectQuery, [patient_id])
        operations.push(selectQueryResults[0])
        //APPROVED & MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = true and patient_id = ?"
        selectQueryResults = await this.pool.query(selectQuery, [patient_id])
        operations.push(selectQueryResults[0])
        //APPROVED & NO MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = false and patient_id = ?"
        selectQueryResults = await this.pool.query(selectQuery, [patient_id])
        operations.push(selectQueryResults[0])
        if (operations.length == 0){
          resolve({"operations":"the are no request operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }

//*************************************************************************************************************************************
//********************************[GET PATIENT REQUEST OPERATIONS]*********************************************************************

  async getPatientRequestOperations(patient_id){
    return new Promise(async (resolve, reject)=>{
      try{
        const selectQuery = "SELECT * FROM Operation WHERE patient_id = ? and approved = fasle"
        const selectQueryResults = await this.pool.query(selectQuery, [patient_id])
        const operations = selectQueryResults[0]
        if (operations.length == 0){
          resolve({"operations":"the patient has no request operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//*******************************[GET DOCTOR APPROVED OPERATIONS]*********************************************************************

  async getDoctorApprovedOperations(username){
    return new Promise(async (resolve, reject)=>{
      try{
        let operations = []
        //APPROVED
        let selectQuery = "SELECT * FROM Operation WHERE approved = true and responsable = ?"
        let selectQueryResults = await this.pool.query(selectQuery, [username])
        operations.push(selectQueryResults[0])
        //APPROVED & MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = true and responsable = ?"
        selectQueryResults = await this.pool.query(selectQuery, [username])
        operations.push(selectQueryResults[0])
        //APPROVED & NO MADE
        selectQuery = "SELECT * FROM Operation WHERE approved = true and made = false and responsable = ?"
        selectQueryResults = await this.pool.query(selectQuery, [username])
        operations.push(selectQueryResults[0])
        if (operations.length == 0){
          resolve({"operations":"the are no approved operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
//*************************************************************************************************************************************
//********************************[GET DOCTOR REQUEST OPERATIONS]*********************************************************************

  async getDoctorRequestOperations(username){
    return new Promise(async (resolve, reject)=>{
      try{
        const selectQuery = "SELECT * FROM Operation WHERE responsable = ? and approved = fasle"
        const selectQueryResults = await this.pool.query(selectQuery, [username])
        const operations = selectQueryResults[0]
        if (operations.length == 0){
          resolve({"operations":"the patient has no request operations in list"})
        } else {
          resolve(operations)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }

//*************************************************************************************************************************************
//*******************************[GET IF IS A DOCTOR IS AN OPERATION PROPERTY]*********************************************************************

  async isOwner(operation_id, username){
    return new Promise(async (resolve, reject)=>{
      try{
        const selectQuery = "SELECT responsable FROM Operation WHERE id = ?"
        const selectQueryResults = await this.pool.query(selectQuery, [operation_id])
        const responsable = selectQueryResults[0][0].responsable
        if (username == responsable){
          resolve(true)
        } else {
          resolve(false)
        }
      }catch (err){
        reject({error: err})
        return
      }
    })
  }
}

export default Operation
