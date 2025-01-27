import { useState } from "react";
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx';
import "./Table.css";

const DEPARTMENTS = ["Admin", "Director", "Nurse", "Doctor", "Recepcionist"];

export function Table({ d = [], get = {} }) {
  const [data, setData] = useState(d ?? []);
  const [isOpen, setIsOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");

  const toggleDeleteModal = (id) => {
    setToDelete(id);
    setIsOpen(!isOpen);
  };

  const handleEditClick = (user) => {
    setEditId(user.id);
    setEditData(user);
  };

  const handleSaveClick = async () => {
    if (!DEPARTMENTS.includes(editData.department)) {
      setError("Departamento no válido. Selecciona un departamento de la lista permitida.");
      return;
    }

    try {
      const response = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      const result = await response.json();

      if (result.success) {
        const newData = data.map((user) =>
          user.id === editData.id ? editData : user
        );
        setData(newData);
        setEditId(null);
        setError("");
      } else {
        console.error('Error al guardar los cambios:', result.message);
      }
    } catch (error) {
      console.error('Error en la operación de guardado:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

  const deleteUser = async () => {
    try {
      const userResponse = await fetch(`/api/users?id=${toDelete}`);
      const user = await userResponse.json();
      const username = user[0].username;

      if (!username) {
        console.error("No se pudo obtener el nombre de usuario.");
        return;
      }

      const notificationsResponse = await fetch(`/api/notifications/get?username=${username}`);
      const notifications = await notificationsResponse.json();

      if (notifications.length > 0) {
        for (const notification of notifications) {
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
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <th data-label="Id">{user.id}</th>
              <th data-label="Nombre">
                {editId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{ fontWeight: "bold" }}
                  />
                ) : (
                  user.name
                )}
              </th>
              <th data-label="Usuario">
                {editId === user.id ? (
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{ fontWeight: "bold" }}
                  />
                ) : (
                  user.username
                )}
              </th>
              <th data-label="Rol">{user.rol}</th>
              <th data-label="Departamento">
                {editId === user.id ? (
                  <input
                    type="text"
                    name="department"
                    value={editData.department}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{ fontWeight: "bold" }}
                  />
                ) : (
                  user.department
                )}
              </th>
              <th data-label="Acciones">
                {editId === user.id ? (
                  <>
                    <button
                      className="wm-button-save"
                      onClick={handleSaveClick}
                      style={{ margin: "5px", borderRadius: "4px", color: "white", backgroundColor: "green", border: "none", padding: "4px 8px", cursor: "pointer", hover: { backgroundColor: "#fcef2d77" } }}
                    >
                      Guardar
                    </button>
                    {error && <span className="error">{error}</span>}
                  </>
                ) : (
                  <button
                    className="wm-button-edit"
                    onClick={() => handleEditClick(user)}
                    style={{ margin: "5px", borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", hover: { backgroundColor: "#fcef2d77" } }}
                  >
                    <i style={{ fontSize: "14px", padding: "2px 4px" }} className="fas fa-edit" />
                  </button>
                )}
                <button
                  className="wm-button-delete"
                  onClick={() => toggleDeleteModal(user.id)}
                  style={{ borderRadius: "4px", color: "white", border: "none", padding: "4px 8px", cursor: "pointer" }}
                >
                  <i style={{ fontSize: "14px", padding: "2px 4px" }} className="fas fa-trash" />
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

