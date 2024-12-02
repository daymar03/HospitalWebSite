document.addEventListener('DOMContentLoaded', ()=>{
  var url = new URL(window.location.href)
  let params = new URLSearchParams(url.search)
  let fbed = params.get('bed')
  let froom = params.get('room')
  if (fbed && froom){
    document.querySelector('#sala').value = froom
    document.querySelector('#cama').value = fbed
  }
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

}

function checkedF(){
let checkF = document.querySelector('#sexF')
let checkM = document.querySelector('#sexM')
  if (checkM.checked){
    checkF.checked = false
  }
}

function checkedM(){
let checkF = document.querySelector('#sexF')
let checkM = document.querySelector('#sexM')
  if (checkF.checked) {
    checkM.checked = false
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

  let sex

  if(checkF.checked){sex = 'F'}else if (checkM.checked){sex = 'M'} else {alert("Debe especificar el Sexo"); return}

  let name = document.querySelector('#name').value
  let dni = document.querySelector('#dni').value
  let phoneNumber = document.querySelector('#phoneNumber').value
  let age = document.querySelector('#age').value
  let weight = document.querySelector('#weight').value
  let height = document.querySelector('#height').value
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
    sex
  }}
  try {
    const res = await fetch('http://localhost:3000/patients/create', {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)})
    console.log(res)
    const resJson = await res.json()
      if(resJson.error){
        if(resJson.error == "The bed is already bussy")
        alert("error: "+resJson.error)
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
