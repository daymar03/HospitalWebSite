function confirmarCierre() {
    let confirmacion = confirm("¿Desea cerrar sesión?");
    if (confirmacion) {
      window.open('../login/index.html', 'self');
    } else {
    alert("Operación cancelada.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let botones = document.querySelectorAll(".close");
    botones.forEach(boton => {
    boton.addEventListener("click", confirmarCierre);
    });
});


document.querySelector(".add__user-button").addEventListener("click",()=>{document.querySelector(".modal__content-adduser").style.display="block"});
document.querySelector(".cancel").addEventListener("click",()=>{document.querySelector(".modal__content-adduser").style.display="none"})


function editForm(){
  document.querySelector("#ventana2").style.display="block";
}
function cancelar(){
  document.querySelector("#ventana2").style.display="none";
}

newPassword = document.querySelector("#newPassword");
repeatPassword = document.querySelector("#repeatPassword");
newPassword.addEventListener("keyup", () =>{

if (newPassword.value != ""){
  repeatPassword.setAttribute("required", "");
}
else {
    repeatPassword.removeAttribute("required");
}})

