function get_by_bed(bed){
  fetch(`http://localhost:3000/patients?bed=${bed}`)
  .then(res => res.json())
  .then(patient => {
    const p = patient[0]
    if (patient[0]){
      if (p.medications == ""){p.medications = "No consume."}
      if (p.preconditions == ""){p.preconditions = "Sin condiciones previas."}
      if (p.allergies == ""){p.allergies = "Sin alergias."}
    let html = `
            <div class="resultados_busqueda informacion_paciente">
                    <h3><i class="fas fa-info-circle"></i> INFORMACIÓN DEL PACIENTE</h3>
                    <p><span>Cama: </span>${p.bed}</p>
                    <p><span>Nombre: </span>${p.name}</span></p>
                    <p><span>Edad: </span>${p.age}</p>
                    <p><span>Sexo: </span>${p.sex}</p>
                    <p><span>Peso:</span><span title="Click derecho para editar" class="editable weight"> ${p.weight}</span> kg</p>
                    <p><span>Altura:</span> ${p.height} cm</p>
            </div>

            <div class="resultados_busqueda historia_clinica">
                    <h3><i class="fas fa-notes-medical"></i> HISTORIA CLÍNICA</h3>
                    <p><span>Condiciones previas: </span>${p.preconditions}</p>
                    <p><span>Alergias: </span>${p.allergies}</p>
                    <p><span>Medicamentos Actuales: </span><span title="Click derecho para editar" class="editable medications">${p.medications}</span></p>
            </div>

            <div class="resultados_busqueda motivos_consulta">
                    <h3><i class="fas fa-stethoscope"></i> MOTIVO DE CONSULTA</h3>
                    <p>
                    ${p.consultationReasons}
                    </p>
            </div>
            <div class="button__solicitud-operaciones">
                <button class="button__solicitud"><i class="fas fa-hospital-user"></i> Solicitar Operación</button>
            </div>`
      document.querySelector('.paciente').innerHTML = html
      a()
      c()
    }
    else {
      let html = `<div class="resultados_busqueda"><h3 style="color:red"><i class="fas fa-user-times"></i> PACIENTE NO ENCONTRADO</h3></div>`
      document.querySelector('.paciente').innerHTML = html
    }
  })
  .catch(err => console.log('errorcito: ', err))
}
