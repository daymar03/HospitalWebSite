import { useState, useEffect } from 'react'
import { Table } from '../Table/Table.jsx'
import './Operation.css'

export function Operation() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const getOperations = ()=>{
    setLoading(true)
    fetch("/api/operations/requests")
    .then(res=>res.json())
    .then(res=>{
        setData(res)
        console.log(res)
        setLoading(false)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getOperations()
  },[])

  return (
    <section style={{marginTop:"100px"}} className="wm-section">
      <div style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
        <h1 className="wm-text-blue">Gestión de Operaciones</h1>
      </div>
      {loading && <p>Cargando...</p>}
      {!loading &&
        <Table d={data} get={getOperations} />
      }
    </section>
  )
}
