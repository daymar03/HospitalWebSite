import Operation from './../Operation.js'

const Operation_Endpoints = new Operation()

const Rol = {
  "Admin": {
    "permisions": {
      "get": {
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      },
      "post": {
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      },
      "patch": {
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      },
      "delete": {
        "patient" : true,
        "user" : true,
        "notification" : true,
        "operation" : true
      }
    }
  },
  "Doctor": {
    "permisions": {
      "get": {
        "patient" : true,
        "user" : false,
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(username){
          return Operation_Endpoints.isOwner(operation_id, username)
        }
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
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : function(operation_id, username){
          return Operation_Endpoints.isOwner(operation_id, username)
        }
      },
      "delete": {
        "patient" : true,
        "user" : false,
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : false
      }
    }
  },
  "Director": {
    "permisions": {
      "get": {
        "patient" : true,
        "user" : true,
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : true
      },
      "post": {
        "patient" : true,
        "user" : false,
        "notification" : true,
        "operation" : false
      },
      "patch": {
        "patient" : true,
        "user" : false,
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : false
      },
      "delete": {
        "patient" : true,
        "user" : false,
        "notification" : function(notification_id, username){
          return Notification.isOwner(notification_id, username)
        },
        "operation" : false
      }
    }
  },
  "Nurse": {
    "permisions": {
      "get": {
        "patient" : true,
        "user" : false,
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
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
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : false
      },
      "delete": {
        "patient" : false,
        "user" : false,
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : false
      }
    }
  },
  "Recepcionist": {
    "permisions": {
      "get": {
        "patient" : true,
        "user" : true,
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
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
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : true
      },
      "delete": {
        "patient" : false,
        "user" : false,
        "notification" : function(notidication_id, username){
          return Notification.isOwner(notidication_id, username)
        },
        "operation" : false
      }
    }
  },
}


console.log(Rol.Doctor.permisions.get.patient)
