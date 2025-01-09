import { useState, useEffect } from 'react'
import { Bed } from './Bed/Bed.jsx'
import './Room.css'


export function RoomSide({children}) {

  return (
    <div className="wm-room-side">
      {children}
    </div>
  )
}

export function Room({room="1", canModify=false}) {
  const [patients, setPatients] = useState([])
  const [roomSelected, setRoomSelected] = useState(room)
  const beds = Array.from({ length: 10 }, (_, i) => parseInt(`${roomSelected}01`) + i);

  useEffect(()=>{
    getPatients()
  },[roomSelected])

  const getPatients = ()=>{
    if(!["1","2","3","4"].includes(roomSelected)) setRoomSelected("1")
    fetch(`http://localhost:3000/api/patients?room=${roomSelected}`)
    .then(res=>res.json())
    .then(response=>{
      setPatients(response)
    })
    .catch(error => console.error('Error:', error));
  }

  const handleSelect = (event)=>{
    setRoomSelected(event.target.value)
  }

  const getPatientForBed = (bedNumber) => {
    const patient = patients.find(patient => patient.bed === bedNumber);
    return patient ? patient.name : "Disponible";
  };

  const handleDelete = async (bed)=>{
    fetch(`http://localhost:3000/api/patients/delete?bed=${bed}`, {
      method: "DELETE"
    }).then(res =>{
      getPatients()
      setRoomSelected(roomSelected)
    })
  }

  return (
    <section className="wm-room">
      <div className="wm-room-title">
        <i class="fas fa-diagnoses"></i>
        <h1>Camas</h1>
      </div>
      <div className="wm-room-search">
        <search className="wm-room-search-form">
          <label htmlFor="sala">Buscar Pacientes de Sala:</label>
          <select className="wm-select" id="sala" value={roomSelected} onChange={handleSelect}>
            <option className="wm-room-search-select-option" value="1">Sala 1</option>
            <option className="wm-room-search-select-option" value="2">Sala 2</option>
            <option className="wm-room-search-select-option" value="3">Sala 3</option>
            <option className="wm-room-search-select-option" value="4">Sala 4</option>
          </select>
        </search>
      </div>
      < RoomSide className="wm-room-side-1">
        {
          beds.slice(0, 5).map(bedNumber => (
            <Bed key={bedNumber} bed={bedNumber} name={getPatientForBed(bedNumber)} canInsertDelete={canModify} handleDelete={handleDelete}/>
          ))
        }
      </ RoomSide>
      < RoomSide className="wm-room-side-2">
        {
          beds.slice(5, 10).map(bedNumber => (
            <Bed key={bedNumber} bed={bedNumber} name={getPatientForBed(bedNumber)} canInsertDelete={canModify} handleDelete={handleDelete}/>
          ))
        }
      </ RoomSide >
    </section>
  )
}
