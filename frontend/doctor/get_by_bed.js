function get_by_bed(bed){
  fetch(`http://localhost:8001/patients?bed=${bed}`)
  .then(res => res.json())
  .then(patient => {
    const p = patient[0]
    if (patient[0]){
    var html = `
            <div class="resultados_busqueda informacion_paciente">
                <fieldset>
                    <legend>INFORMACIÓN DEL PACIENTE</legend>
                    <p><span>Cama: </span>${p.bed}</p>
                    <p><span>Nombre: </span>${p.name}</p>
                    <p><span>Edad: </span>${p.age}</p>
                    <p><span>Sexo: </span>${p.sex}</p>
                    <p><span>Peso:</span>${p.weight} kg</p>
                    <p><span>Altura:</span>${p.height} cm</p>
                </fieldset>
            </div>

            <div class="resultados_busqueda historia_clinica">
                <fieldset>
                    <legend>HISTORIA CLÍNICA</legend>
                    <p><span>Condiciones previas: </span>${p.preconditions} </p>
                    <p><span>Alergias: </span>${p.allergies}</p>
                    <p><span>Medicamentos Actuales: </span>${p.medications}</p>
                </fieldset>
            </div>

            <div class="resultados_busqueda motivos_consulta">
                <fieldset>
                    <legend>MOTIVO DE CONSULTA</legend>
                    <p>
                    ${p.consultation_reasons}
                    </p>
                </fieldset>
            </div>`}
    else {
      var html = `<div class="resultados_busqueda"><fieldset>Paciente no encontrado.</fieldset></div>`
    }
    document.querySelector('.paciente').innerHTML = html
  })
  .catch(err => console.log('errorcito: ', err))
}
