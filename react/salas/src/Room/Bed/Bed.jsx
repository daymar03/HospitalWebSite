import { useState } from 'react'
import { WmModal } from '../../Wm-Modal/Wm-Modal.jsx'
import './Bed.css'

export function Bed({bed = "100", name = "Disponible", canInsertDelete = false, handleDelete}){
  const [isOpen, setIsOpen] = useState(false)
    const button = (name === "Disponible") ? "fas fa-plus" : "fas fa-trash"
    const insertDeleteIcon = `fas ${button}`
    const insertDeleteButton = (button === "fas fa-plus") ? "wm-button wm-room-side-bed-button wm-green" : "wm-button wm-room-side-bed-button wm-red"

    const toggleDeleteModal = ()=>{
      setIsOpen(!isOpen)
    }

    const deletePatient = ()=>{
      handleDelete(bed)
      toggleDeleteModal()
    }

    return(
      <div>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen} closeButton={{open:true, toggleModal:toggleDeleteModal}}>
        <p>¿Está seguro que desea Egresar este paciente?</p>
        <button onClick={deletePatient} style={{borderRadius: "4px", backgroundColor: "#fa2b2b", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
          <i className="fas fa-trash" />
        </button>
      </WmModal>
      <div className="wm-room-side-bed">
        <div>
          < i class="fas fa-procedures wm-room-side-bed-icon" />
          <span>{bed}</span>
          <span className={name === "Disponible" ? "wm-text-blue" : ""}>{name}</span>
        </div>
        <div className="wm-room-side-bed-buttons">
          { (name !== "Disponible") &&
            <a href={`/informacion?bed=${bed}`} className="wm-button wm-room-side-bed-button">
              < i  width="24px" height="24px" class="fas fa-search" />
            </a>
          }
          { canInsertDelete && button === "fas fa-trash" &&
          <button className={insertDeleteButton} onClick={ name === "Disponible" ? ()=>{} : toggleDeleteModal}>
              <i className={insertDeleteIcon} />
          </button>
          }
          { canInsertDelete && button === "fas fa-plus" &&
          <a href={`/informacion?ingresar=true&bed=${bed}`} className={insertDeleteButton} >
              <i className={insertDeleteIcon} />
          </a>
          }
        </div>
      </div>
      </div>
    )
  }
