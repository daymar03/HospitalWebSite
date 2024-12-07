function login(e) {
  e.preventDefault()
            var username = document.getElementById("username").value;
            var password = document.getElementById("myPassword").value;

            if (username === "admin" && password === "admin") {
                window.open('../admin/index.html', 'self');
            } else if (username === "director" && password === "director") {
                window.open('../direct/index.html', 'self');
            } else if (username === "doctor" && password === "doctor") {
                window.open("../doctor/index.html", "_self");
            } else {
                alert("Credenciales incorrectas");
            }
        }

