import { useState } from 'react'
import './Header.css'

export function Header({isNormalAsideVisible, toggleNotifAside, toggleAside, isAsideVisible, downAsides, title }) {
  const button = !isAsideVisible ? "https://img.icons8.com/fluency/50/menu.png"
                          : "https://img.icons8.com/skeuomorphism/32/long-arrow-left.png"

  const onclick = ()=>{
    if (button === "https://img.icons8.com/skeuomorphism/32/long-arrow-left.png") downAsides()
    else toggleAside()
  }

  const showNotif = ()=>{
    toggleNotifAside()
    if (isNormalAsideVisible) toggleAside()
  }

  return (
    <header className="wm-header">
      <div className="wm-header-name">
        <h2 style={{marginLeft: "10px"}} className="wm-header-title">{title}</h2>
      </div>
      <div className="wm-header-nav">
			  <form action="http://localhost:3000/api/users/logout" method="POST">
          <button type="submit" className="wm-header-close" title="Cerrar sesión">
            <i className="fas fa-sign-out-alt"/>
          </button>
			  </form>
      </div>
    </header>
  )
}
