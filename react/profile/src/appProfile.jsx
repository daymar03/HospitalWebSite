import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import { Header } from './Header/Header.jsx'
import { Profile, ChangePassword, Personal } from './Profile/Profile.jsx'
import { Aside } from './Aside/Aside.jsx'
import { AsideNotifications } from './AsideNotifications/AsideNotifications.jsx'
import { Footer } from './Footer/Footer.jsx'
import './styles.css'
const USER_URL = "http://localhost:3000/api/users/self"
const USER_ROLE_URL = "http://localhost:3000/api/users/rol"

export function App(){
  const [isAsideVisible, setIsAsideVisible] = useState(false);
  const [isAsideNotifVisible, setIsAsideNotifVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [profInfo, setProfInfo] = useState({})
  const [roles, setRoles] = useState([])

  useEffect(()=>{
    fetch(USER_ROLE_URL)
    .then(res=>res.json())
    .then(res=>{
      setRoles(res.roles)
    })
  },[])


  useEffect(()=>{
    fetch( USER_URL )
      .then( res => res.json() )
      .then( data => {
        setProfInfo(data[0])
      })
  }, [])

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
      < Header downAsides={downAsides} toggleNotifAside={toggleNotifAside} toggleAside={toggleAside} isAsideVisible={isSomeAside} isNormalAsideVisible={isAsideVisible} title="Información"/>
      < Aside isDirector={roles.includes("1")} isVisible={isAsideVisible} toggleNotifAside={toggleNotifAside} toggleAside={toggleAside}/>
      < AsideNotifications toggleNotifAside={toggleNotifAside} isVisible={isAsideNotifVisible} toggleAside={toggleAside} />
      {profInfo.username && < Profile username={profInfo.username} role={profInfo.rol} depa={profInfo.depa}/>}
      < Personal name={profInfo.name} age="37" personalId="03040307891" province="Granma"/>
      < ChangePassword toggleModal={togglePasswordModal} isVisible={isPasswordModalVisible} />
      < Footer />
    </>
  );
};

