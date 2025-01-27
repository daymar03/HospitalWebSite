import { useState } from "react"
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import "./Table.css"

export function Table({ d = [], get = {} }) {
  const [data, setData] = useState(d ?? [])
  const [isOpen, setIsOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const toggleDeleteModal = (id) => {
    const user_id = id ?? null
    setToDelete(user_id)
    setIsOpen(!isOpen)
  }

const deleteUser = async () => {
    try {
      // Paso 1: Obtener el objeto user con la propiedad username
      const userResponse = await fetch(`/api/users?id=${toDelete}`);
      const user = await userResponse.json();
      const username = user[0].username;

      if (!username) {
        console.error("No se pudo obtener el nombre de usuario.");
        return;
      }

      // Paso 1.2: Borrar las operaciones
      await fetch(`/api/operations/delete`,
        {method: 'DELETE',
         headers: {
          'Content-Type': 'application/json'
         },
         body: JSON.stringify({username: username})}
        )

      // Paso 2: Obtener el objeto notifications con la propiedad id
      const notificationsResponse = await fetch(`/api/notifications/get?username=${username}`);
      const notifications = await notificationsResponse.json();

      if (notifications.length > 0) {
        for (const notification of notifications) {
          // Paso 3: Eliminar cada notificación asociada
          const deleteNotificationResponse = await fetch('/api/notifications/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notification_id: notification.id, username: username })
          });
          const deleteNotificationResult = await deleteNotificationResponse.json();

          if (!deleteNotificationResult.success) {
            console.error('Error al eliminar la notificación:', deleteNotificationResult.message);
            return;
          }
        }
      }

      // Paso 4: Eliminar al usuario
      const deleteUserResponse = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: toDelete })
      });
      const deleteUserResult = await deleteUserResponse.json();

      if (deleteUserResult.success) {
        get();
        setToDelete(null);
        setIsOpen(false);
      } else {
        console.error('Error al eliminar el usuario:', deleteUserResult.message);
      }
    } catch (error) {
      console.error('Error en la operación de eliminación:', error);
    }
  };


  return (
    <>
     <span>{JSON.stringfy(data)}</span>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen} closeButton={{ open: true, toggleModal: toggleDeleteModal }}>
        <p>¿Está seguro que desea Eliminar este usuario?</p>
        <button className="wm-button-delete" onClick={deleteUser} style={{ borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: { backgroundColor: "#fcef2d77" } }}>
          <i style={{ fontSize: "14px", padding: "2px 4px" }} className="fas fa-trash" />
        </button>
      </WmModal>
      <table style={{ backgroundColor: "transparent", borderRadius: "8px", padding: "20px", margin: "auto", textAlign: "center" }}>
        <thead style={{ borderBottom: "solid 1px #333", background: "#1977cc77" }}>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <th data-label="Id">{user.id}</th>
              <th data-label="Nombre">{user.name}</th>
              <th data-label="Usuario">{user.username}</th>
              <th data-label="Rol">{user.rol}</th>
              <th data-label="Acciones">
                <button className="wm-button-edit" style={{ margin: "5px", borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: { backgroundColor: "#fcef2d77" } }}>
                  <i style={{ fontSize: "14px", padding: "2px 4px" }} className="fas fa-edit" />
                </button>
                <button className="wm-button-delete" onClick={() => { let id = user.id; toggleDeleteModal(id) }} style={{ borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer" }}>
                  <i style={{ fontSize: "14px", padding: "2px 4px" }} className="fas fa-trash" />
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
