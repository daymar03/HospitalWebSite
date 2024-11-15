function confirmarCierre() {
    let confirmacion = confirm("¿Desea cerrar sesión?");
    if (confirmacion) {
      window.open('../login/index.html', '_self');
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


function editForm(e){
  e.preventDefault()
  let id = e.target.id;
  document.querySelector('#hidden').value = id
  document.querySelector(".modal__content-edituser").style.display="block";
  document.querySelector(".modal__content-edituser").id = id;

}

function cancelar(){
  document.querySelector(".modal__content-edituser").style.display="none";
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

