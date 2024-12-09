async function update(obj){
  const { weight, medications, bed } = obj
  let patient = {}
  if (bed === undefined) {
    alert("Bad Request")
    return
  }

  if (weight !== undefined) {
    patient.weight = weight
  }
  if (medications !== undefined) {
    patient.currentMedications = medications
  }

  const res = await fetch(`http://localhost:3000/api/patients/update?bed=${bed}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patient)
  })
}
