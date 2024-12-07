import { getPool } from './db.js'
import bcrypt from 'bcrypt'
import { generarUsuarioContrasena } from './utils.js'

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
        r.name AS rol
      FROM
        User u
      JOIN
        User_Rol ur
      ON
        u.id = ur.user_id
      JOIN
        Rol r
      ON ur.rol_id = r.id`

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

//Insersion en la tabla User:
      const result = await this.pool.query('INSERT INTO User (name, username, password) VALUES (?, ?, ?)',
        [name, username, hasedPassword])
      const userResult = result[0]
      if(userResult.affectedRows === 0){
        reject({error: "User Insertion Failed"})
        return
      }
      const userId = userResult.insertId;

//Insertar Roles:
      for (let rolId of roles){
        let insertedRol = await this.pool.query('INSERT INTO User_Rol (user_id, rol_id) VALUES (?, ?)', [userId, rolId])
        if (insertedRol.affectedRows === 0){
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


}

export default User;
