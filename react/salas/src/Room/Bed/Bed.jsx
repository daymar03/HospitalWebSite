import './Bed.css'

export function Bed({bed = "100", name = "Disponible", canInsertDelete = false, handleDelete}){
    const button = (name === "Disponible") ? "fas fa-plus" : "fas fa-trash"
    const insertDeleteIcon = `fas ${button}`
    const insertDeleteButton = (button === "fas fa-plus") ? "wm-button wm-room-side-bed-button wm-green" : "wm-button wm-room-side-bed-button wm-red"

    const deletePatient = ()=>{
      handleDelete(bed)
    }

    return(
      <div className="wm-room-side-bed">
        <div>
          < i class="fas fa-procedures wm-room-side-bed-icon" />
          <span>{bed}</span>
          <span className={name === "Disponible" ? "wm-text-blue" : ""}>{name}</span>
        </div>
        <div className="wm-room-side-bed-buttons">
          { (name !== "Disponible") &&
            <a href={`/informacion?bed=${bed}`} className="wm-button wm-room-side-bed-button">
              < i width="24px" height="24px" class="fas fa-search" />
            </a>
          }
          { canInsertDelete && button === "fas fa-trash" &&
          <button className={insertDeleteButton} onClick={ name === "Disponible" ? ()=>{} : deletePatient}>
              <i className={insertDeleteIcon} />
          </button>
          }
          { canInsertDelete && button === "fas fa-plus" &&
          <a href={`/informacion?ingresar=true&bed=${bed}`} className={insertDeleteButton} onClick={ name === "Disponible" ? ()=>{} : deletePatient}>
              <i className={insertDeleteIcon} />
          </a>
          }
        </div>
      </div>
    )
  }
