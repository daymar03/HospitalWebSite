import { useState } from "react"
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import "./Table.css"

export function Table ({d = [], get = {}}){
  const [data, setData] = useState(d ?? [])
  const [isOpen, setIsOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const toggleDeleteModal = (id)=>{
    const user_id = id ?? null
    setToDelete(id)
    setIsOpen(!isOpen)
  }

  const deleteUser = ()=>{
    fetch("/api/users/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"user_id":toDelete})
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        get()
        setToDelete(null)
      }
    })
  }

  return (
	  <>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen} closeButton={{open:true, toggleModal:toggleDeleteModal}}>
        <p>¿Está seguro que desea Eliminar este usuario?</p>
        <button className="wm-button-delete" onClick={deleteUser} style={{borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
          <i style={{fontSize: "14px", padding: "2px 4px"}} className="fas fa-trash" />
        </button>
      </WmModal>
		  <table style={{backgroundColor: "transparent", borderRadius: "8px", padding: "20px", margin: "auto", textAlign: "center"}}>
			<thead style={{borderBottom: "solid 1px #333", background: "#1977cc77"}}>
				<tr>
					<th>Id</th>
				  <th>Nombre</th>
				  <th>Usuario</th>
				  <th>Rol</th>
				  <th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				  {data.map(user=>(
            <tr key={user.id}>
              <th data-label="Id">{user.id}</th>
              <th data-label="Nombre">{user.name}</th>
              <th data-label="Usuario">{user.username}</th>
              <th data-label="Rol">{user.rol}</th>
              <th data-label="Acciones">
                <button className="wm-button-edit" style={{margin: "5px", borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
                  <i style={{fontSize: "14px", padding: "2px 4px"}} className="fas fa-edit" />
                </button>
                <button className="wm-button-delete" onClick={()=>{let id=user.id; toggleDeleteModal(id)}} style={{borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer"}}>
                  <i style={{fontSize: "14px", padding: "2px 4px"}} className="fas fa-trash" />
                </button>
              </th>
            </tr>
          ))}
			</tbody>
		</table>
	</>
  )
}
