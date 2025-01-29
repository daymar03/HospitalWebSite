import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import patient from './routers/patientRouter.js'
import user from './routers/userRouter.js'
import operation from './routers/operationRouter.js'
import notification from './routers/notificationRouter.js'
import router from './routers/viewsRouter.js'
import Auth from './utils/auth.js'
import { writeMaxLogins, writePasswordHistorySize } from './utils/utils.js'
import { readFileSync, readFile, createReadStream, createWriteStream } from "fs";
import { createServer } from 'https'
import morgan from "morgan"

const auth = new Auth()

dotenv.config()
const app = express()
const port = 3000
const appPath = process.cwd()

const options = {
  key: readFileSync("server.key"),
  cert: readFileSync("server.cert"),
};

//VIEW ENGINE
app.set('view engine', 'ejs');

// Trazas
const logStream = createWriteStream(path.join(appPath, 'traces.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

//DEFAULT MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

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

// Ruta para devolver las trazas
app.get('/admin/trazas', auth.login, (req, res) => {
  readFile(path.join(appPath, 'traces.log'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer las trazas');
    }
    res.render(`${appPath}/templates/logs`, { logs: data });
  });
})

app.post('/admin/setMaxLoginAtt', async (req, res) => {
  try {
    const { maxIp = 6 } = req.body 
    await writeMaxLogins(maxIp)
    return res.json({success: true})
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", success: false })
  }
})

app.post('/admin/setMaxPasswordSaved', async (req, res) => {
 try{
  const { maxPass = 24 } = req.body
 const result = await writePasswordHistorySize(maxPass)
    return res.json(result)
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", success: false }) 
  }
})



app.use(auth.login, (req, res, next) => {
  res.status(404).render(`${appPath}/templates/notFound.ejs`);
});




//app.listen(port, () => {
//  console.log(`Server listening on port ${port}`)
//})

//SERVER
const server = createServer(options, app);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
}) 
