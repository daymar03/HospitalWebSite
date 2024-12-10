import { getPool } from '../utils/db.js'
import bcrypt from 'bcrypt'
import { generarUsuarioContrasena } from '../utils/utils.js'

class User {
  constructor(){
    this.pool = getPool();
  }

  async getUserById(id){
    return new Promise(async (resolve, reject)=>{
      try{
      const selectQuery = `SELECT
          u.id AS id,
          u.name AS name,
          u.username AS username,
          r.name AS rol
        FROM
          User u
        JOIN
          User_Rol ur
        ON
          u.id = ur.user_id
        JOIN
          Rol r
        ON ur.rol_id = r.id
        WHERE u.id = ?`

        const user = await this.pool.query(selectQuery, [id])

        if(user[0].length == 0){
          reject({error: "User Not Found"})
          return
      }
        resolve(user[0])
      } catch (err) {
        console.log("error:", err)
        reject(err)
      }
    })
  }

  async getUsers(){
    return new Promise(async (reject, resolve)=>{
      try{
    const selectQuery = `SELECT
        u.id AS id,
        u.name AS name,
        u.username AS username,
        GROUP_CONCAT(DISTINCT r.name ORDER BY r.name ASC) AS rol
      FROM
        User u
      JOIN
        User_Rol ur
      ON
        u.id = ur.user_id
      JOIN
        Rol r
      ON ur.rol_id = r.id
      GROUP BY
        u.id`

      const users = await this.pool.query(selectQuery)
      if (users[0].length == 0){
        reject({error: "Database Query Failed"})
        return
      }
      resolve(users[0])
      } catch(err){
        console.log("error:", err)
        reject(err)
      }
    })

  }

  async registerUser(user){
    return new Promise(async (resolve, reject)=>{
    try{
      const {
        name,
        roles
      } = user;

//Comprobando si hay campos en blanco
      if ( !name || typeof(roles) == 'undefined'){
        reject({error: "Must cover all fields"})
        return
      }

      for(let rol of roles){
        console.log("rol: ",rol)
        if (rol < 1 || rol > 3){
          reject({error: "Invalid Rol"})
          return
        }
      }

      await this.pool.query('START TRANSACTION');

//Comprobando si ya existe el nombre:
      let [results] = await this.pool.query('SELECT * FROM User WHERE name = ?', [name])
      console.log(results.length)
      if (results.length != 0){
        reject({error: "Name already exist"})
        return
      }

//Generando Usuario y Contraseña:
      let { username, password } = generarUsuarioContrasena(name)

//Comprobando si ya existe el username:
      results = await this.pool.query('SELECT * FROM User WHERE username = ?', [username])
      while (results.length == 0) {
        let { username, password } = generarUsuarioContrasena(name)
        results = await this.pool.query('SELECT * FROM User WHERE username = ?', [username])
      }

//Hasheando la contraseña:
      const hasedPassword = await bcrypt.hash(password, 10)

//Comprobando el historial de contaseñas:
//      const getPasswordsQuery = "SELECT passwords FROM User JOIN Password_History ON User.id = Password_History.user_id WHERE User.username = ?" 
//      const getPasswordsQueryResult = await this.pool.query(getPasswordsQuery, [username])
//Insersion en la tabla User:
      const result = await this.pool.query('INSERT INTO User (name, username, password) VALUES (?, ?, ?)',
        [name, username, hasedPassword])
      const userResult = result[0]
      if(userResult.affectedRows === 0){
        reject({error: "User Insertion Failed"})
        return
      }
      const userId = userResult.insertId;

//Insersion en la tabla Password_History:
      const password_json = `[{"password": "${hasedPassword}", "date": "${new Date().toISOString()}"}]`
      const insertQuery = "INSERT INTO Password_History (passwords, user_id) VALUES (?, ?)"
      const insertQueryResult = await this.pool.query(insertQuery, [password_json, userId])
      if (insertQueryResult.affectedRows === 0){
        reject({error: "User Insertion Failed"})
        return
      }
//Insertar Roles:
      for (let rolId of roles){
        let insertedRol = await this.pool.query('INSERT INTO User_Rol (user_id, rol_id) VALUES (?, ?)', [userId, rolId])
        if (insertedRol[0].affectedRows === 0){
          reject({error: "Error while inserting user roles"})
          return
        }
      }

      await this.pool.query('COMMIT');
      console.log('Patient inserted successfully');
      resolve({success: true, message: "User successfully created", username, password})
      } catch (err) {
        await this.pool.query('ROLLBACK');
        reject(err)
      }
    })
  }

  async loginUser(password, username){
    return new Promise(async (resolve, reject)=>{
      try {
//Obtener el hash de la contraseña para el Usuario: username
        const getHashQuey = "select password, GROUP_CONCAT(DISTINCT Rol.id) as rol from User join User_Rol on User.id = User_Rol.user_id join Rol on User_Rol.rol_id = Rol.id where username = ?;"
        const getHashQueyResult = await this.pool.query(getHashQuey, [username])
        let hash
        let rol
        if (getHashQueyResult[0].length != 0){
          hash = getHashQueyResult[0][0].password
          rol = getHashQueyResult[0][0].rol
          let isValidPassword = await bcrypt.compare(password, hash)
          console.log(isValidPassword)
          if (isValidPassword){
            resolve({success : true, "roles":rol, message: "Valid User"})
          } else{
            resolve({success: false, message: "Invalid Username or Password"})
          }
        } else {
          reject({success: false, message: "Invalid Username or Password"})
          return
       }
      } catch(err){
        reject({success: false, err})
        return
      }
    })
  }

  async changePassword(username, password){
    return new Promise(async (resolve, reject)=>{
      try{
//Recuperar el id y todas las contraseñas del historial para el usario username:
        const getPasswordsQuery = "SELECT passwords, User.id FROM User JOIN Password_History ON User.id = Password_History.user_id WHERE User.username = ?" 
        const getPasswordsQueryResult = await this.pool.query(getPasswordsQuery, [username])
        if (getPasswordsQueryResult[0].length === 0){
          reject({success: false, message: "Bad request"})
        } else{
//Crear el nuevo array del historial de contraseñas:
          const user_id = getPasswordsQueryResult[0][0].id
          let history_passwords = JSON.parse(getPasswordsQueryResult[0][0].passwords)
//Comprobar si ya ha usado esta contraseña
          history_passwords.forEach(async pass =>{
            const match = await bcrypt.compare(password, pass.password)
            if (match){
              reject({success:false, message: "Password used, try another"})
              return
            }
          })
          const hasedPassword = await bcrypt.hash(password, 10)
//Cambiar contraseña:
          const updatePasswordQuery = `UPDATE User SET password = ? WHERE username = ?`
          const updatePasswordQueryResult = await this.pool.query(updatePasswordQuery, [hasedPassword, username])
          if (updatePasswordQueryResult.affectedRows === 0){
            reject({success: false, message: "Something went wrong"})
          }
//Actualizar historial de contraseñas:
          const newEntry = {password: `${hasedPassword}`, date: `${new Date().toISOString()}`}
          history_passwords.push(newEntry)
//Comprobar que el historial solo conserve las ultimas 24 contraseñas:
          if (history_passwords.length > 24){
            history_passwords.shift()
          }
          const updateHistoryQuery = `UPDATE Password_History SET passwords = ? WHERE user_id = ?`
          const updateHistoryQueryResult = this.pool.query(updateHistoryQuery, [JSON.stringify(history_passwords), user_id])
          resolve({success: true, message:"Password successfully changed"})
        }
      } catch(err){
        reject({success: false, message: "Something went wrong"})
        return
      }
    })
  }
}

export default User;
