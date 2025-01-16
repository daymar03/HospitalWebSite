import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import { Header } from './Header/Header.jsx'
import { Aside } from './Aside/Aside.jsx'
import { AsideNotifications } from './AsideNotifications/AsideNotifications.jsx'
import { Room } from './Room/Room.jsx'
import { Footer } from './Footer/Footer.jsx'
import './styles.css'
const USER_URL = "/api/users/self"
const USER_ROLE_URL = "/api/users/rol"
const ROOM_URL = "/api/patients?room="

export function App(){
  const [isAsideVisible, setIsAsideVisible] = useState(false);
  const [isAsideNotifVisible, setIsAsideNotifVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [roles, setRoles] = useState([])
  const [canIsertDelete, setCanIsertDelete] = useState(false)

  useEffect(()=>{
    fetch(USER_ROLE_URL)
    .then(res=>res.json())
    .then(res=>{
      setRoles(res.roles)
    })
  },[])

  const toggleAside = () => {
    setIsAsideVisible(!isAsideVisible);
  };

  const toggleNotifAside = () => {
    setIsAsideNotifVisible(!isAsideNotifVisible);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisible(!isPasswordModalVisible);
  };

  const downAsides = ()=>{
    if (isAsideNotifVisible) toggleNotifAside(!isAsideNotifVisible)
    else toggleAside()
  }

  const isSomeAside = (isAsideVisible || isAsideNotifVisible)


  return (
    <>
      < Header downAsides={downAsides} toggleNotifAside={toggleNotifAside} toggleAside={toggleAside} isAsideVisible={isSomeAside} isNormalAsideVisible={isAsideVisible} title="Salas"/>
      < Aside isDirector={roles.includes("1")} isVisible={isAsideVisible} toggleNotifAside={toggleNotifAside} toggleAside={toggleAside}/>
      < AsideNotifications toggleNotifAside={toggleNotifAside} isVisible={isAsideNotifVisible} toggleAside={toggleAside} />
      < Room canModify={(roles.includes("1") || roles.includes("2") || roles.includes("4"))}/>
      < Footer />
    </>
  );
};

