
## Requerimientos
#### 1- Se solicita usuario y contraseña para la autenticación de acceso.

#### Implementación de un panel de Inicio de Sesión sencillo.
---
![[req-1 1.png]]


---



#### 2- Todas las páginas o recursos requieren autenticación excepto aquellas que son públicas.

La ruta pública por defecto es /login.

``` javascript
const Rol = {
  "Admin": {
    "permisions": {
      "get": {
        "template":{
					"/": true,
          "/admin": true,
          "/informacion": false,
          "/login":true,
          "/repitlogin": false,
          "/salas": false,
					"/permissionDenied": true,
					"/changepassword": true,
          "/profile": false,
          "/director" : false,
          "/operaciones" : false
        },
        "patient" : false,
        "user" : true,
        "notification" : true,
        "operation" : false
      },
      "post": {
        "patient" : false,
        "user" : true,
        "notification" : false,
        "operation" : false
      },
      "patch": {
        "patient" : false,
        "user" : true,
        "notification" : false,
        "operation" : false
      },
      "delete": {
        "patient" : false,
        "user" : true,
        "notification" : true,
        "operation" : true
      }
    }
  },
  "Doctor": {
    "permisions": {
      "get": {
        "template":{
					"/": true,
          "/admin": false,
          "/informacion": true,
          "/login":true,
          "/repitlogin": true,
          "/salas": true,
					"/permissionDenied": true,
					"/changepassword": true,
          "/profile":true,
          "/director" : false,
          "/operaciones" : false
        },
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : true
      },
      "post": {
        "patient" : true,
        "user" : false,
        "notification" : false,
        "operation" : true
      },
      "patch": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : true
      },
      "delete": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : false
      }
		}
  },
  "Director": {
    "permisions": {
      "get": {
        "template":{
					"/": true,
          "/admin": false,
          "/informacion": true,
          "/login":true,
          "/repitlogin": true,
          "/salas": true,
					"/permissionDenied": true,
					"/changepassword": true,
          "/profile": true,
          "/director":true,
          "/operaciones" : true
        },
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      },
      "post": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : true
      },
      "patch": {
        "patient" : false,
        "user" : false,
        "notification" : true,
        "operation" : true
      },
      "delete": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : true
      }
    }
  },
  "Nurse": {
    "permisions": {
      "get": {
        "template":{
					"/": true,
          "/admin": false,
          "/informacion": true,
          "/login":true,
          "/repitlogin": true,
          "/salas": true,
					"/permissionDenied": true,
					"/changepassword": true,
          "/profile":true,
          "/director" : false,
          "/operaciones" : false
        },
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : false
      },
      "post": {
        "patient" : false,
        "user" : false,
        "notification" : false,
        "operation" : false
      },
      "patch": {
        "patient" : false,
        "user" : false,
        "notification" : true,
        "operation" : false
      },
      "delete": {
        "patient" : false,
        "user" : false,
        "notification" : true,
        "operation" : false
      }
    }
  },
  "Recepcionist": {
    "permisions": {
      "get": {
        "template":{
					"/": true,
          "/admin": false,
          "/informacion": true,
          "/login":true,
          "/repitlogin": true,
          "/salas": true,
					"/permissionDenied": true,
					"/changepassword": true,
          "/profile": true,
          "/director":false,
          "/operaciones" : false
        },
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      },
      "post": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : false
      },
      "patch": {
        "patient" : false,
        "user" : false,
        "notification" : true,
        "operation" : true
      },
      "delete": {
        "patient" : false,
        "user" : false,
        "notification" : true,
        "operation" : false
      }
    }
  },
}
```
---


#### 3- Implementa un mecanismo de bloqueo de usuario ante un número específico de intentos fallidos de acceso.

La tabla de usuarios contiene unos campos "tries" y "blocked" que son actualizados con cada intento fallido.

``` javascript
  async loginUser(password, username, ip) {
    return new Promise(async (resolve, reject) => {
      try {
        //Obtener el hash de la contraseña para el Usuario: username
        const getHashQuey = "select password, GROUP_CONCAT(DISTINCT Rol.id) as rol, tryes as tries, blocked as block from User join User_Rol on User.id = User_Rol.user_id join Rol on User_Rol.rol_id = Rol.id where username = ?;"
        const getHashQueyResult = await this.pool.query(getHashQuey, [username])
        let tries
        let block
        let hash
        let rol
        if (getHashQueyResult[0].length != 0 && getHashQueyResult[0][0].password != null) {
          hash = getHashQueyResult[0][0].password
          rol = getHashQueyResult[0][0].rol
          tries = getHashQueyResult[0][0].tries
          block = getHashQueyResult[0][0].block 
          console.log(getHashQueyResult)
          let isValidPassword = await bcrypt.compare(password, hash)
          if (isValidPassword) {
              // Reiniciar los intentos
                  await this.pool.query(
                    "UPDATE login_bans SET attempts = ?, is_banned = ?, ban_end_time = NULL, ban_start_time = NULL WHERE ip_address = ?",
                    [1, false, ip]
                  );
            return resolve({ success: true, "roles": rol, message: "Valid User", status: "logged" })
          } 
        }

```
---


``` sql
MariaDB [Hospital]> desc User;
+-------------+--------------+------+-----+---------------------+----------------+
| Field       | Type         | Null | Key | Default             | Extra          |
+-------------+--------------+------+-----+---------------------+----------------+
| id          | int(11)      | NO   | PRI | NULL                | auto_increment |
| name        | varchar(255) | YES  |     | NULL                |                |
| username    | varchar(255) | NO   | UNI | NULL                |                |
| password    | varchar(255) | NO   |     | NULL                |                |
| tryes       | int(11)      | YES  |     | 0                   |                |
| blocked     | tinyint(1)   | YES  |     | 0                   |                |
| department  | varchar(255) | YES  |     | NULL                |                |
| last_login  | timestamp    | YES  |     | NULL                |                |
| created     | timestamp    | YES  |     | current_timestamp() |                |
| last_logout | varchar(255) | YES  |     | NULL                |                |
+-------------+--------------+------+-----+---------------------+----------------+
10 rows in set (0,003 sec)
```
--- 

![[req3 1.png]]

---

#### 4- Implementa un mecanismo de bloqueo de direcciones IP ante un numero especifico de intentos fallidos.

Existe una tabla para el almacenamiento de las IP bloqueadas que se revisa antes de 

``` javascript
           // IP BAN
            const maxAttempts = readConfig().MAX_LOGIN_ATTEMPTS
            const banDurationMinutes = readConfig().BAN_IP_TIME_MINUTES
            try {
              // 1. Buscar si la IP ya tiene registros
              const query =  await this.pool.query("SELECT * FROM login_bans WHERE ip_address = ?",[ip]);
              const existingRecord = query[0]?.[0]
              if (existingRecord && existingRecord.is_banned) {
                // 1.1 La IP ya está baneada, comprobar si el baneo ha expirado
                console.log(existingRecord.ban_end_time)
                console.log(new Date())
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
              } else if (existingRecord) {
                // 2.1 La IP ya existe y no está baneada
                const newAttempts = existingRecord.attempts + 1;
                //2.2 Actualizar los intentos
                await this.pool.query(
                  "UPDATE login_bans SET attempts = ?, attempt_time = ? WHERE ip_address = ?",
                  [newAttempts, new Date(), ip]
                );
                if (newAttempts >= maxAttempts) {
                  // 3. La IP supera el límite de intentos, banearla
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
              } else {
                // 3. La IP no existe en la tabla, crear un nuevo registro
                await this.pool.query("INSERT INTO login_bans (ip_address) VALUES (?)", [
                  ip,
                ]);
              }
              // 4.  Devolver error general de login fallido
              return resolve({
                success: false,
                error: "Wrong Credentials",
                status: "nologged",
              });

```

---

``` sql
MariaDB [Hospital]> desc login_bans;
+----------------+--------------+------+-----+---------------------+----------------+
| Field          | Type         | Null | Key | Default             | Extra          |
+----------------+--------------+------+-----+---------------------+----------------+
| id             | int(11)      | NO   | PRI | NULL                | auto_increment |
| ip_address     | varchar(45)  | NO   | UNI | NULL                |                |
| attempt_time   | timestamp    | YES  | MUL | current_timestamp() |                |
| attempts       | int(11)      | YES  |     | 1                   |                |
| ban_start_time | timestamp    | YES  |     | NULL                |                |
| ban_end_time   | timestamp    | YES  | MUL | NULL                |                |
| is_banned      | tinyint(1)   | YES  | MUL | 0                   |                |
| reason         | varchar(255) | YES  |     | NULL                |                |
+----------------+--------------+------+-----+---------------------+----------------

MariaDB [Hospital]> select * from login_bans;
+----+-----------------------+---------------------+----------+---------------------+---------------------+-----------+--------+
| id | ip_address            | attempt_time        | attempts | ban_start_time      | ban_end_time        | is_banned | reason |
+----+-----------------------+---------------------+----------+---------------------+---------------------+-----------+--------+
|  1 | ::ffff:127.0.0.1      | 2025-01-27 10:12:20 |        5 | 2025-01-27 10:12:20 | 2025-01-27 10:17:20 |         1 | NULL   |
|  2 | ::ffff:192.168.245.89 | 2025-01-27 10:15:04 |        1 | NULL                | NULL                |         0 | NULL   |
+----+-----------------------+---------------------+----------+---------------------+---------------------+-----------+--------+
```

---

### 5- Es posible configurar el numero especificode intentos fallidos de acceso.

Se puede modificar el archivo config.json para cambiar el número de intentos fallidos.

```json
{"BAN_IP_TIME_MINUTES":5,"MAX_LOGIN_ATTEMPTS":5, "PASSWORD_HISTORY_SIZE":24}

```
---

#### 6-El número específico de intentos fallidos no supera los 6.

Existe una funcionalidad para ello.

``` javascript
export async function writeMaxLogins(num) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.join(__dirname, '..', 'config.json');
  let data = JSON.parse(fs.readFileSync(configPath));
  if (num.MAX_LOGIN_ATTEMPTS > 6) {
    data.MAX_LOGIN_ATTEMPTS = 6
  } else {
    data.MAX_LOGIN_ATTEMPTS = num.MAX_LOGIN_ATTEMPTS
  }
  try {
    fs.writeFileSync(configPath, JSON.stringify(data))
    return {success: true}
  } catch (err) {
    console.log(err)
    return { success: false, error: err }
  }
}
```
---

#### 7- Todos los controles de autenticación se realizarán en el servidor.

La autenticación está especificada en el archivo `/resources/User.js` que es enrutado por `/routers/userRouter`,  que a su vez es ejecutado por el servidor de NodeJs/Express. No existe nada similar en el lado del cliente.

``` javascript
// app.js (codigo principal del servidor)
import user from './routers/userRouter.js'
//OWN MIDDLEWARES
// fragmentos de codigo para la autenticacion
app.use(auth.haveSession.bind(auth))
app.use(auth.access.bind(auth))

//STATICS
app.use('/img', express.static(path.join('./static/', 'img')));
app.use('/assets', express.static(path.join('./static/', 'assets')));
app.use('/css', express.static(path.join('./static/', 'css')));
app.use('/js', express.static(path.join('./static/', 'js')));

//ENDPOINTS
app.use('/', router)

app.use('/api/patients', patient)

app.use('/api/users', user)

app.use('/api/operations', operation)

app.use('/api/notifications/', notification)

app.post("/api/users/change_max_try", auth.login, (req, res) => {
  const result = writeMaxLogins(req.body)
  if (result.success) {
   return res.json({ success: true })
  }
  return res.json({ success: false, error: result.error })
})

app.use(auth.login, (req, res, next) => {
  res.status(404).render(`${appPath}/templates/notFound.ejs`);
});

```

---

### 8- Permite a los usuarios hacer cambios de forma segura a sus credenciales.

Existe un botón de "Cambiar contraseña" en el perfil de usuario que implementa esta funcionalidad.

---


![[req7.png]]

---
#### 9- Se manejan adecuadamente el tiempo de vida de las sesiones en la base de datos.

Nuestra solución informática usa JWT o Json Web Tokens, y entre sus ventajas radica que no es necesario crear registros de las sesiones en la base de datos, no obstante el tiempo de vida del token y la imposibilidad de modificacion de este se especifican en el servidor:

---

``` javascript
      res.cookie('access_token', jwt,{ //testing
        expires: new Date(expirationTimeAccess * 1000),
        httpOnly: true 
      })
 // El tiempo de vida de un JWT no puede ser cambiado sin que esto pase inadvertido por el servidor
```
---

#### 10- No se almacenan contraseñas en texto plano o en espacios lógicos que permitan el acceso o modificación por personas no autorizadas.

Las contraseñas son almacenadas en la base de datos como un hash generado usando la función criptográfica `bcrypt` .

---
``
```sql
MariaDB [Hospital]> select id,username,password from User;
+----+----------+--------------------------------------------------------------+
| id | username | password                                                     |
+----+----------+--------------------------------------------------------------+
|  1 | daymar03 | $2b$10$0W5iVmqFI3fI8Z6Ygd0SSedjPNObb..fN6JOr6D.q861qVSdufSGq |
|  2 | calanac  | $2b$10$swpXGMambxQNiPSEVKydhumP49qw2X7XLFkkgGVlvuSwaXeDJz04G |
|  3 | amateo   | $2b$10$O4JkUDtw1xNkcCXl2CisNucJK9xpGibs0nXc1l2VzOuuO7HjuV2Em |
|  4 | ffrias   | $2b$10$ceeJCq2klpPp36CNoeeR7OaRP5syBS/9yZQCQqgxS6DLZXvmShSDe |
|  5 | marca    | $2b$10$wwlmSunz5nbwfAvOx.hCjuxdiV6MrhXzntk22It7mrvHPV1JWaLoC |
|  6 | anamlh   | $2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy |
|  7 | lagp     | $2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy |
|  8 | lmr      | $2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy |
|  9 | cet      | $2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy |
| 10 | cjr      | $2b$10$3eUiWvJW1HP8p4h5xiPt3OySGyeH34MLTMQunVOcZwTq80ezqeeyy |
+----+----------+--------------------------------------------------------------+
10 rows in set (0,001 sec)
```
---

#### 11- Las cuentas contenedoras de objetos no serán usadas por la solución informática para conectarse a la base de datos, en su lugar, se usará otra cuenta, con un subconjunto de privilegios válidos para realizar el trabajo de la solución informática.
---

Para la conexión a la base de datos se usa una cuenta "admin" independiente para realizar las consultas:

``` sql
MariaDB [(none)]>   SHOW GRANTS FOR 'admin'@'localhost';
+--------------------------------------------------------------------------------------------------------------+
| Grants for admin@localhost                                                                                   |
+--------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `admin`@`localhost` IDENTIFIED BY PASSWORD '*4ACFE3202A5FF5CF467898FC58AAB1D615029441' |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `Hospital`.* TO `admin`@`localhost`                                  |
+--------------------------------------------------------------------------------------------------------------+
2 rows in set (0,001 sec)
```
---

#### 12- Se garantiza que las contraseñas cumplan los requisitos de complejidad: tener combinaciones de letras minúsculas, letras mayúsculas, números y caracteres especiales.

Se define en el servidor un esquema para las contraseñas de usuario usando expresiones regulares:

---

![[req12.png]]

---

``` javascript
import z from 'zod'

export const passwordSchema = z.string()
  .min(24, { message: "La contraseña debe tener más de 24 caracteres" })
  .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
  .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
  .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
  .regex(/[\W_]/, { message: "La contraseña debe contener al menos un símbolo" });
```
---

#### 13- La longitud mínima de una contraseña es de ocho caracteres.

Tal como se ve en el código expuesto en el requisito Nº 12, tiene una longtud mínima de 24 caracteres.

---
#### 14- Se controla el historial de contraseñas, el cual es configurable con un mínimo de veinicuatro contraseñas.

La cantidad máxima de contraseñas que se almacenan se encuentra en el config.json,  y se puede modificar con la siguiente funcionalidad:

``` javascript
export async function writePasswordHistorySize(size) {
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   const configPath = path.join(__dirname, '..', 'config.json');
   let data = JSON.parse(fs.readFileSync(configPath));
   
   // Actualizar PASSWORD_HISTORY_SIZE
   data.PASSWORD_HISTORY_SIZE = size;
   
   try {
       fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
       return {success: true};
   } catch (err) {
       console.log(err);
       return { success: false, error: err };
   }
}
```
---
Aquí se ve el funcionamiento del historial en sí mismo:

``` javascript
  async changePassword(username, passwords,ip) {
    return new Promise(async (resolve, reject) => {
      try {
        let passwordHistorySize = readConfig().PASSWORD_HISTORY_SIZE;
        // Verificar que conserve al menos 24
        if (passwordHistorySize < 24) {
         passwordHistorySize = 24
        }
        const { password, lastPassword } = passwords
        //Comprobar si la contraseña es correcta:
        const login = await this.loginUser(lastPassword, username, ip)
        console.log("LOOOGIN:", login)
        if (!login.success) {
          return reject({ success: false, error: "Invalid Password" })
        }
        //Recuperar el id y todas las contraseñas del historial para el usuario username:
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
          //Comprobar que el historial solo conserve las ultimas N >= 24 contraseñas:
          if (history_passwords.length > PasswordHistorySize) {
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
```
---
#### 15- Se usará la implementación del control de sesiones que poseen los frameworks.

Se usa el framework `express` con la biblioteca `jose` para controlar la sesiones por medio de los Json Web Tokens.

#### 16- Las sesiones en el servidor serán destruidas cuando los usuarios se desconecten.
---
Por la misma razón  expuesta en el requisito Nº 9, la sesión viene determinada por el JWT almacenado en el navegador (ya sea en localStorage o como una cookie). Efectivamente son eliminados una vez se desconecte:


``` javascript
const result = await User_Endpoints.logoutUser(username, logoutTime)
if(result.success){
 res.clearCookie('access_token')
 res.clearCookie('refresh_token').redirect('/login')
```
---
#### 17- Las páginas que requieran autenticación para acceder a ella tendrán un vínculo para cerrar sesión.
![[req17.png]]

---
``` javascript
<form action="/api/users/logout" method="POST">
  <button type="submit" className="wm-header-close" title="Cerrar sesión">
    <i className="fas fa-sign-out-alt"/>  
  </button>
</form>

```
---

#### 18- Solo se permitirá el envio del identificador de sesión en las cookies, prohibiendo su uso en URLS, mensajes de error o trazas.

Solo se realiza por medio de la cabecera HTTP Set-Cookie:

```
HTTP/1.1 302 Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxtciIsInJvbGVzIjoiMiIsImV4cCI6MTczODYwNjQwNywiaWF0IjoxNzM4MDAxNjA3fQ.u-4gEJTKJk4mLZcgtZjpJhWK4nBSxawuh1fQZdcpK-w; Path=/; Expires=Mon, 27 Jan 2025 18:28:27 GMT
Set-Cookie: refresh_token=eyJhbGciOiJIUzI1NiJ9.eyJyZWZyZXNoIjp0cnVlLCJ1c2VybmFtZSI6ImxtciIsInJvbGVzIjoiMiIsImV4cCI6MTczODYwNjQwNywiaWF0IjoxNzM4MDAxNjA3fQ.8R5n00Kpnkt0Jm3l9cpA9vXGLp34l317uV7WI50snp8; Path=/; Expires=Mon, 10 Feb 2025 18:13:27 GMT; HttpOnly
Location: /profile
Vary: Accept
Content-Type: text/html; charset=utf-8
Content-Length: 37
Date: Mon, 27 Jan 2025 18:13:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
---

#### 19- La solución informática no soportará reescritura de URL de las cookies de sesión.

Por defecto usando `jose`el campo `Domain` de la cookie es establecido al dominio desde donde el cliente solicitó y esto no se puede modificar. Igualmente se puede especificar en 
el despliegue al enviar con `express` en el campo Set-Cookie:

---

``` javascript
    res.cookie('mi_cookie_jwt', token, {
        httpOnly: true, 
        secure: true,  
        sameSite: 'Strict', // Previene el envío de cookies en solicitudes entre sitios
        path: '/ruta-especifica', // Establece la ruta específica para la cookie
    });
```
---
#### 20- El identificador de sesión se cambiará en cada sesión iniciada por el usuario.

Dado que en la carga útil del JWT se encuentra el campo "iat" (issued at), que representa la fecha y hora de su creación, esto permite que cambié en resultado de la función que se usa para cifrarlo, que es la siguiente:

---

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
) 
```

---
#### 21- El identificador de sesión se cambiará o blanqueará después de terminar la sesión.

Se usa el metodo `response.clearCookie` de Express para establecer el tiempo de expiración de la cookie en el pasado y así obligar a que el navegador elimine el identificador de sesión.

---

#### 22- Contará con un modelo de Autorización basado en roles que se gestionará mediante la solución informática.

Nuestra solución usa este modelo con cuatro roles: Admin, Director, Doctor y Nurse. En el requisito Nº2 se mostró el esquema que muestra los permisos de autorización para cada uno.  

---

#### 23- Los tipos de permisos se especificará desde la etapa de diseño, estáticos o en la etapa de explotación dinámicos.

Los tipos de permisos se especificaron desde la etapa de diseño, no cambian en tiempo de ejecución.

---
#### 24- Los usuarios solo accederán a los recursos de la solución para los cuales posean autorización .

Existe middleware de acceso que verifica el esquema especificado en el requisito Nº2 y que la cookie sea valida antes de garantizar acceso.

---
```javascript
	async access(req, res, next) {
  	const { session, roles, endpoint, resource, action } = req;
  	console.log("Session:", session);
  	if (session) {
    	console.log("Entrando en access()");
    	req.permission = false;
    	if (req.resource[0] === "static") { // Si accede a archivos estáticos (css, js, img)
      	req.permission = true;
      	return next(); 										// Está permitido
    	} else if (req.resource[0] === "api") {
      	for (const rol of roles) {
  			console.log("RESOURCE BEFORE VALIDATION:", resource)
        	if (await actionAccessControl(rol, action, this.resources.api.indexOf(resource[1]))) { // Si alguno de s>
          	req.permission = true; 																													// Le otorga permiso a acceder
          	return next();
        	}
      	}
      	return next(); 												// Si ninguno de los roles tiene permiso, pasar al siguiente middleware
    	} else if (req.resource[0] === "template") {
      	for (const rol of roles) {
        	if (await staticAccessControl(rol, resource[1])) { 				// Si alguno de sus roles
          	req.permission = true; 						// Le otorga permiso a acceder
          	return next();
        	}
      	}
      	return next(); 												// Si ninguno de los roles tiene permiso, pasar al siguiente middleware
    	} else {
      	req.permission = true;
      	return next();
    	}
  	} else {
    	console.log("Saliendo de access (No autenticado)");
    	return next('route');
  	}
	}

```
---
### 25- La navegación por los directorios será deshabilidtada por defecto a menos que sea permitido intencionalmente.

Por defecto `express` no incluye rutas que no se hallan añadido al enrutador bajo algún método HTTP.

---
#### 26- Todo el control de acceso será asegurado del lado del servidor.

En efecto, desde el lado del servidor es que se verifica la autenticación y se revisa el esquema de autorización, nunca en el cliente.

---
#### 27- Se asignarán a los usuarios solo los privilegios que necesitan. No existirán usuarios con privilegios de DBA.

Cada rol cuenta con solo los permisos que necesita para cumplir sus tareas siguiendo el principio de mínimo privilegio.

---

#### 28- Las soluciones se desarrollarán siguiendo el principio de menor privilegio, que permitan operaciones DML (INSERT, UPDATE,DELETE) y de selección (SELECT). Los privilegios se otorgarán mediante roles.
---

Sí, el rol es especificado en el JWT, y las vistas muestran las opciones disponibles basandose en el campo "role" que contiene un número con la ID del rol que contiene el usuario autenticado, por ejemplo, ID 0 es el rol "Admin", que tiene permiso a operaciones DML y de selección sobre los usuarios del software, pero no cuenta con ninguno para interactuar con los demás datos de la solución.

---
#### 29- Mecanismo que permita validar todos los datos de entrada a la solución tanto texto como ficheros.

La entrada de esta solución siempre es texto. En el lado del servidor se usaron esquemas de validación de datos, por ejemplo:

---
```javascript
import z from 'zod'

export const passwordSchema = z.string()
  .min(24, { message: "La contraseña debe tener más de 24 caracteres" })
  .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
  .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
  .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
  .regex(/[\W_]/, { message: "La contraseña debe contener al menos un símbolo" });

export const userSchema = z.object({
  name: z.string(),
  roles: z.array(z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4")]))
});

export const patientSchema = z.object({
  bed: z.string(),
  name: z.string().min(1, "el nombre no debe estar vacío."),
  age: z.number().int().positive().max(150),
  height: z.number().int().positive().max(250),
  weight: z.number().int().positive().max(500),
  dni: z.string().regex(/^\d{11}$/, "El número de identidad debe tener 11 dígitos"),
  phoneNumber: z.string().regex(/^\d{8}$/, "El número de teléfono debe tener 8 dígitos"),
  sex: z.enum(["M", "F"], "El sexo debe ser 'M' o 'F'"),
  consultationReasons: z.string(),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  preconditions: z.array(z.string()),
	risk_patient: z.boolean()
});

export const operationSchema = z.object({
  id: z.number().int().positive().optional(),
  priority: z.enum([0, 1]).optional(),
  estimated_duration: z.number().int().positive().optional(),
  description: z.string().optional(),
  real_duration: z.number().int().positive().optional(),
  scheduled_date: z.string().optional(),
  results: z.string().optional(),
  responsable: z.string().optional(),
  patient_id: z.number().int().positive().optional(),
});
```

Estos esquemas son apoyados por el cliente, que evita que el usuario introduzca caracteres no validos o exagerados:

---
![[req29_1.png]]

![[req29_2 1.png]]

---
#### 30- Todas las validaciones de datos de entrada serán ejecutadas del lado del servidor y adicionalmente podrán ser reforzadas del lado del cliente.

Explicado en el requisito Nº29.

---
#### 31- No se usarán contraseñas en texto plano dentro del código de programas o scripts.

La contraseña se extrae en formato de hash de la base de dato y se compara con la obtenida del cliente en base64.

---
``` javascript
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
```

---
#### 32- Los datos sensibles se enviarán al servidor en el cuerpo del mensaje HTTP.

Regularmente usamos los métodos POST y PATCH para enviar estos datos en formato JSON en el cuerpo de la solicitud.

---
#### 33- Incluye protección de la comunicación cliente-servidor. Uso de protocolos de túnel como SSL en dependencia del tipo de solución.

Se usó HTTP con TLS 1.3 para garantizar el cifrado entre el cliente y el servidor. Se generó un certificado y una llave privada con el programa `openssl` y se implementó en `express`:
``` javascript
     const options = {
         key: readFileSync("server.key"),
         cert: readFileSync("server.cert"),
    };
    //...
    const server = createServer(options,app);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
}) 
```

---
#### 34- Se protegerá la cadena de conexión a la BD.

Se usó un archivo .env, que no será compartido, donde se especificaron los datos de la cadena de conexión a la base de datos y el secreto JWT, un ejemplo de esto sería:

```
DB_HOST="127.0.0.1"
DB_USER="usuario"
DB_NAME="Hospital"
DB_PASSWORD="contrasena"
DB_PORT=3306
JWT_SECRET="UnSecretoGeneradoAleatoriamente"
```
---
#### 35- Incorporará un mecanismo de recolección de trazas.

Se incorporó un sistema de trazas sencillo usando el paquete `morgan` de npm y se creó una vista para el administrador.

---
![[req35.png]]

---
#### 36- El privilegio de borrado de trazas no será asignado a ningún usuario, incluyendo al administrador del sistema.

Ni siquiera el administrador tiene permisos sobre el archivo de las trazas.

---

#### 37- Ficheros que se generan con la instalacion del sistema gestor de base de datos se protegeran contra usos no autorizados.

Nuestra solución informática usa MYSQL, y en este caso para lograrlo hacemos lo siguiente:

``` bash
# Aseguranos de que el propietaro de los directorios de datos y de logs es el usuario de la base de datos
sudo chown -R mysql:mysql /var/lib/mysql
sudo chown -R mysql:mysql /var/log/mysql
# Cambia los permisos de los directorios de datos y logs
sudo chmod 700 /var/lib/mysql
sudo chmod 700 /var/log/mysql
# Cambia los permisos de los ficheros de configuracion
sudo chmod 640 /etc/mysql/my.cnf
```
---

#### 38- El usuario para consultas regulares a la BD tiene que poseer los privilegios mínimos e indispensables para el correcto funcionamiento de la solución.

Como se especificó en el requisito Nº11, el usuario que se usa para las consultas solo tiene los privilegios estrictamente necesarios para las operaciones.

```sql
| GRANT SELECT, INSERT, UPDATE, DELETE ON `Hospital`.* TO `admin`@`localhost`                                  |
```

---
#### 39- Los resultados de las fallas de la validación de los datos de entrada serán rechazados o serán convertidas en entradas correctas.

 Al contrario que en la validación positiva, en la solución implementada puede aceptarse datos mal formados pero en el servidor se identifica y se devuelve una respuesta negativa en caso de ser así.

---
#### 40- Se garantizará que la solución gestione adecuadamente todos los recursos de los servidores y del cliente.
---

La gestión adecuada de recursos en la aplicación web se ha logrado mediante la optimización del código y el manejo eficiente de conexiones a la base de datos, así como la carga y optimización de recursos estáticos. Se han implementado técnicas de programación asincrónica y colas de trabajo para mejorar la capacidad de respuesta, junto con una gestión efectiva de sesiones y escalabilidad mediante balanceo de carga.

---


