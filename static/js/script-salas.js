document.addEventListener('DOMContentLoaded', (event) => {
  get_by_room('1')
})

function get_by_room(room){
  let ubicacion1 = document.querySelector('.mostrar__ubicacion--seccion1')
  let ubicacion2 = document.querySelector('.mostrar__ubicacion--seccion2')
  let camas = [`${room}01`, `${room}02`, `${room}03`, `${room}04`, `${room}05`, `${room}06`, `${room}07`, `${room}08`, `${room}09`, `${room}10`]
  let buttons = {add: "fa-user-plus", remove: "fa-user-minus"}
  let classes = {add: "add", remove: "delete"}
  let titles = {add: "Ingresar Paciente", remove: "Egresar Paciente"}

  fetch(`/api/patients?room=${room}`)
  .then(res => res.json())
  .then(patients => {
    let html1 = []
    let html2 = []

    for (let i = 0; i<10; i++){
      let name
      let button
      let Class
      let Title
      let Onclick
      let patientIndex = patients.findIndex(p => p.bed == camas[i])
			let borrarButton = ""
			let add
			let buscar

      if (patientIndex < 0){
        name = "Disponible"
        button = buttons.add
        Class = classes.add
        Title = titles.add
        Onclick = `onclick="insertPatient(${camas[i]}, ${room})"`
      } else {
        name = patients[patientIndex].name
        button = buttons.remove
        Class = classes.remove
        Title = titles.remove
        Onclick = `onclick="deletePatient(${camas[i]}, ${room})"`
      }

		let rol = document.querySelector('.role').innerHTML
		if (rol === "Enfermera/o"){
			if (name === "Disponible"){
				buscar = ""
			} else {
				buscar = `<a title="Ver información del paciente" href="/informacion?bed=${camas[i]}"><button type="button" class="search"> <i class="fas fa-search"></i></button></a>`
			}
      add = `
      <div class="ubicacion__mostrada">
        <i class="fas fa-bed"></i>
        <span class="sp" id="patient-number"> ${camas[i]}</span>
        <span class="sp fixed-width" id="patient-name"> ${name}</span>
				${buscar}
      </div>
      `
		} else {
			if (name === "Disponible"){
				buscar = `<a style="opacity:0"><button type="button" class="search-off"> <i class="fas fa-search"></i></button></a>`
			} else {
				buscar = `<a title="Ver información del paciente" href="/informacion?bed=${camas[i]}"><button type="button" class="search"> <i class="fas fa-search"></i></button></a>`
			}
      add = `
      <div class="ubicacion__mostrada">
        <i class="fas fa-bed"></i>
        <span class="sp" id="patient-number"> ${camas[i]}</span>
        <span class="sp fixed-width" id="patient-name"> ${name}</span>
				${buscar}
        <button title="${Title}" type="button" class="button management-button ${Class}" ${Onclick}> <i class="fas ${button}"></i></button>
      </div>
      `
		}

      if (i < 5){
        html1.push(add)
      } else {
        html2.push(add)
      }
    }

    ubicacion1.innerHTML = html1.join(' ')
    ubicacion2.innerHTML = html2.join(' ')
  })
}

async function deletePatient(bedToDelete, roomOfBed){
  let confirmacion = confirm(`¿Está seguro que desea EGRESAR al paciente de la cama ${bedToDelete}?`);
  if (confirmacion) {
  try {
  await fetch(`/api/patients/delete?bed=${bedToDelete}`, {
    method: "DELETE"
  })
  get_by_room(roomOfBed)
  } catch(err){console.log(err)}
} else {
  console.log('Operación cancelada!')
}}

function insertPatient(bedToInsert, roomToInsert){
  window.open(`/ingresar?bed=${bedToInsert.toString().substring(1,3)}&room=${roomToInsert}`, "_self")
}
