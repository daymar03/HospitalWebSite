function post(e){
  e.preventDefault()
  document.querySelector(".modal__content-adduser").style.display="none"

  const name1 = document.querySelector("#add-nombre").value
  const usuario1 = document.querySelector("#add-usuario").value
  let roles1 = []
  roles1.push(document.querySelector("#add-roles").value)
  const specialty1 = document.querySelector("#add-departamento").value
  
  const data = {name: name1, usuario: usuario1, specialty: specialty1, roles: roles1}
  console.log(data)

  fetch('http://localhost:1234/doctors', {
    method : "POST", 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
  })
        .then(res => res.json())
        .then(docs => {
          const html = docs.map(doc =>{
            return `
                    <tr>
                    <td>${doc.id}</td>
                    <td>${doc.name}</td>
                    <td>${doc.usuario}</td>
                    <td>${doc.roles}</td>
                    <td>${doc.specialty}</td>
                    <td><button id="${doc.id}" class="boton__editar" onclick="editForm(event)"><i class="fas fa-edit"></i> Editar</button></td>
                    </tr>
            `
          }).join('')
        document.querySelector('.resultado').innerHTML = html
        })
        alert(`Created with username: ${usuario1} and password: `)
}

window.post = post
