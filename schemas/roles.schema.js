import Operation from './../Operation.js'

const Operation_Endpoints = new Operation()

const Rol = {
  "Admin": {
    "permisions": {
      "get": {
        "template":{
          "admin": true,
          "informacion": true,
          "ingresar": true,
          "login":true,
          "notificaciones": true,
          "repitlogin": true,
          "salas": true
        },
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(){return true},
        "operation" : function(){return true}
      },
      "post": {
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(){return true},
        "operation" : function(){return true}
      },
      "patch": {
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(){return true},
        "operation" : function(){return true}
      },
      "delete": {
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(){return true},
        "operation" : function(){return true}
      }
    }
  },
  "Doctor": {
    "permisions": {
      "get": {
        "template":{
          "admin": false,
          "informacion": true,
          "ingresar": true,
          "login":true,
          "notificaciones": true,
          "repitlogin": true,
          "salas": true
        },
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(username){
          return Operation_Endpoints.isOwner(operation_id, username)
        }
      },
      "post": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(){return false},
        "operation" : function(){return true}
      },
      "patch": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(operation_id, username){
          return Operation_Endpoints.isOwner(operation_id, username)
        }
      },
      "delete": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(){return false}
      }
    }
  },
  "Director": {
    "permisions": {
      "get": {
        "template":{
          "admin": false,
          "informacion": true,
          "ingresar": true,
          "login":true,
          "notificaciones": true,
          "repitlogin": true,
          "salas": true
        },
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(){return true}
      },
      "post": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(){return true},
        "operation" : function(){return false}
      },
      "patch": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(){return false}
      },
      "delete": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(){return false}
      }
    }
  },
  "Nurse": {
    "permisions": {
      "get": {
        "template":{
          "admin": false,
          "informacion": true,
          "ingresar": false,
          "login":true,
          "notificaciones": true,
          "repitlogin": true,
          "salas": true
        },
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return false}
      },
      "post": {
        "patient" : function(){return false},
        "user" : function(){return false},
        "notification" : function(){return false},
        "operation" : function(){return false}
      },
      "patch": {
        "patient" : function(){return false},
        "user" : function(){return false},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return false}
      },
      "delete": {
        "patient" : function(){return false},
        "user" : function(){return false},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return false}
      }
    }
  },
  "Recepcionist": {
    "permisions": {
      "get": {
        "template":{
          "admin": false,
          "informacion": true,
          "ingresar": true,
          "login":true,
          "notificaciones": true,
          "repitlogin": true,
          "salas": true
        },
        "patient" : function(){return true},
        "user" : function(){return true},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return true}
      },
      "post": {
        "patient" : function(){return true},
        "user" : function(){return false},
        "notification" : function(){return true},
        "operation" : function(){return false}
      },
      "patch": {
        "patient" : function(){return false},
        "user" : function(){return false},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return true}
      },
      "delete": {
        "patient" : function(){return false},
        "user" : function(){return false},
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : function(){return false}
      }
    }
  },
}

const roles = ["Admin", "Director", "Doctor", "Nurse", "Recepcionist"]
const actions = ["get", "post", "patch", "delete"]
const resources = ["patient", "user", "notification", "operation"]
const templates = ["admin", "informacion", "ingresar", "login", "notificaciones", "repitlogin", "salas"]
const staticEndpoints = ["js", "css", "img", "assets"]

export async function actionAccessControl(a = 0/*ROL*/, b = 0/*ACTION*/, c = 0/*RESOURCE*/, notification_id = "", username = "", operation_id = ""){
  const rol = roles[a]
  console.log(rol)
  const action = actions[b]
  const resource = resources[c]

  if(resource === "notification"){
    if (!notification_id || !username){ return false}
    if (Rol[rol]["permisions"][action][resources[resource]](notification_id, username)) {return true}
    else return false
  }
  else if(resource === "operation"){
    if (!operation_id || !username){ return false}
  if (Rol[rol]["permisions"][action][resources[resource]](operation_id, username)){return true}
    else return false
  }

  if (Rol[rol]["permisions"][action][resource]()){return true}
  else return false
}

export async function staticAccessControl(rol, template, endpoint = ""){
  if (endpoint !== ""){
    return true
  } else if (Rol[roles[rol]]["permisions"]["get"]["template"][template]){return true}
  else {return false}
}
