let botones = document.querySelectorAll(".cancel")
let cerrar = document.querySelector(".close")

cerrar.addEventListener("click", ()=>{
  window.open("../login/index.html", "_self")
})

botones.forEach(boton =>{
  boton.addEventListener("click", ()=>{
    let padre = boton.parentElement
    padre.style.display = "none";
  })
})


document.querySelector(".rango").addEventListener("click",()=>{
  let ventana1 = document.querySelector(".operaciones_rango_tiempo")
  let ventana2 = document.querySelector(".operaciones_urgencia_en_un_mes")

  ventana1.style.display = "block"
  if (ventana2.style.display === "block"){
    ventana2.style.display = "none"
  }
  
});
document.querySelector(".mes_boton").addEventListener("click",()=>{
  let ventana1 = document.querySelector(".operaciones_rango_tiempo")
  let ventana2 = document.querySelector(".operaciones_urgencia_en_un_mes")

  ventana2.style.display = "block"
  if (ventana1.style.display === "block"){
    ventana1.style.display = "none"
  }
});
