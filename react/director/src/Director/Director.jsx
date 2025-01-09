import { useState, useEffect } from 'react'
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import { BarChart } from '../BarGraphic/BarGraphic.jsx'
import { Graphic } from '../Graphic/Graphic.jsx'
import { Bed } from '../Bed/Bed.jsx'
import './Director.css'

export function Director() {
  const [loading, setLoading] = useState(false)
  const [isDateModalOpen, SetIsDateModalOpen] = useState(false)
  const [isUrgentsModalOpen, SetIsUrgentsModalOpen] = useState(false)
  const [resultsOne, setResultsOne] = useState(false)
  const [resultsTwo, setResultsTwo] = useState(false)
  const [resultsThree, setResultsThree] = useState(false)
  const [resultsFour, setResultsFour] = useState(false)
  const [resultsFive, setResultsFive] = useState(false)
  const [resultsSix, setResultsSix] = useState(false)
  const [resultsSeven, setResultsSeven] = useState(false)


//Obtener operaciones en un rango de tiempo
  const getOne = (event)=>{
    event.preventDefault()
    setLoading(true)
    const dateStart = document.querySelector("#date-start").value
    const dateEnd = document.querySelector("#date-end").value
    fetch(`http://localhost:3000/api/operations/range?start=${dateStart}&end=${dateEnd}`)
    .then(res=>res.json())
    .then(res=>{
      if (res.success){
        toggleOne(res.results)
        toggleDateModal()
      }
    })
    .finally(setLoading(false))
  }

//Obtener Porcentaje de Ocupación por sala
  const getTwo = ()=>{
    setLoading(true)
    fetch("http://localhost:3000/api/patients/ocupation")
    .then(res=>res.json())
    .then(res=>{
      toggleTwo(res)
      setLoading(false)
    })
  }

//Obtener Operaciones que duraron mas de lo previsto
  const getThree = ()=>{
    setLoading(true)
    fetch("http://localhost:3000/api/operations/overdue")
    .then(res=>res.json())
    .then(res=>{
      toggleThree(res.results)
      console.log(res.results)
      setLoading(false)
    })
  }

//Obtener Operaciones del dia
  const getFour = ()=>{
    setLoading(true)
    fetch("http://localhost:3000/api/operations/day")
    .then(res=>res.json())
    .then(res=>{
      setLoading(false)
      toggleFour(res.results)
    })
  }

  const getFive = ()=>{
    setLoading(true)
    fetch("http://localhost:3000/api/users/bestDoctor")
    .then(res=>res.json())
    .then(res=>{
      setLoading(false)
      toggleFive(res.result)
      console.log(res.result)}
    )
  }

  const getSix = (event)=>{
    event.preventDefault()
    setLoading(true)
    const month = document.querySelector('#month').value
    const year = document.querySelector('#year').value
    fetch(`http://localhost:3000/api/operations/highpriority?month=${month}&year=${year}`)
    .then(res=>res.json())
    .then(res=>{
      setLoading(false)
      toggleSix(res.result[0])
      toggleUrgentsModal()
    })
  }

  const getSeven = ()=>{
    setLoading(true)
    fetch("http://localhost:3000/api/operations/risk")
    .then(res=>res.json())
    .then(res=>{
      setLoading(false)
      toggleSeven(res.result)
    })
  }

  const toggleDateModal = ()=>{
    SetIsDateModalOpen(!isDateModalOpen)
  }

  const toggleUrgentsModal = ()=>{
    SetIsUrgentsModalOpen(!isUrgentsModalOpen)
  }

  const toggleOne = (res)=>{
    setResultsOne(res)
    setResultsTwo(false)
    setResultsThree(false)
    setResultsFour(false)
    setResultsFive(false)
    setResultsSix(false)
    setResultsSeven(false)
  }

  const toggleTwo = (res)=>{
    setResultsOne(false)
    setResultsTwo(res)
    setResultsThree(false)
    setResultsFour(false)
    setResultsFive(false)
    setResultsSix(false)
    setResultsSeven(false)
  }

  const toggleThree = (res)=>{
    setResultsOne(false)
    setResultsTwo(false)
    setResultsThree(res)
    setResultsFour(false)
    setResultsFive(false)
    setResultsSix(false)
    setResultsSeven(false)
  }

  const toggleFour = (res)=>{
    setResultsOne(false)
    setResultsTwo(false)
    setResultsThree(false)
    setResultsFour(res)
    setResultsFive(false)
    setResultsSix(false)
    setResultsSeven(false)
  }

  const toggleFive = (res)=>{
    setResultsOne(false)
    setResultsTwo(false)
    setResultsThree(false)
    setResultsFour(false)
    setResultsFive(res)
    setResultsSix(false)
    setResultsSeven(false)
  }

  const toggleSix = (res)=>{
    setResultsOne(false)
    setResultsTwo(false)
    setResultsThree(false)
    setResultsFour(false)
    setResultsFive(false)
    setResultsSix(res)
    setResultsSeven(false)
  }

  const toggleSeven = (res)=>{
    setResultsOne(false)
    setResultsTwo(false)
    setResultsThree(false)
    setResultsFour(false)
    setResultsFive(false)
    setResultsSix(false)
    setResultsSeven(res)
  }

  return (
    <>
      <div className="wm-director">
          < WmModal classN="wm-modal-bg-white wm-modal-center" Open={isDateModalOpen}>
            <div className="wm-aside-close" style={{width: "100%"}}>
              <button className="wm-aside-close-button" onClick={toggleDateModal}>
                <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
              </button>
            </div>
            <form style={{display: "flex", flexDirection: "column", gap: "10px"}} onSubmit={getOne}>
              <h4 className="wm-text-blue">Defina el Rango de fechas</h4>
              <div style={{display: "flex", gap: "4px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <label htmlFor="date-start"><strong>Inicio</strong></label>
                  <input className="wm-input-date" name="start" id="date-start" type="date"/>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <label htmlFor="date-end"><strong>Final</strong></label>
                  <input className="wm-input-date" name="end" id="date-end" type="date"/>
                </div>
              </div>
              <div>
                <button type="submit" className="wm-button wm-lightblue">Enviar</button>
              </div>
            </form>
          </ WmModal>
          <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isUrgentsModalOpen}>
            <div className="wm-aside-close" style={{width: "100%"}}>
              <button className="wm-aside-close-button" onClick={toggleUrgentsModal}>
                <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
              </button>
            </div>
            <form style={{display: "flex", flexDirection: "column", gap: "10px"}} onSubmit={getSix}>
              <h4 className="wm-text-blue">Defina el Mes</h4>
              <div style={{display: "flex", gap: "4px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  <label htmlFor="month"><strong>Mes:</strong></label>
                  <select className="wm-select" id="month" name="month">
                    <option value="01">Enero</option>
                    <option value="02">Febrero</option>
                    <option value="03">Marzo</option>
                    <option value="04">Abril</option>
                    <option value="05">Mayo</option>
                    <option value="06">Junio</option>
                    <option value="07">Julio</option>
                    <option value="08">Agosto</option>
                    <option value="09">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                  <label htmlFor="year"><strong>Año:</strong></label>
                  <input required className="wm-select" id="year" type="number" min="1900" max={Date().split(' ')[3]} step="1" placeholder={`1900 - ${Date().split(' ')[3]}`} />
                </div>
              </div>
              <div>
                <button type="submit" className="wm-button wm-lightblue">Enviar</button>
           </div>
            </form>
          </WmModal>
        <section className="wm-director-consults">
          <button title="Pacientes que solicitaron operarse en un rango de tiempo." className="wm-button wm-lightblue" onClick={toggleDateModal}>Operaciones en rango</button>
          <button onClick={getTwo} title="Porcentaje de ocupación del hospital desglosado por sala." className="wm-button wm-lightblue">Ocupación por Sala</button>
          <button onClick={getThree} title="Cantidad de veces que una operación duró más de lo previsto." className="wm-button wm-lightblue">Operaciones Prolongadas</button>
          <button onClick={getFour} title="Operaciones que se realizaran en el día." className="wm-button wm-lightblue">Operaciones de Hoy</button>
          <button onClick={getFive} title="Médico de mejores resultados y el de peores resultados." className="wm-button wm-lightblue">Doctores resaltados</button>
          <button onClick={toggleUrgentsModal} title="Cantidad de operaciones de urgencia de un mes." className="wm-button wm-lightblue">Operaciones Urgentes</button>
          <button onClick={getSeven} title="Cantidad de operaciones con pacientes de riesgose han realizado y cantas de ellas han sido satisfactorias." className="wm-button wm-lightblue">Operaciones de riesgo</button>
        </section>
        <section className="wm-director-results">
          <h2 className="wm-text-blue">Resultados de la Consulta</h2>
          { loading && <h1 className="wm-text-blue">Cargando datos</h1>}
          { resultsOne &&
            <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
              {resultsOne.map(p => (< Bed key={p.bed} bed={p.bed} name={p.name}><span>Fecha: {p.request_date.split('T')[0]}</span></Bed>))}
            </div>}
          { resultsTwo && < BarChart data={resultsTwo} />}
          { resultsThree &&
              <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                < Graphic data={{"Operaciones Demoradas": resultsThree.total, "Operaciones En Tiempo": resultsThree.total_made_operations - resultsThree.total}} />
                <div style={{display: "flex", flexDirection: "column"}}>
                  <p>Total de Operaciones: {resultsThree.total_made_operations}</p>
                  <p>Porcentaje de Operaciones Demoradas: {resultsThree.percent}%</p>
                </div>
              </div>
          }
          { resultsFour &&
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              {resultsFour.map(res=>(
              <div style={{borderRadius: "8px", border: "solid 1px #1977cc", padding: "8px"}}>
                <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Nombre del paciente:</span> {res.patient_name}</p>
                <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Responsable:</span> {res.name}</p>
                <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Prioridad:</span> {res.priority ? "Prioritaria" : "Regular"}</p>
                <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Descripción:</span> {res.description}</p>
                <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Hora:</span> {res.scheduled_date.split('T')[1].split('.')[0]}</p>
              </div>
              ))}
            </div>}
          { resultsFive &&
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              {resultsFive.map((r, index)=>(
                <div key={index} style={{borderRadius: "8px", border: "solid 1px #1977cc", padding: "8px"}}>
                  <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Doctor:</span> {r.name}</p>
                  <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Total de Operaciones:</span> {r.total_operations}</p>
                  <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Operaciones Positivas:</span> {r.positive_operations}</p>
                  <p><span style={{fontWeight: "bold", color: "#1977cc"}}>Porcentaje de Calidad:</span> {r.average_positive}%</p>
                </div>
              ))}
            </div>
          }
          { resultsSix &&
            <div>
              <p><strong>Cantiad de Operaciones de Urgencia: </strong>{resultsSix.cantidad_operaciones_urgencia}</p>
            </div>
          }
          { resultsSeven &&
            <>
              < Graphic data={{"Operaciones satisfactorias": resultsSeven.operaciones_satisfactorias, "Operaciones no satisfactorias": resultsSeven.total_operaciones_riesgo - resultsSeven.operaciones_satisfactorias}} />
              <p><strong>Porcentaje de eficiencia: </strong>{resultsSeven.porcentaje_satisfactorias}%</p>
            </>
          }
        </section>
      </div>
    </>
  )
}
