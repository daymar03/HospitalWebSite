import { useState, useEffect } from 'react'
import { useForm } from '../utils/useForm.js'
import './Profile.css'

export function Profile({image = "", username = "Uknown", role = "Uknown", depa = null}) {

  return (
    <section className="wm-profile">
      <h2>Información de Usuario</h2>
      <div className="wm-profile-info">
        <img className="wm-profile-infoAvatar" src="data:image/webp;base64,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" alt="Profile Picture" />
        <div className="wm-profile-infoNames">
          <span className="wm-profile-infoNames-username">Usuario: {username}</span>
          <span className="wm-profile-infoNames-role">Rol: {role}</span>
         {depa && <span>Departamento: {depa}</span>}
        </div>
      </div>
    </section>
  )
}

export function Personal({name = "", age = "Uknown", personalId = "Uknown", province = ""}) {

  return (
    <section className="wm-personal">
      <h2>Información Personal</h2>
      <div className="wm-profile-infoNames">
        <span className="wm-personal-name">Nombre: {name}</span>
        <span>Edad: {age}</span>
        <span>Número de identidad: {personalId}</span>
        <span>Provincia: {province}</span>
      </div>
    </section>
  )
}

export function ChangePassword({ isVisible, toggleModal }) {
  const display = isVisible ? "flex" : "none";
  const modalStyle = { display };

  const [lastPassword, setLastPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event)=>{
    event.preventDefault()
    setResponseMessage( await useForm({lastPassword, newPassword, confirmPassword}))
  }

  return (
    <section className="wm-changePassword">
      <button className="wm-button wm-changePassword-deploy" onClick={toggleModal}>
        Cambiar Contraseña
      </button>
      <div className="wm-changePassword-modal" style={modalStyle}>
        <div className="wm-changePassword-modal-close">
          <button className="wm-changePassword-modal-close-button" onClick={toggleModal}>
            <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
          </button>
        </div>
        <h4>Cambiar Contraseña</h4>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current-password">Contraseña Actual:</label>
            <input
              type="password"
              id="current-password"
              name="current-password"
              value={lastPassword}
              onChange={(e) => setLastPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="new-password">Nueva Contraseña:</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Repetir Nueva Contraseña:</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="wm-button wm-changePassword-modal-button" type="submit">Cambiar Contraseña</button>
          </div>
        </form>
        <div id="responseMessage">{responseMessage}</div>
      </div>
    </section>
  );
}

