document.addEventListener('DOMContentLoaded', ()=>{
  var url = new URL(window.location.href)
  let params = new URLSearchParams(url.search)
  let firstBed = params.get('bed')
  if (firstBed){get_by_bed(firstBed)}
})

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

  cerrar_modal.addEventListener('click', ()=>{
    modal.style.display = "none"
    cuerpo.style.background = ""
    legends.forEach(legend =>{
      legend.style.backgroundColor = "#edf4f5"
    })
  })
}

let salir = document.querySelector('.close')
salir.addEventListener('click', ()=>{
  window.open("../login/index.html", "_self")
})
