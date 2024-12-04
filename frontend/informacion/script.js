//Cargar paciente desde la url
let firstBed
document.addEventListener('DOMContentLoaded', ()=>{
  var url = new URL(window.location.href)
  let params = new URLSearchParams(url.search)
  firstBed = params.get('bed')
  if (firstBed){get_by_bed(firstBed)}
})

//Capturar click derecho para EDITAR
function c(){
  let editables = document.querySelectorAll('.editable')
  let editablesArray = []
  editables.forEach(e => {
    editablesArray.push(e)
  })
  let contextMenu = document.querySelector('#contextMenu')
  let spanContent
  let editable
  editablesArray.forEach(edita => {
    edita.addEventListener('contextmenu', (event)=>{
      const editableClass = edita.classList[1]
      event.preventDefault()
      contextMenu.className = editableClass
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${event.pageX}px`;
      contextMenu.style.top = `${event.pageY}px`;
  })})

  contextMenu.addEventListener('click', (event)=>{
    contextMenu.style.display = 'none'
    console.log(editablesArray[0].classList[1])
    console.log(contextMenu.classList[0])
    editable = editablesArray.find(e => e.classList[1] == contextMenu.classList[0])
    console.log(editable)
    spanContent = editable.innerHTML
    editable.innerHTML = `<input class="editing" type="text" value="${spanContent}"></input>`
  })

  document.addEventListener('click', function(event) {
    if (event.target !== document.querySelector('.editable-li')) {
      contextMenu.style.display = 'none';
    }
  })

  document.addEventListener('keydown', async function(event) {
    if (event.key === 'Escape'){
      if(editable.innerHTML.includes('input')){
        editable.innerHTML = spanContent
      }
      contextMenu.style.display = 'none';
    } else if (event.key == 'Enter') {
      
      if (editable.innerHTML.includes('input')){
        let value = document.querySelector('.editing').value
        if (value != spanContent) {
          let patient = {}
          const variable = editable.classList[1]
          if ( variable == "weight"){
            const conf = confirm("Está seguro que desea actualizar el peso del paciente??")
            if (conf) {
              patient.bed = firstBed
              patient.weight = value
              let resUpadte = await update(patient)
              let resRefresh = await get_by_bed(firstBed)
              } else {editable.innerHTML = spanContent}
          } else if ( variable == "medications") {
              const conf = confirm("Está seguro que desea actualizar los medicamentos del paciente??")
              if (conf) {
                patient.bed = firstBed
                patient.medications = value.split(',')
                let resUpadte = await update(patient)
                let resRefresh = await get_by_bed(firstBed)
              } else { editable.innerHTML = spanContent}
          }
        } else {
          editable.innerHTML = spanContent
        }
      }
    }
})
}
//abrir la ventana modal
function a(){
  let req_button = document.querySelector('.button__solicitud')
  let modal = document.querySelector('.modal__solicitud')
  let cuerpo = document.querySelector('body')
  let cerrar_modal = document.querySelector('.modal__solicitud-close')
  let legends = document.querySelectorAll('legend')
  req_button.addEventListener('click', ()=>{
  cuerpo.style.background = "#ccc"
  modal.style.display = "block"
  legends.forEach(legend =>{
    legend.style.backgroundColor = "#ccc"
  })
  })

//Cerrar la ventana modal
  cerrar_modal.addEventListener('click', ()=>{
    modal.style.display = "none"
    cuerpo.style.background = ""
    legends.forEach(legend =>{
      legend.style.backgroundColor = "#edf4f5"
    })
  })
}

//Salir de la página
let salir = document.querySelector('.close')
salir.addEventListener('click', ()=>{
  window.open("../login/index.html", "_self")
})

//Comprobar si los checkbox están marcados
function checkedP(){
let checkP = document.querySelector('#prioritaria')
let checkR = document.querySelector('#regular')
  if (checkR.checked){
    checkP.checked = false
  }
}

function checkedR(){
let checkP = document.querySelector('#prioritaria')
let checkR = document.querySelector('#regular')
  if (checkP.checked) {
    checkR.checked = false
  }
}

//ONSUBMIT
//if(checkF.checked){sex = 'F'}else if (checkM.checked){sex = 'M'} else {alert("Debe especificar el Sexo"); return} -> validar que siempre se seleccione una prioridad
//parseInt(document.querySelector('#time').value.split(':')[0])*60+parseInt(document.querySelector('#time').value.split(':')[1]) -> Obtener tiempo en minutos
