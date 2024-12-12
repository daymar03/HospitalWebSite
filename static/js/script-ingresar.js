document.addEventListener('DOMContentLoaded', ()=>{
  var url = new URL(window.location.href)
  let params = new URLSearchParams(url.search)
  let fbed = params.get('bed')
  let froom = params.get('room')
  if (fbed && froom){
    document.querySelector('#sala').value = froom
    document.querySelector('#cama').value = fbed
  }

  let name = document.querySelector('#name')
  let dni = document.querySelector('#dni')
  let phoneNumber = document.querySelector('#phoneNumber')
  let age = document.querySelector('#age')
  let weight = document.querySelector('#weight')
  let height = document.querySelector('#height')
  let consultationReasons = document.querySelector('#motiv')
  let allergies = document.querySelector('#alerg')
  let medications = document.querySelector('#medac')
  let preconditions = document.querySelector('#cprev')
  let risk_patient = document.querySelector('#risk_patient')

	age.addEventListener
})

function resetForm(){
  document.querySelector('#name').value = ""
  document.querySelector('#dni').value = ""
  document.querySelector('#phoneNumber').value = ""
  document.querySelector('#age').value = 0
  document.querySelector('#weight').value = 0
  document.querySelector('#height').value = 0
  document.querySelector('#motiv').value = ""
  document.querySelector('#alerg').value = ""
  document.querySelector('#medac').value = ""
  document.querySelector('#cprev').value = ""
  document.querySelector('#sexF').checked = false
  document.querySelector('#sexM').checked = false
  document.querySelector('#').checked = false
  document.querySelector('#sexM').checked = false
}

function checkedF(){
let checkF = document.querySelector('#sexF')
let checkM = document.querySelector('#sexM')
  if (checkM.checked){
    checkF.checked = true
    checkM.checked = false
  }
}

function checkedM(){
let checkF = document.querySelector('#sexF')
let checkM = document.querySelector('#sexM')
  if (checkF.checked) {
    checkM.checked = true
    checkF.checked = false
  }
}

function checkedH(){
let checkH = document.querySelector('#high')
let checkL = document.querySelector('#low')
  if (checkL.checked){
    checkH.checked = true
    checkL.checked = false
  }
}

function checkedL(){
let checkH = document.querySelector('#high')
let checkL = document.querySelector('#low')
  if (checkH.checked) {
    checkL.checked = true
    checkH.checked = false
  }
}

async function ingresar(e){
  const bed = document.querySelector('#sala').value + document.querySelector('#cama').value
  console.log(bed)
  e.preventDefault()
  let textarea = document.querySelector('#motiv')
  if (motiv.value.length < 10) {
    alert("El motivo de consulta debe tener al menos 10 caracteres")
    return
  }

  let checkF = document.querySelector('#sexF')
  let checkM = document.querySelector('#sexM')
  let checkH = document.querySelector('#high')
  let checkL = document.querySelector('#low')

  let sex
	let risk_patient

  if(checkF.checked){sex = 'F'}else if (checkM.checked){sex = 'M'} else {alert("Debe especificar el Sexo"); return}
  if(checkH.checked){risk_patient = true}else if (checkL.checked){risk_patient = false} else {alert("Debe especificar el riesgo"); return}

  let name = document.querySelector('#name').value
  let dni = document.querySelector('#dni').value
  let phoneNumber = document.querySelector('#phoneNumber').value
  let age =parseInt(document.querySelector('#age').value)
  let weight = parseInt(document.querySelector('#weight').value)
  let height = parseInt(document.querySelector('#height').value)
  let consultationReasons = document.querySelector('#motiv').value
  let allergies = document.querySelector('#alerg').value.split(',')
  let medications = document.querySelector('#medac').value.split(',')
  let preconditions = document.querySelector('#cprev').value.split(',')

  //validations here

  //*****************

  const data = {patient: {
    name,
    bed,
    dni,
    phoneNumber,
    age,
    weight,
    height,
    consultationReasons,
    allergies,
    medications,
    preconditions,
    sex,
		risk_patient
  }}
  try {
    const res = await fetch('http://localhost:3000/api/patients/create', {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)})
    const resJson = await res.json()
    console.log(resJson)
      if(resJson.error){
        if(resJson.error == "The bed is already busy")
        alert("error: "+resJson.error)
        else if(resJson.error == "Bad Request"){
          alert(resJson.message)
        }
        else {
          alert("error: "+resJson.error.code)
        }
      } else {
        alert(`Paciente ingresado en la cama ${bed}`)
        resetForm()
      }} catch(err){
        console.error(err)
      }
}
