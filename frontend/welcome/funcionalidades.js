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


