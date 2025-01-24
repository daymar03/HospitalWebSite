import { useState } from 'react'
import './Wm-Modal.css'

export function WmModal ({Open = false, classN = "", children, closeButton = {open : false}}){
  let open = Open ? "wm-modal-open" : "wm-modal-close"
  let style = classN + " " + open
  return (
    <div className={`wm-modal ` + style}>
      {closeButton.open &&
        <div className="wm-aside-close" style={{width: "100%"}}>
          <button className="wm-aside-close-button" onClick={closeButton.toggleModal}>
            <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
          </button>
        </div>
      }
      {children}
    </div>
  )
}
