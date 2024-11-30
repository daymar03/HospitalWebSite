import { getPool } from './db.js'

class Patient {
 constructor(){
  this.pool = getPool()
 }

 async GET_Patients(options = {}) { 
  try{
   const {limit=10, page=1} = options
   const offset = (page - 1) * limit
 
   return new Promise((resolve,reject)=>{
     this.pool.query(
       `SELECT 
            p.id AS patient_id,
            p.createdAt,
            p.bed,
            p.dni,
            p.name,
            p.age,
            p.weight,
            p.height,
            p.phoneNumber,
            p.sex,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates,
            GROUP_CONCAT(DISTINCT cr.reason) AS consultation_reasons
        FROM 
            Patient p
        LEFT JOIN 
            Patient_Allergies pa ON p.id = pa.patient_id
        LEFT JOIN 
            Allergies a ON pa.allergies_id = a.id
        LEFT JOIN 
            Patient_Current_Medications pcm ON p.id = pcm.patient_id
        LEFT JOIN 
            Current_Medications cm ON pcm.current_medications_id = cm.id
        LEFT JOIN 
            Patient_Preconditions pp ON p.id = pp.patient_id
        LEFT JOIN 
            Preconditions pr ON pp.preconditions_id = pr.id
        LEFT JOIN 
            Patient_Entry_Dates ped ON p.id = ped.patient_id
        LEFT JOIN 
            Entry_Dates ed ON ped.entry_dates_id = ed.id
        LEFT JOIN 
            Entry_Dates_Consultation_Reasons edcr ON ed.id = edcr.entry_dates_id
        LEFT JOIN 
            Consultation_Reasons cr ON edcr.consultation_reasons_id = cr.id
        GROUP BY 
            p.id
        LIMIT ${limit} OFFSET ${offset};`
    ,(err,results)=>{
      if(err){
       return reject(err);
      }
      return resolve(results);
     })
   })
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  } 
 }

 async GET_Patients_All() { 
  try{
 
   return new Promise((resolve,reject)=>{
     this.pool.query(
       `SELECT 
            p.id AS patient_id,
            p.createdAt,
            p.bed,
            p.dni,
            p.name,
            p.age,
            p.weight,
            p.height,
            p.phoneNumber,
            p.sex,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates,
            GROUP_CONCAT(DISTINCT cr.reason) AS consultation_reasons
        FROM 
            Patient p
        LEFT JOIN 
            Patient_Allergies pa ON p.id = pa.patient_id
        LEFT JOIN 
            Allergies a ON pa.allergies_id = a.id
        LEFT JOIN 
            Patient_Current_Medications pcm ON p.id = pcm.patient_id
        LEFT JOIN 
            Current_Medications cm ON pcm.current_medications_id = cm.id
        LEFT JOIN 
            Patient_Preconditions pp ON p.id = pp.patient_id
        LEFT JOIN 
            Preconditions pr ON pp.preconditions_id = pr.id
        LEFT JOIN 
            Patient_Entry_Dates ped ON p.id = ped.patient_id
        LEFT JOIN 
            Entry_Dates ed ON ped.entry_dates_id = ed.id
        LEFT JOIN 
            Entry_Dates_Consultation_Reasons edcr ON ed.id = edcr.entry_dates_id
        LEFT JOIN 
            Consultation_Reasons cr ON edcr.consultation_reasons_id = cr.id
        GROUP BY 
            p.id;`
    ,(err,results)=>{
      if(err){
       return reject(err);
      }
      return resolve(results);
     })
   })
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  } 
 }
 async GET_Patients_By_Id(id) { 
  try{
 
   return new Promise((resolve,reject)=>{
     this.pool.query(
       `SELECT 
            p.id AS patient_id,
            p.createdAt,
            p.bed,
            p.dni,
            p.name,
            p.age,
            p.weight,
            p.height,
            p.phoneNumber,
            p.sex,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates,
            GROUP_CONCAT(DISTINCT cr.reason) AS consultation_reasons
        FROM 
            Patient p
        LEFT JOIN 
            Patient_Allergies pa ON p.id = pa.patient_id
        LEFT JOIN 
            Allergies a ON pa.allergies_id = a.id
        LEFT JOIN 
            Patient_Current_Medications pcm ON p.id = pcm.patient_id
        LEFT JOIN 
            Current_Medications cm ON pcm.current_medications_id = cm.id
        LEFT JOIN 
            Patient_Preconditions pp ON p.id = pp.patient_id
        LEFT JOIN 
            Preconditions pr ON pp.preconditions_id = pr.id
        LEFT JOIN 
            Patient_Entry_Dates ped ON p.id = ped.patient_id
        LEFT JOIN 
            Entry_Dates ed ON ped.entry_dates_id = ed.id
        LEFT JOIN 
            Entry_Dates_Consultation_Reasons edcr ON ed.id = edcr.entry_dates_id
        LEFT JOIN 
            Consultation_Reasons cr ON edcr.consultation_reasons_id = cr.id
        WHERE 
            p.id = ?
        GROUP BY 
            p.id;`
    ,[id],(err,results)=>{
      if(err){
       return reject(err);
      }
      return resolve(results);
     })
   })
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  } 
 }
 async GET_Patients_By_Bed_Number(bed) { 
  try{
 
   return new Promise((resolve,reject)=>{
     this.pool.query(
       `SELECT 
            p.id AS patient_id,
            p.createdAt,
            p.bed,
            p.dni,
            p.name,
            p.age,
            p.weight,
            p.height,
            p.phoneNumber,
            p.sex,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates,
            GROUP_CONCAT(DISTINCT cr.reason) AS consultation_reasons
        FROM 
            Patient p
        LEFT JOIN 
            Patient_Allergies pa ON p.id = pa.patient_id
        LEFT JOIN 
            Allergies a ON pa.allergies_id = a.id
        LEFT JOIN 
            Patient_Current_Medications pcm ON p.id = pcm.patient_id
        LEFT JOIN 
            Current_Medications cm ON pcm.current_medications_id = cm.id
        LEFT JOIN 
            Patient_Preconditions pp ON p.id = pp.patient_id
        LEFT JOIN 
            Preconditions pr ON pp.preconditions_id = pr.id
        LEFT JOIN 
            Patient_Entry_Dates ped ON p.id = ped.patient_id
        LEFT JOIN 
            Entry_Dates ed ON ped.entry_dates_id = ed.id
        LEFT JOIN 
            Entry_Dates_Consultation_Reasons edcr ON ed.id = edcr.entry_dates_id
        LEFT JOIN 
            Consultation_Reasons cr ON edcr.consultation_reasons_id = cr.id
        WHERE 
            p.bed = ?
        GROUP BY 
            p.id;`
    ,[bed],(err,results)=>{
      if(err){
       return reject(err);
      }
      return resolve(results);
     })
   })
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  } 
 }
}

export default Patient;

