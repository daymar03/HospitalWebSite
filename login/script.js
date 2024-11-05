let icon = document.querySelector("#eye");
let input = document.getElementById("myPassword");
let cerrar = document.querySelector(".close")

//
function changeEye() {
  if (icon.getAttribute("class") === "fas fa-eye"){
    icon.setAttribute("class", "fas fa-eye-slash");
    input.setAttribute("type", "text");
  }
  else {
    icon.setAttribute("class", "fas fa-eye");
    input.setAttribute("type", "password");
  }
}


cerrar.addEventListener("click", ()=>{
  window.open("../welcome/index.html", "self")
})

