function delet(e){
  e.preventDefault()

  const id1 = document.querySelector('#hidden').value
  let data = {id: id1}

  fetch('http://localhost:1234/doctors', {
    method : "DELETE", 
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
  document.querySelector(".modal__content-edituser").style.display="none"
}

window.delet = delet
