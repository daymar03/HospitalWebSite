import {useState} from "react"
import "./main.css"

export function Table ({d = []}){
  const [data, setData] = useState(d ?? [])
  const dataExample = [{"id":1,"name":"Daymar David Guerrero Santiago","username":"daymar03","rol":"Admin"},{"id":2,"name":"Kevin Calaña Castellón","username":"calanac","rol":"Admin"},{"id":3,"name":"Ramón Alejandro Mateo Ochoa","username":"amateo","rol":"Admin"},{"id":4,"name":"Christopher Fernando Frias Ramos","username":"ffrias","rol":"Admin"},{"id":5,"name":"Marc Anthony Echemendía Romero","username":"marca","rol":"Admin"},{"id":6,"name":"Ana María López Hernández","username":"anamlh","rol":"Admin"},{"id":7,"name":"Luis Alberto Gómez Pérez","username":"lagp","rol":"Director"},{"id":8,"name":"Laura Martínez Rivera","username":"lmr","rol":"Doctor"},{"id":9,"name":"Carlos Enrique Torres","username":"cet","rol":"Nurse"},{"id":10,"name":"Carmen Julia Ruiz","username":"cjr","rol":"Recepcionist"}]
  return (
	  <>
		  <table>
			<thead>
				<tr>
					<th>Id</th>
				  <th>Nombre</th>
				  <th>Usuario</th>
				  <th>Rol</th>
				</tr>
			</thead>
			<tbody>
				  {dataExample.map(user=>(
            <tr key={user.id}>
              <th data-label="Id">{user.id}</th>
              <th data-label="Nombre">{user.name}</th>
              <th data-label="Usuario">{user.username}</th>
              <th data-label="Rol">{user.rol}</th>
            </tr>
          ))}
			</tbody>
		</table>
	</>
  )
}
