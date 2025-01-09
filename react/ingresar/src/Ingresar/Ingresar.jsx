import { useState, useEffect } from 'react'
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx'
import './Ingresar.css'
const PATIENT_URL = "http://localhost:3000/api/patients?bed="


export function Ingresar() {
  return (
    <section className="wm-ingresar" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      < h1>Ingresar</h1>
    </section>
  )
}
