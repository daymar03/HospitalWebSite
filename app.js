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

const auth = new Auth()

dotenv.config()
const app = express()
const port = 3000
const appPath = process.env.APP_PATH

//VIEW ENGINE
app.set('view engine', 'ejs');

//DEFAULT MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//OWN MIDDLEWARES
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

app.use((req, res, next) => {
	res.status(404).render(`${appPath}/templates/notFound.ejs`);
});

//SERVER
app.listen(port, ()=> {
 console.log(`Server listening on port ${port}`)
})
