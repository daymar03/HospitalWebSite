import { useState } from "react"
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import "./Table.css"

export function Table ({d = [], get = {}}){
  const [data, setData] = useState(d ?? [])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenInfo, setIsOpenInfo] = useState(false)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [operationId, setOperationId] = useState(null)
  const [current, setCurrent] = useState(null)

  const toggleApproveModal = ( { id = null } )=>{
    setOperationId(id ?? null )
    setIsOpen(!isOpen)
  }

  const toggleInfoModal = ( { op = null } )=>{
    setCurrent(op ?? null)
    setIsOpenInfo(!isOpenInfo)
  }

  const toggleAlertModal = ()=>{
    setIsOpenAlert(!isOpenAlert)
  }

  const approveOperation = ()=>{
    fetch("http://localhost:3000/api/operations/approve", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"operation_approval" : {id: operationId, date: date + " " + time + ":00"}})
    })
    .then(res=>res.json())
    .then(res=>{
      if (!res.success){
        if(res.error === "Today is already full of risks operations"){
          alert("Ya se han programado 5 operaciones de riesgo para este dia")
          toggleApproveModal({id : null})
        }else if(res.error === "Bad date"){
          alert("Debe Introducir una fecha válida")
          toggleApproveModal({id : null})
        }
      } else {
        get()
        toggleApproveModal({id : null})
        alert("La operación ha sido aprobada")
      }
    })
  }

  return (
	  <>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpenAlert} closeButton={{open:true, toggleModal:toggleAlertModal}}>
        <p className="wm-text-blue">La Operacion ha sido aprobada con éxito</p>
      </WmModal>
      {current !== null &&
      <WmModal classN="wm-modal-bg-white wm-modal-size1 wm-modal-center" Open={isOpenInfo} closeButton={{open:true, toggleModal:toggleInfoModal}}>
        <div style={{display:"flex", flexDirection: "column", alignItems: "start", textAlign: "left", gap: "0", margin: "0"}}>
          <h3 className="wm-text-blue">Información sobre la Operación</h3>
        <div style={{display:"flex", flexDirection: "column", alignItems: "start", textAlign: "left", gap: "0", margin: "0"}}>
            <p><span className="wm-text-blue">La Operación fue solicitada el día:</span> {current.request_date ?? ""}.</p>
            <p><span className="wm-text-blue">Responsable:</span> {current.responsable ?? ""}.</p>
            <p><span className="wm-text-blue">Descripción:</span> {current.description ?? ""}</p>
            <p><span className="wm-text-blue">Prioridad:</span> {current.priority === 0 ? "Alta" : "Regular"}</p>
            <p><span className="wm-text-blue">Duración Estimada:</span> {`${parseInt(current.duration / 60)}:${current.duration % 60 < 10 ? "0"+ current.duration % 60 : current.duration % 60}`}</p>
        </div>
        <div style={{display:"flex", flexDirection: "column", alignItems: "start", textAlign: "left", gap: "0", margin: "0"}}>
            <h4 className="wm-text-blue">Información del Paciente:</h4>
            <p><span className="wm-text-blue">Nombre:</span> {current.patient ?? ""} </p>
            <p><span className="wm-text-blue">Cama:</span> {current.bed ?? ""}</p>
          </div>
        </div>
      </WmModal>}
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen} closeButton={{open:true, toggleModal:toggleApproveModal}}>
        <form onSubmit={(e)=>{
          e.preventDefault()
          approveOperation()
      }} style={{display: "flex", flexDirection:"column", gap: "10px"}}>
        <h3 className="wm-text-blue" htmlFor="date" >¿Está seguro que desea Aprobar esta operación?</h3>
        <div style={{display: "flex", flexDirection:"column", gap: "10px"}}>
        <label htmlFor="date">Ingrese la fecha</label>
        <input required id="date" onChange={(e)=>{
          setDate(e.target.value)
        }} className="wm-select" min={`${new Date().toISOString().split('T')[0]}`} type="date" />
        </div>
        <div style={{display: "flex", flexDirection:"column", gap: "10px"}}>
        <label htmlFor="time">Ingrese la hora</label>
        <input required id="time" onChange={(e)=>{
          setTime(e.target.value)
        }} className="wm-select" type="time" />
        </div>
        <button type="submit" style={{borderRadius: "4px", backgroundColor: "#fa2b2b", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
          Aprobar Operación
        </button>
        </form>
      </WmModal>
		  <table style={{backgroundColor: "transparent", borderRadius: "8px", padding: "20px", margin: "auto", textAlign: "center"}}>
			<thead style={{borderBottom: "solid 1px #333", background: "#1977cc77"}}>
				<tr>
					<th>Id</th>
				  <th>Paciente</th>
				  <th>Responsable</th>
				  <th>Prioridad</th>
				  <th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				  {data.map(o=>(
            <tr key={o.id}>
              <th data-label="Id">{o.id}</th>
              <th data-label="Paciente">{o.patient}</th>
              <th data-label="Responsable">{o.responsable}</th>
              <th data-label="Prioridad">{o.priority === 0 ? "Prioritaria" : "Regular"}</th>
              <th data-label="Acciones">
                <button onClick={()=>{
                  let op = o ?? null
                  toggleInfoModal({op})
                }} style={{margin: "5px", borderRadius: "4px", backgroundColor: "#fcef2d", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
                  Ver Más
                </button>
                <button onClick={()=>{let id=o.id ?? null; toggleApproveModal({id})}} style={{borderRadius: "4px", backgroundColor: "#fa2b2b", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
                  Aprobar
                </button>
              </th>
            </tr>
          ))}
			</tbody>
		</table>
	</>
  )
}
