      fetch('http://localhost:1234/doctors')
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
