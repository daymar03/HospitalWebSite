import { getPool } from '../utils/db.js'
import { compareDates } from '../utils/utils.js'
import moment from 'moment'

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

//Comprobar si el responsable es un username valido y si es doctor:
				const getRespQuery = "SELECT r.name as rol from User u JOIN User_Rol ur ON u.id = ur.user_id JOIN Rol r ON ur.rol_id = r.id WHERE u.username = ?"
				const getRespQueryResult = await this.pool.query(getRespQuery, [responsable])
				if (getRespQueryResult[0].length === 0){
					return reject({success: false, error: "Invalid Username"})
				} else if ( getRespQueryResult[0][0].rol !== "Doctor"){
					return reject({success: false, error: `Invalid Responsable Role`})
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
          date //DATE FORMAT YYYY-MM-DD HH:MM:SS
        } = operation_approval

        if (!id || !date){
          reject({error: "Bad Request"})
          return
        }

//Comprobando si la operación ya está aprobada:
          let selectQuery = 'SELECT approved, request_date as date FROM Operation WHERE id = ?'
          let selectQueryResults = await this.pool.query(selectQuery, [id])
          if (selectQueryResults[0][0].approved){
            reject({error: "The Operation is already approved"})
            return
          }
//Comprobar si la fecha planificada es mayor  que la fecha de request:
				let dateFromDb = selectQueryResults[0][0].date;
				let formattedDate = moment(dateFromDb).format('YYYY-MM-DD HH:mm:ss');
				if(!compareDates(formattedDate, date)){
					return reject({success:false, error: "Bad date"})
				}

//Comprobar si ya están las 5 operaciones de riesgo en el dia:
				const riskOperatios = await this.pool.query("SELECT COUNT(*) as o FROM Operation WHERE priority = 0 and DATE(scheduled_date) = DATE(?)", [date])
				const cant = riskOperatios[0][0].o
				if(cant == 5){
					return reject({success:false, error: "Today is already full of risks operations"})
				}
//Actualizar la Operacion si todo esta correcto:
        const updateOperationQuery = "UPDATE Operation SET scheduled_date = ?, approved = true WHERE id = ?"
        let updateResults = await this.pool.query(updateOperationQuery, [date, id])
        resolve({succes: "true"})
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
//************************************************[GET RISK OPERATIONS POSITIVES]**********************************************************

async getRiskOperations(date = ""){
	return new Promise(async (resolve, reject)=>{
		try{
			let results
			if (date !== ""){
				const getRiskOperations = "SELECT COUNT(o.id) AS total_operaciones_riesgo, SUM(CASE WHEN o.results = 'positive' THEN 1 ELSE 0 END) AS operaciones_satisfactorias, (SUM(CASE WHEN o.results = 'positive' THEN 1 ELSE 0 END) / COUNT(o.id)) * 100 AS porcentaje_satisfactorias FROM Operation o JOIN Patient p ON o.patient_id = p.id WHERE p.risk_patient = true AND MONTH(o.request_date) = ? AND YEAR(o.request_date) = ?"
				results = await this.pool.query(getRiskOperations,[date.month, date.year])
			}else{
				console.log("DATE === {}", date)
				const getRiskOperations = "SELECT COUNT(o.id) AS total_operaciones_riesgo, SUM(CASE WHEN o.results = 'positive' THEN 1 ELSE 0 END) AS operaciones_satisfactorias, (SUM(CASE WHEN o.results = 'positive' THEN 1 ELSE 0 END) / COUNT(o.id)) * 100 AS porcentaje_satisfactorias FROM Operation o JOIN Patient p ON o.patient_id = p.id WHERE p.risk_patient = true"
				results = await this.pool.query(getRiskOperations)
			}
			if(results[0].length === 0){
				return reject({success: false, error: "There are no done Operations or Something went wrong"})
			} else {
				let total_operaciones_riesgo = results[0][0].total_operaciones_riesgo ?? 0
				let operaciones_satisfactorias = results[0][0].operaciones_satisfactorias ?? 0
				let porcentaje_satisfactorias = results[0][0].porcentaje_satisfactorias ?? 100
				let result = {total_operaciones_riesgo, operaciones_satisfactorias, porcentaje_satisfactorias}
				return resolve({success: true, result})
			}
		}catch(err){
      console.log(err)
			return reject(err)
		}
	})
}


//*************************************************************************************************************************************
//************************************************[GET OPERATIONS OVERDUE]**********************************************************

async getOverdueOperations(){
	return new Promise(async (resolve, reject)=>{
		try{
			const getAll = await this.pool.query("SELECT COUNT(*) as 'all' FROM Operation WHERE made = true;")
			const madeOperations = getAll[0][0].all.length
			const getOperationsQuery = "SELECT COUNT(*) as 'all' FROM Operation WHERE made = true and estimated_duration < real_duration"
			const getOperationsQueryResult = await this.pool.query(getOperationsQuery)
			const overdueOperations = getOperationsQueryResult[0][0].all.length
			if(getOperationsQueryResult[0].length === 0){
				return reject({success: false, error: "There are no done Operations or Something went wrong"})
			} else {
				let results = {total: overdueOperations, percent: (overdueOperations / madeOperations) * 100}
				return resolve({success: true, results})
			}
		}catch(err){
      console.log(err)
			return reject(err)
		}
	})
}


//*************************************************************************************************************************************
//************************************************[GET DAY'S OPERATIONS]**********************************************************
async getOperationsByDate(date) { //YYYY-MM-DD
  return new Promise(async (resolve, reject) => {
    try {
      const getAll = await this.pool.query(`
        SELECT o.id, priority, description, u.name, scheduled_date
        FROM Operation o
        JOIN User u ON o.responsable = u.username
        WHERE DATE(scheduled_date) = ?
      `, [date]);

      if (getAll[0].length === 0) {
        return reject({ success: false, error: "There are no Operations for the specified date or something went wrong" });
      } else {
        let results = getAll[0];
        return resolve({ success: true, results });
      }
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}


//*************************************************************************************************************************************
//************************************************[GET DAY'S OPERATIONS]**********************************************************

async getTodayOperations(){
	return new Promise(async (resolve, reject)=>{
		try{
			const getAll = await this.pool.query("SELECT o.id, priority, description, u.name, scheduled_date FROM Operation o JOIN User u ON o.responsable = u.username  WHERE DATE(scheduled_date) = CURDATE();")
			if(getAll[0].length === 0){
				return reject({success: false, error: "There are no Operations for Today or Something went wrong"})
			} else {
				let results = getAll[0]
				return resolve({success: true, results})
			}
		}catch(err){
      console.log(err)
			return reject(err)
		}
	})
}


//*************************************************************************************************************************************
//************************************************[GET OPERATIONS IN A RANGE]**********************************************************

async getOperationsRange(start, end){ //DATE FORMAT: YYYY-MM-DD HH:MM:SS
	return new Promise(async (resolve, reject)=>{
		try{
			const getOperationsQuery = "SELECT p.name FROM Operation o JOIN Patient p ON o.patient_id = p.id WHERE request_date BETWEEN ? AND ?"
			const getOperationsQueryResult = await this.pool.query(getOperationsQuery, [start, end])
			if(getOperationsQueryResult[0].length === 0){
				return reject({success: false, error: "Something went wrong"})
			} else {
				let results = getOperationsQueryResult[0]
				return resolve({success: true, results})
			}
		}catch(err){
      console.log(err)
			return reject(err)
		}
	})
}


//*************************************************************************************************************************************
//************************************************[GET OPERATIONS]*********************************************************************

  async getOperations(responsable){
    return new Promise( async(resolve, reject)=>{
      try {
        const selectQuery = "SELECT * FROM Operation WHERE responsable = ?"
        const selectQueryResults = await this.pool.query(selectQuery, [responsable])
				if (selectQueryResults[0].length === 0){
					return reject({success: false, error: "No Available Operations"})
				}
        return resolve(selectQueryResults[0])
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
