import { useState, useEffect } from 'react'
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import './Info.css'
const PATIENT_URL = "http://localhost:3000/api/patients?bed="

export function Info({canModify = false}) {
  const r = window.location.href.toString().split("bed=")[1] ? window.location.href.toString().split("bed=")[1].split('').slice(0,1).join() : "1"
  const [roomToGet, setRoomToGet] = useState(r)
  const b = window.location.href.toString().split("bed=")[1] ? window.location.href.toString().split("bed=")[1].split('').slice(1,3).join('') : "01"
  const [bedToGet, setBedToGet] = useState(b)
  const [currentPtient, setCurrentPtient] = useState({})
  let c = false
  if (window.location.href.split('?')[1] !== undefined){
    if (window.location.href.split('?')[1].split('=')[0] !== undefined){
      if (window.location.href.split('?')[1] !== undefined){
        if (window.location.href.split('?')[1].split('=')[0] === "ingresar"){
          c = true
        }
      }
    }
  }
  const [modoIngreso, setModoIngreso] = useState(c)

  useEffect(()=>{
    fetch(PATIENT_URL+roomToGet+bedToGet)
    .then(res=>res.json())
    .then(res=>setCurrentPtient(res[0]))
    .catch(err=>console.log(err))
  },[bedToGet, roomToGet])

  const InfoSearch = ()=>{

    const handleSelect = ({bed = null, room = null})=>{
      if (bed !== null) setBedToGet(bed)
      if (room !== null) setRoomToGet(room)
    }

    console.log(currentPtient)
    return (
      <section className="wm-info">
        <h1 className="wm-text-blue">Buscar pacientes por cama:</h1>
        <search className="wm-search">
          { currentPtient !== undefined && <span>Encontrar paciente de:</span>}
          { modoIngreso && !currentPtient && <span>Ingresar paciente en:</span>}
          <select id="room" className="wm-select" value={roomToGet} onChange={(event)=>{
            handleSelect({room:event.target.value})
          }}>
            <option value="1">Sala 1</option>
            <option value="2">Sala 2</option>
            <option value="3">Sala 3</option>
            <option value="4">Sala 4</option>
          </select>
          <span>y</span>
          <select id="bed" className="wm-select" value={bedToGet} onChange={(event)=>{
            handleSelect({bed:event.target.value})
          }}>
            <option value="01">Cama 1</option>
            <option value="02">Cama 2</option>
            <option value="03">Cama 3</option>
            <option value="04">Cama 4</option>
            <option value="05">Cama 5</option>
            <option value="06">Cama 6</option>
            <option value="07">Cama 7</option>
            <option value="08">Cama 8</option>
            <option value="09">Cama 9</option>
            <option value="10">Cama 10</option>
          </select>
        </search>
      </section>
    )
  }

  const InfoResults = ()=>{

    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = ()=>{
      setIsOpen(!isOpen)
    }

    const handleOperation = ()=>{
      const priority = document.querySelector("#priority").value
      const estimated_duration = parseInt(document.querySelector('#estimatedDuration').value.split(':')[0])*60+parseInt(document.querySelector('#estimatedDuration').value.split(':')[1])
      const description = document.querySelector("#description").value
      const patient_bed = document.querySelector("#room").value + document.querySelector("#bed").value
      const data = {operation : {priority, estimated_duration, description, patient_bed}}
      fetch("http://localhost:3000/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(res=>res.json())
      .then(res=>console.log(res))
    }


    const Patient = ()=>{
      return (
        <div className="wm-info-results-display">
          <div className="wm-info-results-display-left">
            <h4>Información Personal</h4>
            <div>
              <p><span>Nombre:</span> {currentPtient.name}</p>
              <p><span>Cama:</span> {currentPtient.bed}</p>
              <p><span>DNI:</span> {currentPtient.dni}</p>
              <p><span>Edad:</span> {currentPtient.age}</p>
              <p><span>Peso:</span> {currentPtient.weight}</p>
              <p><span>Altura:</span> {currentPtient.height}</p>
              <p><span>Número telefónico:</span> {currentPtient.phoneNumber}</p>
              <p><span>sexo:</span> {currentPtient.sex === "F" ? `Femenino` : `Masculino`}</p>
            </div>
          </div>
          <div className="wm-info-results-display-center">
            <h4>Información Médica</h4>
            <div>
              <p><span>Alergias:</span> {currentPtient.allergies}</p>
              <p><span>Medicamentos Actuales:</span> {currentPtient.medications}</p>
              <p><span>Condiciones Previas:</span> {currentPtient.preconditions}</p>
            </div>
          </div>
          <div className="wm-info-results-display-right">
            <h4>Información de Ingreso</h4>
            <div>
              <p><span>Condición:</span> {currentPtient.risk_patient == 0 ? `No es Paciente de Riesgo` : `Es Paciente de Riesgo`}</p>
              {currentPtient.entry_dates !== undefined && <p><span>Fecha de Ingreso:</span> {currentPtient.entry_dates.split(' ')[0]}</p>}
              <p><span>Motivo de Ingrso:</span> {currentPtient.consultationReasons}</p>
            </div>
          </div>
        </div>
      )
    }

    const Form = ()=>{
      const [nameValid, setNameValid] = useState(true)
      const [idValid, setIdValid] = useState(true)
      const [ageValid, setAgeValid] = useState(true)
      const [weightValid, setWeightValid] = useState(true)
      const [heightValid, setHeightValid] = useState(true)
      const [phoneValid, setPhoneValid] = useState(true)
      const [sexValid, setSexValid] = useState(true)
      const [precValid, setPrecValid] = useState(true)
      const [allergValid, setAllergValid] = useState(true)
      const [motivValid, setMotivValid] = useState(true)
      const [medicValid, setMedicValid] = useState(true)
      const [riskValid, setRiskValid] = useState(true)
      const [isInvalid, setIsInvalid] = useState(!nameValid || !idValid || !weightValid || !heightValid || !phoneValid || !sexValid || !precValid || !medicValid || !motivValid || !riskValid || !ageValid)
      const [isOpenModal, setIsOpenModal] = useState(false)
      let P = {}
      let handleSelectRisk = null
      let handleSubmit = null


      useEffect(()=>{
        P = {
          nameP : document.querySelector("#nameP"),
          idP : document.querySelector("#idP"),
          ageP : document.querySelector("#ageP"),
          wP : document.querySelector("#wP"),
          hP : document.querySelector("#hP"),
          sexP : document.querySelector("#sexP"),
          phoneP : document.querySelector("#phoneP"),
          precP : document.querySelector("#precP"),
          allergP : document.querySelector("#allergP"),
          motivP : document.querySelector("#motivP"),
          medicP : document.querySelector("#medicP"),
          riskP : document.querySelector("#riskP")
        }

      if (P.nameP && P.idP && P.ageP && P.wP && P.hP && P.sexP && P.phoneP && P.precP && P.allergP && P.motivP && P.medicP && P.riskP) {
        P.nameP.addEventListener("input", ()=>{
          const v = P.nameP.value
          if (!/^[a-zA-ZñÑ\s]*$/.test(v)) {
            P.nameP.value = v.slice(0, -1);
          }
        })

        P.idP.addEventListener("input", ()=>{
          const v = P.idP.value
           if (!/^\d*$/.test(v)) {
             P.idP.value = v.slice(0, -1);
           }
          if (v.length !== 11){
            setIdValid(false)
            P.idP.style.borderBottom = "solid 2px red"
          }else{
            setIdValid(true)
            P.idP.style.borderBottom = "solid 1px #1977cc"
          }
        })

        P.ageP.addEventListener("input", ()=>{
          const v = P.ageP.value
          if (!/^\d*$/.test(v)) {
            P.ageP.value = v.slice(0, -1);
          }
          if (v < 0 || v > 200){
            setAgeValid(false)
            P.ageP.style.borderBottom = "solid 2px red"
          }else {
            setAgeValid(true)
            P.ageP.style.borderBottom = "solid 1px #1977cc"
          }
        })

        P.wP.addEventListener("input", ()=>{
          const v = P.wP.value
          if (!/^\d*$/.test(v)) {
            P.wP.value = v.slice(0, -1);
          }
          if (v < 0 || v > 300){
            setWeightValid(false)
            P.wP.style.borderBottom = "solid 2px red"
          }else {
            setWeightValid(true)
            P.wP.style.borderBottom = "solid 1px #1977cc"
          }
        })

        P.hP.addEventListener("input", ()=>{
          const v = P.hP.value
          if (!/^\d*$/.test(v)) {
            P.hP.value = v.slice(0, -1);
          }
          if (v < 10 || v > 300){
            setHeightValid(false)
            P.hP.style.borderBottom = "solid 2px red"
          }else if (v === "" || (v > 10 && v < 300)){
            setHeightValid(true)
            P.hP.style.borderBottom = "solid 1px #1977cc"
          }
        })

        P.sexP.addEventListener("input", ()=>{
          const v = P.sexP.value
          if (v.toLowerCase() !== "f" && v.toLowerCase() !== "m" ) {
            P.sexP.value = v.slice(0, -1);
          }
        })

        P.phoneP.addEventListener("input", ()=>{
          const v = P.phoneP.value
          if (!/^\d*$/.test(v)) {
            P.phoneP.value = v.slice(0, -1);
          }
          if (v.length !== 8){
            setPhoneValid(false)
            P.phoneP.style.borderBottom = "solid 2px red"
          }else{
            setPhoneValid(true)
            P.phoneP.style.borderBottom = "solid 1px #1977cc"
          }
        })
        handleSelectRisk = ()=>{
          const v = P.riskP.value
          if (v === ""){
            setRiskValid(false)
          }else {
            setRiskValid(true)
          }
        }
      }
      },[])

      useEffect(()=>{
        setIsInvalid((!nameValid || !idValid || !weightValid || !heightValid || !phoneValid || !sexValid || !precValid || !medicValid || !motivValid || !riskValid || !ageValid))
        console.log(isInvalid)
      },[ageValid, nameValid, idValid, weightValid, heightValid, phoneValid, allergValid, medicValid, motivValid, riskValid, precValid, sexValid])



      const toggleModal = ()=>{
        setIsOpen(!isOpen)
      }

      return (
        <>
        < WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen}>
          <div className="wm-aside-close" style={{width: "100%"}}>
            <button className="wm-aside-close-button" onClick={toggleModal}>
              <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
            </button>
          </div>
          <p>Por favor rectifique los campos incorrectos y/o rellene los vacíos.</p>
        </WmModal>
        <form className="wm-info-results-display" onSubmit={
        (event)=>{
          event.preventDefault()
          if(isInvalid){
            setIsOpen(true)
            return
          }else {
            const data = {
              patient : {
                bed : roomToGet + "" + bedToGet,
                name : document.querySelector("#nameP").value,
                dni : document.querySelector("#idP").value,
                phoneNumber : document.getElementById("phoneP").value,
                age : parseInt(document.getElementById("ageP").value),
                weight : parseInt(document.getElementById("wP").value),
                height : parseInt(document.getElementById("hP").value),
                consultationReasons : document.getElementById("motivP").value,
                allergies : document.getElementById("allergP").value.split(","),
                medications : document.getElementById("medicP").value.split(","),
                preconditions : document.getElementById("precP").value.split(","),
                sex : document.getElementById("sexP").value.toUpperCase(),
                risk_patient : document.getElementById("riskP").value === 0 ? true : true
              }
            }
            fetch("http://localhost:3000/api/patients/create", {
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body : JSON.stringify(data)
            })
            .then(res=>res.json())
            .then(res=>{
              if (res.success) {
                alert("Paciente Insertado Con Exito")
                window.location.replace(`http://localhost:3000/informacion?bed=${roomToGet+""+bedToGet}`)
              }
            })
          }
        }
        }>
          <div className="wm-info-results-display-left">
            <h4>Información Personal</h4>
            <div>
              <input id="nameP" type="text" placeholder="Nombre del paciente" required></input>
              <input id="idP" type="text" placeholder="Número de Identidad" required></input>
              <input id="ageP" type="text" placeholder="Edad" required></input>
              <input id="wP" type="text" placeholder="Peso (kg)" required></input>
              <input id="hP" type="text" placeholder="Altura (cm)" required></input>
              <input id="phoneP" type="text" placeholder="Número de Teléfono"></input>
              <input id="sexP" type="text" placeholder="Sexo (M/F)" required></input>
            </div>
          </div>
          <div className="wm-info-results-display-center">
            <h4>Información Médica</h4>
            <div>
              <input id="allergP" type="text" placeholder="Alergias (Ej: Alergia1, Alergia2, ...)" ></input>
              <input id="medicP" type="text" placeholder="Medicamentos (Ej: Medicamento1, Medicamento2, ...)" ></input>
              <input id="precP" type="text" placeholder="Condiciones Previas" ></input>
            </div>
          </div>
          <div className="wm-info-results-display-right">
            <h4>Información de Ingreso</h4>
            <div>
              <select onChange={handleSelectRisk} id="riskP" style={{backgroundColor: "transparent", fontSize: "14px", minWidth: "90%" }} className="wm-select">
                <option value="" disabled selected>Nivel de riesgo</option>
                <option value="0">Paciente de Riesgo</option>
                <option value="1">Paciente Regular</option>
              </select>
              <textarea style={{minWidth: "90%", maxWidth: "90%", marginTop: "10px"}} id="motivP" type="text" placeholder="Razones de la consulta" required></textarea>
            </div>
          </div>
          <div style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}} className="wm-info-results-display-down">
            <button type="submit" className="wm-button" style={{padding: "8px 64px", marginTop: "20px", border: "none", borderRadius: "8px", cursor: "pointer"}}>Ingresar</button>
          </div>
        </form>
        </>
      )
    }

    return (
      <section className="wm-info-results">
        <h1 className="wm-text-blue">Resultados de Búsqueda:</h1>
        {currentPtient !== undefined &&
          <>
            <WmModal classN="wm-modal-bg-white wm-modal-center wm-modal-size2" Open={isOpen}>
              <div className="wm-aside-close" style={{width: "100%"}}>
                <button className="wm-aside-close-button" onClick={toggleModal}>
                  <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
                </button>
              </div>
              <h4>Solicitud de Operacion</h4>
              <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <label htmlFor="priority">Prioridad:</label>
                <select className="wm-select" id="priority" name="priority">
                  <option value="0">Prioritaria</option>
                  <option value="1">Regular</option>
                </select>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                <label htmlFor="estimatedDuration">Duración estimada:</label>
                <input id="estimatedDuration" style={{width: "80px"}} className="wm-select" type="time" />
              </div>
              <div style={{width:"90%", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                <label htmlFor="description">Descripción:</label>
                <textarea style={{minHeight: "200px", width: "100%"}} id="description" className="wm-select" />
              </div>
              <button onClick={handleOperation} className="wm-button" style={{padding: "8px 64px", marginTop: "20px", border: "none", borderRadius: "8px", cursor: "pointer"}}>Solicitar Operacion</button>
            </WmModal>
            < Patient />
            <button onClick={toggleModal} className="wm-button" style={{padding: "8px 64px", marginTop: "20px", border: "none", borderRadius: "8px", cursor: "pointer"}}>Solicitar Operacion</button>
          </>
        }
        {currentPtient === undefined && !modoIngreso && canModify &&
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p>Paciente no Encontrado</p>
            <a href={`http://localhost:3000/informacion?ingresar=true&bed=${roomToGet+""+bedToGet}`} className="wm-button" style={{padding: "8px 64px", marginTop: "20px", border: "none", borderRadius: "8px", cursor: "pointer", color: "black", textDecoration: "none"}}>Ingresar Paciente</a>
          </div>
        }
        {currentPtient === undefined && !modoIngreso && !canModify &&
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p>Paciente no Encontrado</p>
          </div>
        }
        {currentPtient === undefined && modoIngreso && canModify &&
          < Form />
        }
      </section>
    )
  }

  return (
    <>
      < InfoSearch />
      < InfoResults />
    </>
  )
}
