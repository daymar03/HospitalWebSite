let icon = document.querySelector("#eye");
let input = document.getElementById("myPassword");

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


