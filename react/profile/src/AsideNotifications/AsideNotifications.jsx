import { useState, useEffect } from 'react'
import { formatDate } from '../utils/formatDate.js'
import { deleteNotif } from '../utils/deleteNotif.js'
import './AsideNotifications.css'

export function AsideNotifications({toggleNotifAside, isVisible, toggleAside}) {
  const left = isVisible ? 0 : -370
  const NOTIFICATION_URL = "http://localhost:3000/api/notifications"
  const READ_NOTIFICATION_URL = "http://localhost:3000/api/notifications/read"

  const [noti, setNoti] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(()=>{
    fetch(NOTIFICATION_URL)
      .then(res=>res.json())
      .then(data=>{
        setNoti(data)
        setLoading(false)
      })
      .catch(err=>{
        setError(err)
        setLoading(false)
      })
  }, [])

  if (loading){
    return (<div>cargando...</div>)
  }

  if (error){
    return(<div>...error: {error}</div>)
  }

  const showAside = ()=>{
    toggleAside()
    toggleNotifAside()
  }


  const style = {left}

  function Notification({ Id = "1", title = "Titulo", date = "", body = "", read = false }) {
    const [isFocused, setIsFocused] = useState(read);
    const [isReaded, setIsReaded] = useState(false)

    useEffect(() => {
      if (isFocused && read === false) {
        const data = { "notification_id": Id };
        fetch(READ_NOTIFICATION_URL, {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(res => console.log(res))
        .catch(err => console.error(err));
      }
    }, [isFocused, Id, read]);

    const toggleNotification = () => {
      if (!isFocused){
        setIsFocused(true);
      }
      setIsReaded(!isReaded)
    };

    const whiteSpace = isReaded ? "wrap" : "nowrap";
    const r = isFocused ? "green" : "red";
    const styleBody = { "whiteSpace": whiteSpace };
    const readed = { "borderBottom": `solid 1px ${r}` };

    const toggleDeleteNotif = async (event)=>{
      event.preventDefault()
      const action = await deleteNotif(Id)
      if (action) setNoti(action)
    }

    return (
      <div className="wm-notification-container">
        <button id={Id} className="wm-notification" onClick={toggleNotification} style={readed}>
          <div className="wm-notification-header">
            <span className="wm-notification-title">{title}</span>
            <span className="wm-notification-date">{date}</span>
          </div>
          <div className={`wm-notification-body ${whiteSpace}`} >
            {body}
          </div>
        </button>
        <form action="http://localhost:3000/api/notifications/delete" method="DELETE">
          <input type="hidden" value={Id} name="notification_id"/>
          <button type="submit" className="wm-notification-delete" onClick={toggleDeleteNotif}>
            <img className="wm-notification-icon" width="24" height="24" src="https://img.icons8.com/ios-glyphs/50/FA5252/filled-trash.png" alt="filled-trash"/>
          </button>
        </form>
      </div>
    );
  }

  return (
    <aside className="wm-aside" style={style}>
      <nav className="wm-aside-nav">
        <div className="wm-aside-close">
          <button className="wm-aside-close-button" onClick={showAside}>
            <img width="16" height="16" src="https://img.icons8.com/tiny-color/16/close-window.png" alt="close-window"/>
          </button>
        </div>
        <ul>
          { noti[0] &&
            noti.map(n=>(
              <li>
                < Notification title={n.title} date={formatDate(n.date)} body={n.body} Id={n.id} read={n.readed !== null} />
              </li>
            ))
          }
        </ul>
      </nav>
    </aside>
  )
}
