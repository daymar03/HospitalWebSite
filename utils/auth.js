import { createSecretKey } from 'crypto'
import { createJWT, decryptJWT, getResource } from '../utils/utils.js'
import { actionAccessControl, staticAccessControl } from './roles.schema.js'
import dotenv from 'dotenv'
const secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');
import User from '../resources/User.js'

const User_Endpoints = new User()

dotenv.config()

const appPath = process.env.APP_PATH

if (!secretKey) {
  console.error("JWT_SECRET environment variable not set!");
}

class Auth{
	constructor(){
		this.secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');
		this.templates = ["/admin", "/informacion", "/login", "/repitlogin", "/salas", "/permissionDenied", "/changepassword", "/profile", "/director", "operations"]
		this.actions = ["GET", "POST", "PATCH", "DELETE"]
		this.resources = {
  		"api" : ["patients", "users", "notifications", "operations"],
  		"template": this.templates,
  		"static": ["css", "js", "img", "assets"]
		}
	}

	async haveSession(req, res, next) {
  	try {
    	const session = req.cookies.access_token;
    	const refresh = req.cookies.refresh_token;
    	if (session) { // Tiene token de sesión
      	const payload = await decryptJWT(session);
      	console.log(payload)
      	if (payload) { // El token es válido
					let iat = payload.payload.iat
        	req.username = payload.payload.username
					const isLogged = await User_Endpoints.isLogged(req.username, iat)
					if (isLogged.success){
        		req.session = true;
        		req.roles = payload.payload.roles.split(',');
        		req.endpoint = req.path.split('/')[1];
        		req.resource = getResource(req.path); // Ej: de /api/patients/all -> ["api", "/patients/all"]
        		console.log("Resources:", req.resource);
        		req.action = this.actions.indexOf(req.method);
        		next();
					} else {
						req.session = false; //Se cerró la sesión de ese token
					}
      	} else { // El token no es válido
        	req.session = false;
        	next();
      	}
    	} else if (refresh) { //Tiene Token de Refresco (zuko o fruti)
      		const payload = await decryptJWT(refresh);
      		if (payload.payload.refresh) { // El token es válido
						let iat = payload.payload.iat
        		req.username = payload.payload.username
						const isLogged = await User_Endpoints.isLogged(req.username, iat)
						if (isLogged.success){
							req.refresh = true;
        			req.session = true;
        			req.roles = payload.payload.roles.split(',');
        			req.endpoint = req.path.split('/')[1];
        			req.resource = getResource(req.path); // Ej: de /api/patients/all -> ["api", "/patients/all"]
        			req.action = this.actions.indexOf(req.method);
      				const expirationTimeRefresh = Math.floor(Date.now() / 1000) + (120 * 60 * 24 * 7); //7 days
							const access_jwt = await createJWT({
        				"username": req.username,
        				"roles": payload.payload.roles,
        				"exp": expirationTimeRefresh
      				})
      				res.cookie('access_token', access_jwt,{ //testing
        				expires: new Date(expirationTimeRefresh * 1000),
       				 	httpOnly: true
      				})
        			next();
						} else {
							req.session = false; //Se cerró la sesión de ese token
						}
					} else {
      			console.log("REFRESCO",payload)
						req.session = false;
						next()
					}
			} else { // No tiene token de sesión
      	req.session = false;
      	next();
    	}
  	} catch (err) {
    	console.log(err);
      req.session = false;
    	next(); // Asegúrate de pasar el error al manejador de errores
  	}
	}

	async login(req, res, next){
  	console.log("Entrando al middleware LOGIN")
  	if (!req.session){
    	console.log("PORBANDO, ENTRO A !SESSION")
    	res.redirect(`/login`)
    	return
  	} else if(!req.permission){
    	console.log("PORBANDO, ENTRO A !PERMISSION")
    	res.render(`${appPath}/templates/notFound.ejs`)
    	return
  	}
  	else {
    	next()
    	return
  	}
	}

	async access(req, res, next) {
  	const { session, roles, endpoint, resource, action } = req;
  	console.log("SESSSIOOON:", session);
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

}


export default Auth
