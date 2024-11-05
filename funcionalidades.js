function toggleSidebar() {
    document.querySelector('.Menu-titulo').classList.toggle('active');
}

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.Menu-titulo');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

function login() {
            var username = document.getElementById("username").value;
            var password = document.getElementById("myPassword").value;

            if (username === "admin" && password === "admin") {
                window.open('./admin_panel/admin.html', '_blank');
            } else if (username === "secretaria" && password === "secretaria") {
                window.open('./secretary_panel/secretaria.html', '_blank');
            } else {
                alert("Credenciales incorrectas");
            }
        }

/*

// Cambio de fondo 
let images = [
    'fondo.jpg',
    'fondo1.png'
];
let currentIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length;
}

setInterval(changeBackground, 80000); // cambiar cada 5 segundos
changeBackground(); // Inicial para cargar la primera imagen
*/
