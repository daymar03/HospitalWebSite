import { useState } from "react"
import "./Table.css"

export function Table ({d = []}){
  const [data, setData] = useState(d ?? [])
  return (
	  <>
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
                <button style={{margin: "5px", borderRadius: "4px", backgroundColor: "#fcef2d", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
                  <i className="fas fa-edit" />
                </button>
                <button style={{borderRadius: "4px", backgroundColor: "#fa2b2b", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: {backgroundColor: "#fcef2d77"}}}>
                  <i className="fas fa-trash" />
                </button>
              </th>
            </tr>
          ))}
			</tbody>
		</table>
	</>
  )
}
