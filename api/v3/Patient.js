import { getPool } from './db.js'
import { isValidBase64 } from './utils.js'

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
            p.consultationReasons,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates
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
            p.consultationReasons,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates
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
            p.consultationReasons,
            GROUP_CONCAT(DISTINCT a.name) AS allergies,
            GROUP_CONCAT(DISTINCT cm.name) AS medications,
            GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
            GROUP_CONCAT(DISTINCT ed.date) AS entry_dates
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
          p.consultationReasons,
          GROUP_CONCAT(DISTINCT a.name) AS allergies,
          GROUP_CONCAT(DISTINCT cm.name) AS medications,
          GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
          GROUP_CONCAT(DISTINCT ed.date) AS entry_dates
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

async GET_Patients_By_Room_Number(room) {
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
          p.consultationReasons,
          GROUP_CONCAT(DISTINCT a.name) AS allergies,
          GROUP_CONCAT(DISTINCT cm.name) AS medications,
          GROUP_CONCAT(DISTINCT pr.name) AS preconditions,
          GROUP_CONCAT(DISTINCT ed.date) AS entry_dates
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
      WHERE
         SUBSTRING(p.bed, 1, 1) = ?
      GROUP BY
          p.id;`,
      [room]
    );

    return results;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

async CreatePatient(patient) {
  return new Promise(async (resolve, reject)=>{
  let {
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

  allergies = allergies.map(val => val.toLowerCase())
  medications = medications.map(val => val.toLowerCase())
  preconditions = preconditions.map(val => val.toLowerCase());

  try {
    await this.pool.query('START TRANSACTION');

    const [results] = await this.pool.query(
      `SELECT * FROM Patient WHERE bed = ?`,[bed]
    )

    if (results.length !== 0) {
      reject({error: "The bed is already busy"})
    }

    // Inserción en la tabla Patient
    const result = await this.pool.query(
      `INSERT INTO Patient (createdAt, bed, dni, name, age, weight, height, phoneNumber, sex, consultationReasons)
      VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bed, dni, name, age, weight, height, phoneNumber, sex, consultationReasons]
    );
    const patientResult = result[0]
    if (patientResult.affectedRows === 0) { console.log('Patient insert failed'); }

    const patientId = patientResult.insertId;
    console.log(patientId)

    // Inserción en la tabla Patient_Allergies
    if (typeof(allergies) != 'undefined') {
    for (let allergy of allergies) {
      let [results] = await this.pool.query(
        `SELECT id FROM Allergies WHERE name = ?`, [allergy] );
          console.log(results)

      let allergyId;

      if (results.length === 0) {
        let insertAllergyResult = await this.pool.query( `INSERT INTO Allergies (name) VALUES (?)`, [allergy] );
        allergyId = insertAllergyResult[0].insertId;
      } else {
        allergyId = results[0].id;
      }
      console.log(allergyId)
      await this.pool.query( `INSERT INTO Patient_Allergies (patient_id, allergies_id) VALUES (?, ?)`, [patientId, allergyId] ); }
    }
    // Inserción en la tabla Patient_Current_Medications
    if (typeof(medications) != 'undefined'){
    for (let medication of medications) {
      let [results] = await this.pool.query(`SELECT id from Current_Medications where name = ?`, [medication]);

      let medicationId;

      if (results.length === 0) {
        let insertMedicationResult = await this.pool.query(`INSERT INTO Current_Medications (name) VALUES (?)`, [medication])
        medicationId = insertMedicationResult[0].insertId;
      } else {
        medicationId = results[0].id
      }
        await this.pool.query(
          `INSERT INTO Patient_Current_Medications (patient_id, current_medications_id) VALUES (?, ?)`, [patientId, medicationId]); }
    }

    // Inserción en la tabla Patient_Preconditions
    if (typeof(preconditions) != 'undefined'){
    for (let precondition of preconditions) {
      const [results] = await this.pool.query(`SELECT id FROM Preconditions WHERE name = ?`, [precondition])

      let preconditionId

      if (results.length === 0) {
        const insertPreconditionResult = await this.pool.query(`INSERT INTO Preconditions (name) VALUES (?)`, [precondition])
        preconditionId = insertPreconditionResult[0].insertId
      } else {
        preconditionId = results[0].id
      }
    await this.pool.query(
      `INSERT INTO Patient_Preconditions (patient_id, preconditions_id) VALUES (?, ?)`, [patientId, preconditionId]
    )
    }

    }
    // Inserción en la tabla Patient_Entry_Dates
    const entryDatesResults = await this.pool.query(`INSERT INTO Entry_Dates (date) VALUES (NOW())`)
    let entryDateId = entryDatesResults[0].insertId

    await this.pool.query(
      `INSERT INTO Patient_Entry_Dates (patient_id, entry_dates_id)
      VALUES (?, ?)`,
      [patientId, entryDateId]);


    await this.pool.query('COMMIT');
    console.log('Patient inserted successfully');
    resolve({success: true, patientId, message: "Patient successfully added"})
    } catch (error) {
      await this.pool.query('ROLLBACK');
      console.error('Error inserting patient:', error);
      reject({success: false, message: "Something went wrong", error })
    }})
  }

 async DELETE_Patient(options={}) { 
  let {id=null, bed=null, reasons=null} = options
  let decodedReasons = null
  // either id or bed, not both 
  if ((id !== null && bed !== null) || (id === null && bed === null)) { throw new Error("Bad request"); }
  if (reasons) {
   // reasons must come in base64
    if(!isValidBase64(reasons)){
   throw new Error("'reasons' param is not valid base64")}
   decodedReasons = Buffer.from(reasons,'base64').toString('utf-8')
  }
  try {
   await this.pool.query('START TRANSACTION');
   let patient = null
   if(id) {
    patient = await this.GET_Patients_By_Id(id)
   } else {
    patient = await this.GET_Patients_By_Bed_Number(bed)
   }
    id = patient[0].patient_id
    if(patient.length===0) {
     throw new Error("Patient does not exists")
    }
    // Add to history
    console.log(decodedReasons)
    await this.pool.query(`
      INSERT INTO History (
        createdAt, bed, dni, name, age, weight, height, phoneNumber, preconditions, 
        allergies, medications, entry_date, consultation_reasons, departure_date, leaving_reasons
      ) VALUES (
        CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        CURRENT_TIMESTAMP, ?
    )
    `, [
    patient[0].bed, patient[0].dni, patient[0].name, patient[0].age, patient[0].weight, patient[0].height, 
    patient[0].phoneNumber, patient[0].preconditions, patient[0].allergies, patient[0].medications, 
    patient[0].entry_date, patient[0].consultation_reasons, decodedReasons 
   ]);
    // Delete references from intermediate tables
    await this.pool.query('DELETE FROM Patient_Preconditions WHERE patient_id = ?', [id]); 
    await this.pool.query('DELETE FROM Patient_Entry_Dates WHERE patient_id = ?', [id]); 
    await this.pool.query('DELETE FROM Patient_Allergies WHERE patient_id = ?', [id]);
    await this.pool.query('DELETE FROM Patient_Current_Medications WHERE patient_id = ?', [id]); 
    await this.pool.query('DELETE FROM Patient_Operation WHERE patient_id = ?', [id]); 
    await this.pool.query('DELETE FROM Patient_Operation_Request WHERE patient_id = ?', [id]);
    // Delete from secondary tables
    await this.pool.query(`DELETE FROM Preconditions WHERE id NOT IN (SELECT preconditions_id FROM Patient_Preconditions)`)
    await this.pool.query(`DELETE FROM Entry_Dates WHERE id NOT IN (SELECT entry_dates_id FROM Patient_Entry_Dates)`)
    // Delete from Patient
    await this.pool.query(`DELETE FROM Patient WHERE id = ?`,[id])
    await this.pool.query('COMMIT');
    return { success: true, message: "Patient successfully deleted" };
  } catch (err) {
     await this.pool.query('ROLLBACK');
     throw err
  }
 }



async PATCH_Patient(fields, id, bed, currentMedications) {
  const setString = Object.keys(fields).map(key => `${key} = '${fields[key]}'`).join(', ');
  const whereClause = id ? 'id = ?' : 'bed = ?';
  
  try {
    // No update
    if (Object.keys(fields).length === 0 && !currentMedications) {
      throw new Error("Neither the fields nor the medicines were given");
    }

    // Patient table update
    if (Object.keys(fields).length > 0) {
      await this.pool.query(`UPDATE Patient SET ${setString} WHERE ${whereClause}`, [id ? id : bed]);
    }

    // Current_Medications update
    if (currentMedications) {
      currentMedications = [...new Set(currentMedications)]
      currentMedications = currentMedications.map(val=>val.toLowerCase())
      // Check if currentMedications exist in Current_Medications table
      const existingMedications = await this.pool.query(`SELECT id, name FROM Current_Medications WHERE name IN (?)`, [currentMedications]);
      const existingMedNames = new Set(existingMedications[0].map(row => row.name));
      const newMedNames = currentMedications.filter(name => !existingMedNames.has(name));

      // Insert new medications that don't exist in the Current_Medications table
      if (newMedNames.length > 0) {
        for (const name of newMedNames) {
          await this.pool.query(`INSERT INTO Current_Medications (name) VALUES (?)`, [name]);
        }
      }

      // Get updated medication IDs
      const medIds = await this.pool.query(`SELECT id FROM Current_Medications WHERE name IN (?)`, [currentMedications]);
      const medIdArray = medIds[0].map(row => row["id"]);

      // Get patient ID
      let patientId = null;
      if (!id) {
        const patient = await this.pool.query(`SELECT id FROM Patient WHERE bed = ?`, [bed]);
        patientId = patient[0][0].id;
      } else {
        const patient = await this.pool.query(`SELECT id FROM Patient WHERE id = ?`, [id]);
        patientId = patient[0][0].id;
      }

      if (!patientId) {
        throw new Error("Patient does not exist");
      }

      // Update Patient_Current_Medications table
      await this.pool.query(`DELETE FROM Patient_Current_Medications WHERE patient_id = ?`, [patientId]);
      for (const medId of medIdArray) {
        await this.pool.query(`INSERT INTO Patient_Current_Medications (patient_id, current_medications_id) VALUES (?, ?)`, [patientId, medId]);
      }
    }

    return { success: true, message: "Patient successfully updated" };
  } catch (err) {
    throw err;
  }
}

}

export default Patient;
