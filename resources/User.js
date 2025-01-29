import { getPool } from '../utils/db.js'
import bcrypt from 'bcrypt'
import { generarUsuarioContrasena, readConfig } from '../utils/utils.js'

class User {
  constructor() {
    this.pool = getPool();
  }

  async getUserById(id) {
    return new Promise(async (resolve, reject) => {
      try {
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

        if (user[0].length == 0) {
          reject({ error: "User Not Found" })
          return
        }
        resolve(user[0])
      } catch (err) {
        console.log("error:", err)
        reject(err)
      }
    })
  }

  async getUsers(options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit = 10, page = 1, name = "", rol = "" } = options
        const offset = (page - 1) * limit
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
      WHERE LOWER(u.name) LIKE LOWER(?)
      ${rol ? "AND LOWER(r.name) = LOWER(?)" : ""}
      GROUP BY
        u.id
      LIMIT ? OFFSET ?;`

        const queryParams = [`%${name}%`]
        if (rol) { queryParams.push(rol.toLowerCase()); } queryParams.push(limit, offset);

        const users = await this.pool.query(selectQuery, queryParams)
        if (users[0].length == 0) {
          resolve([])
          return
        }
        resolve(users[0])
      } catch (err) {
        console.log("error:", err)
        reject(err)
      }
    })
  }

  async registerUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          name,
          roles
        } = user;

        //Comprobando si hay campos en blanco
        if (!name || typeof (roles) == 'undefined') {
          reject({ error: "Must cover all fields" })
          return
        }

        for (let rol of roles) {
          console.log("rol: ", rol)
          if (rol < 1 || rol > 4) {
            reject({ error: "Invalid Rol" })
            return
          }
        }

        await this.pool.query('START TRANSACTION');

        //Comprobando si ya existe el nombre:
        let [results] = await this.pool.query('SELECT * FROM User WHERE name = ?', [name])
        console.log(results.length)
        if (results.length != 0) {
          reject({ error: "Name already exist" })
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
        if (userResult.affectedRows === 0) {
          reject({ error: "User Insertion Failed" })
          return
        }
        const userId = userResult.insertId;

        //Insersion en la tabla Password_History:
        const password_json = `[{"password": "${hasedPassword}", "date": "${new Date().toISOString()}"}]`
        const insertQuery = "INSERT INTO Password_History (passwords, user_id) VALUES (?, ?)"
        const insertQueryResult = await this.pool.query(insertQuery, [password_json, userId])
        if (insertQueryResult.affectedRows === 0) {
          reject({ error: "User Insertion Failed" })
          return
        }
        //Insertar Roles:
        for (let rolId of roles) {
          let insertedRol = await this.pool.query('INSERT INTO User_Rol (user_id, rol_id) VALUES (?, ?)', [userId, rolId])
          if (insertedRol[0].affectedRows === 0) {
            reject({ error: "Error while inserting user roles" })
            return
          }
        }

        await this.pool.query('COMMIT');
        console.log('Patient inserted successfully');
        resolve({ success: true, message: "User successfully created", username, password })
      } catch (err) {
        await this.pool.query('ROLLBACK');
        reject(err)
      }
    })
  }

  async deleteUser(user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteFromUser = "DELETE FROM User WHERE id = ?"
        const deleteFromUser_Rol = "DELETE FROM User_Rol WHERE user_id = ?"
        const deleteFromPasswordHistory = "DELETE FROM Password_History WHERE user_id = ?"

        const result1 = await this.pool.query(deleteFromPasswordHistory, [user_id])
        const result2 = await this.pool.query(deleteFromUser_Rol, [user_id])
        const result3 = await this.pool.query(deleteFromUser, [user_id])

        return resolve({ success: true })
      } catch (err) {
        console.log(err)
        return reject({ success: false, error: "Something went wrong" })
      }
    })
  }

  async searchUsersByName(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = "SELECT * FROM User WHERE LOWER(name) LIKE LOWER('%?%')"
        const result = await this.pool.query(q)
        console.log("USEEEEERS:", result[0])
        return resolve({ success: true, results: result[0] })
      } catch (err) {
        console.log(err)
        return reject({ success: false, error: "Something went wrong" });
      }
    })
  }

  async getInactiveUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.pool.query("SELECT name, username FROM User WHERE last_login = created")
        if (result[0].length === 0) {
          return reject({ success: false, error: "There are no inactive Users or Something went wrong" })
        } else {
          const users = result[0]
          return resolve({ success: true, users })
        }
      } catch (err) {
        console.log(err)
        return reject({ success: false, error: "Something Went Wrong" })
      }
    })
  }

  async isLogged(username, iat) {
    return new Promise(async (resolve, reject) => {
      try {
        const userLastLogout = await this.pool.query("SELECT last_logout from User WHERE username = ?", [username])
        const last_logout = userLastLogout[0][0].last_logout
        if (last_logout != "null" && iat > last_logout) {
          return resolve({ success: true })
        } else {
          return reject({ success: false })
        }
      } catch (err) {
        console.log(err)
        return reject({ success: false })
      }
    })
  }
async loginUser(password, username, ip) {
  return new Promise(async (resolve, reject) => {
    try {
      // IP BAN
      const maxAttempts = readConfig().MAX_LOGIN_ATTEMPTS;
      const banDurationMinutes = readConfig().BAN_IP_TIME_MINUTES;
      let existingRecord;

      try {
        // 1. Buscar si la IP ya tiene registros
        const query = await this.pool.query("SELECT * FROM login_bans WHERE ip_address = ?", [ip]);
        existingRecord = query[0]?.[0];
        if (existingRecord && existingRecord.is_banned) {
          // 1.1 La IP ya está baneada, comprobar si el baneo ha expirado
          console.log(existingRecord.ban_end_time);
          console.log(new Date());
          if (new Date(existingRecord.ban_end_time) > new Date()) {
            return resolve({
              success: false,
              error: "Too many failed attempts, your IP is banned!",
              status: "blocked",
            });
          } else {
            // 1.2 El baneo ha expirado, actualizar el registro y continuar
            await this.pool.query(
              "UPDATE login_bans SET attempts = ?, is_banned = ?, ban_end_time = NULL, ban_start_time = NULL WHERE ip_address = ?",
              [1, false, ip]
            );
          }
        }
      } catch (error) {
        console.error("Error handling login attempt:", error);
        return resolve({
          success: false,
          error: "Internal Server Error",
          status: "error",
        });
      }

      // Obtener el hash de la contraseña para el Usuario: username
      const getHashQuey = "select password, GROUP_CONCAT(DISTINCT Rol.id) as rol, tryes as tries, blocked as block from User join User_Rol on User.id = User_Rol.user_id join Rol on User_Rol.rol_id = Rol.id where username = ?;"
      const getHashQueyResult = await this.pool.query(getHashQuey, [username]);
      let tries;
      let block;
      let hash;
      let rol;
      if (getHashQueyResult[0].length != 0 && getHashQueyResult[0][0].password != null) {
        hash = getHashQueyResult[0][0].password;
        rol = getHashQueyResult[0][0].rol;
        tries = getHashQueyResult[0][0].tries;
        block = getHashQueyResult[0][0].block;
        console.log(getHashQueyResult);
        let isValidPassword = await bcrypt.compare(password, hash);
        if (isValidPassword) {
          // Reiniciar los intentos
          await this.pool.query(
            "UPDATE login_bans SET attempts = ?, is_banned = ?, ban_end_time = NULL, ban_start_time = NULL WHERE ip_address = ?",
            [1, false, ip]
          );
          return resolve({ success: true, "roles": rol, message: "Valid User", status: "logged" });
        }
      }

      // La IP no existe en la tabla, crear un nuevo registro si no se encuentra un match de IP ban
      if (!existingRecord) {
        await this.pool.query("INSERT INTO login_bans (ip_address) VALUES (?)", [ip]);
      }

      // Aumentar el conteo de intentos y verificar si debe banear la IP
      const newAttempts = existingRecord ? existingRecord.attempts + 1 : 1;
      await this.pool.query(
        "UPDATE login_bans SET attempts = ?, attempt_time = ? WHERE ip_address = ?",
        [newAttempts, new Date(), ip]
      );
      if (newAttempts >= maxAttempts) {
        // Banear la IP si supera el límite de intentos
        const banEndTime = new Date();
        banEndTime.setMinutes(banEndTime.getMinutes() + banDurationMinutes);
        await this.pool.query(
          "UPDATE login_bans SET is_banned = ?, ban_start_time = ?, ban_end_time = ? WHERE ip_address = ?",
          [true, new Date(), banEndTime, ip]
        );

        return resolve({
          success: false,
          error: "Too many failed attempts, your IP has been banned!",
          status: "blocked",
        });
      }

      // Devolver error general de login fallido
      return resolve({
        success: false,
        error: "Wrong Credentials",
        status: "nologged",
      });

    } catch (err) {
      reject({ success: false, err });
      return;
    }
  });
}



  async logoutUser(username, iat) {
    return new Promise(async (resolve, reject) => {
      try {
        const logoutQuery = "UPDATE User SET last_logout = ? WHERE username = ?"
        const result = await this.pool.query(logoutQuery, [iat, username])
        if (result[0].affectedRows != 0) {
          return resolve({ success: true })
        } else {
          return reject({ success: false, error: "Undefined Error" })
        }
      } catch (err) {
        console.log(err)
        return reject({ success: false, error: "Undefined Error" })
      }
    })
  }

  async changePassword(username, passwords,ip) {
    return new Promise(async (resolve, reject) => {
      try {
        const { password, lastPassword } = passwords
        //Comprobar si la contraseña es correcta:
        const login = await this.loginUser(lastPassword, username, ip)
        console.log("LOOOGIN:", login)
        if (!login.success) {
          return reject({ success: false, error: "Invalid Password" })
        }
        //Recuperar el id y todas las contraseñas del historial para el usario username:
        const getPasswordsQuery = "SELECT passwords, User.id FROM User JOIN Password_History ON User.id = Password_History.user_id WHERE User.username = ?"
        const getPasswordsQueryResult = await this.pool.query(getPasswordsQuery, [username])
        if (getPasswordsQueryResult[0].length === 0) {
          reject({ success: false, error: "Bad request" })
        } else {
          //Crear el nuevo array del historial de contraseñas:
          const user_id = getPasswordsQueryResult[0][0].id
          let history_passwords = JSON.parse(getPasswordsQueryResult[0][0].passwords)
          //Comprobar si ya ha usado esta contraseña
          history_passwords.forEach(async pass => {
            const match = await bcrypt.compare(password, pass.password)
            if (match) {
              reject({ success: false, error: "Password used, try another" })
              return
            }
          })
          const hasedPassword = await bcrypt.hash(password, 10)
          //Cambiar contraseña:
          const updatePasswordQuery = `UPDATE User SET password = ? WHERE username = ?`
          const updatePasswordQueryResult = await this.pool.query(updatePasswordQuery, [hasedPassword, username])
          if (updatePasswordQueryResult.affectedRows === 0) {
            reject({ success: false, error: "Something went wrong" })
          }
          //Actualizar historial de contraseñas:
          const newEntry = { password: `${hasedPassword}`, date: `${new Date().toISOString()}` }
          history_passwords.push(newEntry)
          //Comprobar que el historial solo conserve las ultimas 24 contraseñas:
          if (history_passwords.length > 24) {
            history_passwords.shift()
          }
          const updateHistoryQuery = `UPDATE Password_History SET passwords = ? WHERE user_id = ?`
          const updateHistoryQueryResult = this.pool.query(updateHistoryQuery, [JSON.stringify(history_passwords), user_id])
          resolve({ success: true, message: "Password successfully changed" })
        }
      } catch (err) {
        console.log(err)
        reject({ success: false, error: "Something went wrong" })
        return
      }
    })
  }

  async getBestDoctor() {
    return new Promise(async (resolve, reject) => {
      try {
        const getBestDoctorQuery = `
				WITH UserOperations AS (
    		SELECT
        		u.name,
        		COUNT(o.id) AS total_operations,
        		SUM(CASE WHEN o.results = 'positive' THEN 1 ELSE 0 END) AS positive_operations
    		FROM
        		User u
    		JOIN
        		Operation o ON u.username = o.responsable
    		WHERE
        		o.made = true
    		GROUP BY
        		u.name
						),
						UserAverages AS (
    		SELECT
        		name,
        		positive_operations,
        		total_operations,
        		(positive_operations / total_operations) * 100 AS average_positive
    		FROM
        		UserOperations
						)
				SELECT
    				name,
    				total_operations,
    				positive_operations,
   				 	average_positive
				FROM
    				UserAverages
				WHERE
    				average_positive = (
        SELECT
            MAX(average_positive)
        FROM
            UserAverages
    		);`
        const results = await this.pool.query(getBestDoctorQuery)
        if (results[0].length === 0) {
          return reject({ success: false, error: "Something went wrong" })
        }
        const result = results[0]
        return resolve({ success: true, result })
      } catch (err) {
        console.log(err)
        reject({ success: false, error: "Something went wrong" })
      }
    })
  }

  async getUrgentsMonth(month, year) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
					SELECT COUNT(*) AS cantidad_operaciones_urgencia
					FROM Operation
					WHERE priority = 0
  				AND MONTH(request_date) = ?
  				AND YEAR(request_date) = ?;
				`
        const results = await this.pool.query(query, [month, year])
        const result = results[0]
        return resolve({ success: true, result })
      } catch (err) {
        console.log(err)
        return reject({ success: false })
      }
    })
  }

  async getUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const selectQuery = `SELECT
          u.id AS id,
          u.name AS name,
          r.name AS rol,
          u.department as depa
        FROM
          User u
        JOIN
          User_Rol ur
        ON
          u.id = ur.user_id
        JOIN
          Rol r
        ON ur.rol_id = r.id
        WHERE u.username = ?`

        const user = await this.pool.query(selectQuery, [username])

        if (user[0].length == 0) {
          reject({ error: "User Not Found" })
          return
        }
        resolve(user[0])
      } catch (err) {
        console.log("error:", err)
        reject(err)
      }
    })
  }

async updateUser({ id, name, username, rol }) {
  try {
    const query = `UPDATE User SET name = ?, username = ? WHERE id = ?`;
    const values = [name, username, id];

    const rolQuery = `SELECT id FROM Rol WHERE name = ?`;
    const [rolResult] = await this.pool.query(rolQuery, [rol]);
    
    if (rolResult.length === 0) {
      throw new Error('Rol no encontrado');
    }

    const rolId = rolResult[0].id;

    const secondQuery = `DELETE FROM User_Rol WHERE user_id = ?`

    const thirdQuery = `INSERT INTO User_Rol (user_id, rol_id) VALUES (?, ?)`;
    const thirdValues = [id, rolId];

    await this.pool.query(query, values);
    await this.pool.query(secondQuery,[id])
    await this.pool.query(thirdQuery, thirdValues);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
};


}

export default User;
