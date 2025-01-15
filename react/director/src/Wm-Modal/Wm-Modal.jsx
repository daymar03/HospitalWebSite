import { useState } from 'react'
import './Wm-Modal.css'

export function WmModal ({Open = false, classN = "", children, styles = {}){
  let open = Open ? "wm-modal-open" : "wm-modal-close"
  let style = classN + " " + open
  return (
    <div className={`wm-modal ` + style} style={styles}>
      {children}
    </div>
  )
}
