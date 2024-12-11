import { createSecretKey } from 'crypto'
import { createJWT, decryptJWT, getResource } from '../utils/utils.js'
import { actionAccessControl, staticAccessControl } from '../schemas/roles.schema.js'
const secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');

if (!secretKey) {
  console.error("JWT_SECRET environment variable not set!");
}

class Auth{
	constructor(){
		this.secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');
		this.templates = ["admin", "informacion", "ingresar", "login", "notificaciones", "repitlogin", "salas", "permissionDenied", "changepassword"]
		this.actions = ["GET", "POST", "PATCH", "DELETE"]
		this.resources = {
  		"api" : ["patients", "users", "notifications", "operations"],
  		"template": this.templates,
  		"static": ["css", "js", "img", "assets"]
		}
	}

	async haveSession(req, res, next) {
  	try {
    	const session = req.cookies.session;
    	console.log(session)
    	if (session) { // Tiene token de sesión
      	const payload = await decryptJWT(session);
      	console.log(payload)
      	if (payload) { // El token es válido
        	req.session = true;
        	req.username = payload.payload.username
        	req.roles = payload.payload.roles.split(',');
        	req.endpoint = req.path.split('/')[1];
        	req.resource = getResource(req.path); // Ej: de /api/patients/all -> ["api", "/patients/all"]
        	console.log("Resources:", req.resource);
        	req.action = this.actions.indexOf(req.method);
        	next();
      	} else { // El token no es válido
        	req.session = false;
        	next();
      	}
    	} else { // No tiene token de sesión
      	req.session = false;
      	next();
    	}
  	} catch (err) {
    	console.log(err);
    	next(err); // Asegúrate de pasar el error al manejador de errores
  	}
	}

	async login(req, res, next){
  	console.log("Entrando al middleware LOGIN")
  	console.log(req.session, req.cookies)
  	if (!req.session){
    	console.log("PORBANDO, ENTRO A !SESSION")
    	res.redirect('/login')
    	return
  	} else if(!req.permission){
    	console.log("PORBANDO, ENTRO A !PERMISSION")
    	res.redirect('/permissionDenied')
    	next('route')
    	return
  	}
  	else {
    	console.log("PORBANDO, ENTRO A ELSE")
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
        	if (await staticAccessControl(rol, resource[1].split('/')[1])) { 				// Si alguno de sus roles
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
