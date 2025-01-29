import { useState, useEffect } from 'react';
import { Table } from '../Table/Table.jsx';
import { WmModal } from '../Wm-Modal/Wm-Modal.jsx';
import './Admin.css';

// Tabla de manejo de usuarios:
// + Ver los usuarios
// + Agregar usuarios
// + Modificar usuarios
// + Eliminar usuarios

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [modalShowUserData, setModalShowUserData] = useState(false);
  const [userData, setUserData] = useState({});
  const [filteredName, setFilteredName] = useState("");
  const [filteredRole, setFilteredRole] = useState("");
  const [nextPageHasData, setNextPageHasData] = useState(true); // Nueva variable para verificar la siguiente página

  const incrementPage = () => {
    if (nextPageHasData) {
      setCurrentPage(currentPage + 1);
    }
  };

  const decrementPage = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleModalShowUserData = () => {
    setModalShowUserData(!modalShowUserData);
  };

  const getUsers = () => {
    setLoading(true);
    fetch(`/api/users?page=${currentPage}&name=${filteredName}&rol=${filteredRole}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);

        // Verificar si la siguiente página tiene datos
        fetch(`/api/users?page=${currentPage + 1}&name=${filteredName}&rol=${filteredRole}`)
          .then((nextRes) => nextRes.json())
          .then((nextRes) => {
            setNextPageHasData(nextRes.length > 0);
          });
      });
  };

  const postUser = () => {
    const name = document.querySelector("#name").value;
    const rol = [document.querySelector("#Director"), document.querySelector("#Doctor"), document.querySelector("#Nurse"), document.querySelector("#Recepcionist")];
    let roles = [];
    rol.map((r) => {
      if (r.checked) roles.push(r.value);
    });
    const user = { name, roles };
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserData(res);
          toggleModal();
          toggleModalShowUserData();
          getUsers(); // Llama a getUsers para actualizar la tabla
        }
      });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace' && (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA')) {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown); // Limpia el eventListener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    getUsers(filteredName);
  }, [filteredName, filteredRole]);

  useEffect(() => {
    getUsers();
  }, [currentPage]);

const [maxIp, setMaxIP] = useState('');
  const [maxPass, setMaxPass] = useState('');

  const handleMaxIPChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaxIP(value);
    }
  };

  const handleMaxPassChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaxPass(value);
    }
  };

  const postMaxLoginAtt = () => {
    fetch("/admin/setMaxLoginAtt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxIp: Number(maxIp) }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Max Login Attempts set successfully!');
      })
      .catch(error => console.error('Error:', error));
  };

  const postMaxPasswordSaved = () => {
    fetch("/admin/setMaxPasswordSaved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxPass: Number(maxPass) }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('Max Password Saved set successfully!');
      })
      .catch(error => console.error('Error:', error));
   };

  return (
    <>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={modalShowUserData} closeButton={{ open: true, toggleModal: toggleModalShowUserData }}>
        <p>Usuario Agregado Satisfactoriamente</p>
        <p>con el nombre de usuario: {userData.username}</p>
        <p>y la contraseña: {userData.password}</p>
      </WmModal>
      <WmModal classN="wm-modal-bg-white wm-modal-center" Open={isOpen} closeButton={{ open: true, toggleModal }}>
        <p className="wm-text-blue"><strong>INGRESAR NUEVO USUARIO</strong></p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start", minWidth: "100%" }}>
          <label htmlFor="name">Nombre:</label>
          <input style={{ marginTop: "8px", border: "none", borderRadius: "8px", borderBottom: "solid 1px #1977cc", minWidth: "94%" }} type="text" id="name" placeholder="Nombre del nuevo usuario" />
          <label style={{ marginTop: "8px" }}>Roles:</label>
          <div>
            <div style={{ display: "flex", padding: "0", margin: "0" }}>
              <input id="Director" value="1" type="checkbox" />
              <p>Director</p>
            </div>
            <div style={{ display: "flex", padding: "0", margin: "0" }}>
              <input id="Doctor" value="2" type="checkbox" />
              <p>Doctor</p>
            </div>
            <div style={{ display: "flex", padding: "0", margin: "0" }}>
              <input id="Nurse" value="3" type="checkbox" />
              <p>Enfermero/a</p>
            </div>
            <div style={{ display: "flex", padding: "0", margin: "0" }}>
              <input id="Recepcionist" value="4" type="checkbox" />
              <p>Recepcionista</p>
            </div>
          </div>
        </div>
        <button onClick={postUser} style={{ minWidth: "200px" }} className="wm-button wm-lightblue">INGRESAR USUARIO</button>
      </WmModal>
      <section style={{ overflow: "scroll", marginTop: "130px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 className="wm-text-blue">Panel de Administración de Usuarios</h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "90%" }}>
          <div className="wm-search-filters">
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="search">Buscar por nombre:</label>
              <input onChange={(e) => setFilteredName(e.target.value)} value={filteredName} style={{ marginLeft: "4px", border: "none", borderRadius: "8px", borderBottom: "solid 1px #1977cc", backgroundColor: "transparent" }} type="text" id="search" placeholder="Filtre por nombre aquí" />
            </div>
            <div>
              <select value={filteredRole} onChange={(e) => setFilteredRole(e.target.value)} id="search-roles" style={{ backgroundColor: "transparent", fontSize: "14px", minWidth: "90%" }} className="wm-select">
                <option value="" disabled selected>Filtre por Rol</option>
                <option value="">Todos</option>
                <option value="Admin">Admin</option>
                <option value="Director">Director</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Enfermero/a</option>
                <option value="Recepcionist">Recepcionista</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Página actual: </span>
              <button className="wm-button-pagination" style={{ color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", marginLeft: "10px" }} onClick={decrementPage}><i className="fas fa-backward"></i></button>
              <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>{currentPage}</div>
              <button className="wm-button-pagination" style={{ color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", marginRight: "10px" }} onClick={incrementPage} disabled={!nextPageHasData}><i className="fas fa-forward"></i></button>
            </div>
          </div>
          {!loading && <Table d={data} get={getUsers} />}
          <button onClick={toggleModal} style={{ minWidth: "300px" }} className="wm-button wm-lightblue">INGRESAR NUEVO USUARIO</button>
      <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', padding: '10px' }}>
        <label  style={{marginBottom: '2px'}} htmlFor="maxIP">Número máximo de intentos de inicio de sesión:</label>
        <input
          type="text"
          id="maxIP"
          value={maxIp}
          onChange={handleMaxIPChange}
          placeholder="6"
        />
        <button 
          onClick={postMaxLoginAtt} 
          style={{ minWidth: "300px", marginTop: '10px' }} 
          className="wm-button wm-lightblue"
        >
          CAMBIAR
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', padding: '10px' }}>
        <label style={{marginBottom: '2px'}} htmlFor="maxPass">Número máximo de contraseñas guardadas:</label>
        <input
          type="text"
          id="maxPass"
          value={maxPass}
          onChange={handleMaxPassChange}
          placeholder="24"
        />
        <button 
          onClick={postMaxPasswordSaved} 
          style={{ minWidth: "300px", marginTop: '10px' }} 
          className="wm-button wm-lightblue"
        >
          CAMBIAR
        </button>
      </div>
    </div>
        </div>
      </section>
    </>
  );
}

