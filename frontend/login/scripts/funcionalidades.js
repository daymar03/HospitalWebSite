function login() {
            var username = document.getElementById("username").value;
            var password = document.getElementById("myPassword").value;

            if (username === "admin" && password === "admin") {
                window.open('../admin/index.html', '_blank');
                window.location.reload();
            } else if (username === "director" && password === "director") {
                window.open('../direct/index.html', '_blank');
                window.location.reload();
            } else if (username === "doctor" && password === "doctor") {
                window.open('../doctor/index.html', '_blank');
                window.location.reload();
            } else {
                alert("Credenciales incorrectas");
            }
        }

