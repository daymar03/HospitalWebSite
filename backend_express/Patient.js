import { getPool } from './db.js'

class Patient {
 constructor(){
  this.pool = getPool()
 }

 async GET_Patients(options = {}) { 
  try{
   const {limit=10, page=1} = options
   const offset = (page - 1) * limit
 
   const [results] = await this.pool.query(
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
        LIMIT ? OFFSET ?;`, [limit, offset])
    return results

  } catch (error) {
    console.error('Error fetching patients:',error)
  } 
 }

 async GET_Patients_All() { 
  try{
   const [results] = await this.pool.query(
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
            p.id;`)

    return results
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  } 
 }

 async GET_Patients_By_Id(id) { 
  try{
     const [results] = await this.pool.query(
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
    ,[id])

    return  results
  } catch (error) {
    console.error('Error fetching patients:',error)
    throw error
  }
 }

async GET_Patients_By_Bed_Number(bed) {
  try {
    const [results] = await this.pool.query(
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
          p.id;`,
      [bed]
    );
    
    return results;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}


async CreatePatient(patient) {
  return new Promise(async (resolve, reject)=>{
  const {
     createdAt,
     bed,
     dni,
     name,
     age,
     weight,
     height,
     phoneNumber,
     sex,
     allergies, //array
     medications, //array
     preconditions, //array
     entryDates,
     consultationReasons
   } = patient;

  try {
    await this.pool.query('START TRANSACTION');

    const [results] = await this.pool.query(
      `SELECT * FROM Patient WHERE bed = ?`,[bed]
    )

    if (results.length !== 0) {
      reject({error: "The bed is already bussy"})
    }

    // Inserción en la tabla Patient
    const result = await this.pool.query(
      `INSERT INTO Patient (createdAt, bed, dni, name, age, weight, height, phoneNumber, sex)
      VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bed, dni, name, age, weight, height, phoneNumber, sex]
    );
    const patientResult = result[0]
    if (patientResult.affectedRows === 0) { console.log('Patient insert failed'); }

    const patientId = patientResult.insertId;
    console.log(patientId)

    // Inserción en la tabla Patient_Allergies
    if (typeof(allergies) != 'undefined') {
    for (let allergy of allergies) {
      let [allergyResult] = await this.pool.query(
        `SELECT id FROM Allergies WHERE name = ?`, [allergy] );

      let allergyId;

      if (allergyResult.length === 0) {
        let insertAllergyResult = await this.pool.query( `INSERT INTO Allergies (name) VALUES (?)`, [allergy] );
        allergyId = insertAllergyResult[0].insertId;
      } else {
        allergyId = allergyResult[0].id;
      }
      console.log(allergyId)
      await this.pool.query( `INSERT INTO Patient_Allergies (patient_id, allergies_id) VALUES (?, ?)`, [patientId, allergyId] ); }
    }
    // Inserción en la tabla Patient_Current_Medications
    if (typeof(medications) != 'undefined'){
    for (let medication of medications) {
      let [medicationResult] = await this.pool.query(
        `SELECT id from Current_Medications where name = ?`, [medication]
      )

      let medicationId

      if (medicationResult.length === 0) {
        let insertMedicationResult = await this.pool.query(
          `INSERT INTO Current_Medications (name) VALUES (?)`, [medication]
        )
        medicationId = insertMedicationResult[0].insertId
      } else {
        medicationId = medicationResult[0].id
      }
    }

    await this.pool.query(
      `INSERT INTO Patient_Current_Medications (patient_id, current_medications_id) VALUES (?, ?)`, [patientId, medicationId]
    )
    }
    // Inserción en la tabla Patient_Preconditions
    if (typeof(preconditions) != 'undefined'){
    for (let precondition of preconditions) {
      const [preconditionResult] = await this.pool.query(
        `SELECT id FROM Preconditions WHERE name = ?`, [precondition]
      )

      let preconditionId

      if (preconditionResult.length === 0) {
        const insertPreconditionResult = await this.pool.query(
          `INSERT INTO Preconditions (name) VALUES (?)`, [precondition]
        )
        preconditionId = insertMedicationResult[0].insertId
      } else {
        preconditionId = preconditionResult[0].id
      }
    }

    await this.pool.query(
      `INSERT INTO Patient_Preconditions (patient_id, preconditions_id) VALUES (?, ?)`, [patientId, preconditionId]
    )
    }
    // Inserción en la tabla Patient_Entry_Dates
    const insertedDate = await this.pool.query(
      `INSERT INTO Entry_Dates (date) VALUES (NOW())`
    )
    let entryDateId = insertedDate.insertId

    await this.pool.query(
      `INSERT INTO Patient_Entry_Dates (patient_id, entry_dates_id)
      VALUES (?, ?)`,
      [patientId, entryDateId] );

    // Inserción en la tabla Entry_Dates_Consultation_Reasons
    await this.pool.query(
      `INSERT INTO Entry_Dates_Consultation_Reasons (entry_dates_id, consultation_reasons_id)
      VALUES (?, ?)`,
      [entryDates, consultationReasons] );

    await this.pool.query('COMMIT');
    console.log('Patient inserted successfully');
    resolve({success: true, patientId, message: "Patient successfully added"})
    } catch (error) {
      await this.pool.query('ROLLBACK');
      console.error('Error inserting patient:', error);
      reject({success: false, message: "Something went wrong", error })
    }})
  }
}

export default Patient;

