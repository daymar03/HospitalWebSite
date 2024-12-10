import { getPool } from '../utils/db.js'

class Notification {
  constructor(){
    this.pool = getPool();
  }

  async sendNotification(notification){
    return new Promise(async (resolve, reject)=>{
			try{
				const {
					titulo,
					body,
					username
				} = notification

				if(!titulo || !body || !username){
					reject({error: "Bad Request"})
				}

				await this.pool.query('START TRANSACTION');

//Recuperar ID del usuario:
				const getUserIdQuery = "Select id From User WHERE username = ?"
				const getUserIdQueryResult = await this.pool.query(getUserIdQuery, [username])
				if(getUserIdQueryResult[0].length === 0){
					return reject({error: "Error sending notification, Getting User"})
				}
				const user_id = getUserIdQueryResult[0][0].id

//Insertar datos en la tabla Notifications
				const insertNotificationQuery = "INSERT INTO Notification (titulo, body, readed, deleted) VALUES (?,?,false,false)"
				const insertNotificationQueryResult = await this.pool.query(insertNotificationQuery,[titulo, body])
				if (insertNotificationQueryResult.affectedRows === 0){
					return reject({error: "Error sending notification, Inserting Noti"})
				}
				const notification_id = insertNotificationQueryResult[0].insertId

//Insertar datos en la tabla intermedia: User_Notification
				const insertQuery = "INSERT INTO User_Notification (user_id, notification_id) VALUES (?,?)"
				const insertQueryResult = await this.pool.query(insertQuery, [user_id, notification_id])
				if (insertQueryResult.affectedRows === 0){
					return reject({error: "Error sending notification, Userting User_Noti"})
				}
				await this.pool.query('COMMIT');
				return resolve({success: true})
			}catch(err){
				await this.pool.query('ROLLBACK');
				console.log(err)
				return reject(err)
			}
    })
  }

	async getNotifications(username){
	return new Promise(async (resolve, reject)=>{
		try{
			const userId = await this.pool.query("Select id FROM User WHERE username = ?", username)
			const id = userId[0][0].id
			console.log("USERID="+id)
			const getNotificationsQuery = "SELECT n.body as body, n.id as id, n.titulo as title, n.readed as readed, n.date as date FROM Notification n JOIN User_Notification un ON n.id = un.notification_id JOIN User ON un.user_id = User.id"
			const result = await this.pool.query(getNotificationsQuery, id)
			console.log("RESULT:",result[0])
			console.log("SIZE:",result[0].length)
			if(result[0].length === 0){
				return reject({error: "Error getting notification"})
			}
			return resolve(result[0])
		}catch(err){
			return reject({error: "Error getting notifications"})
		}})
	}

	async readNotification(notification_id){
	return new Promise(async (resolve, reject)=>{
		try{
			if(!notification_id){
			return reject({error: "Something went wrong"})
			}
			const readNotificationQuery = "UPDATE Notification SET readed = true where id = ?"
			const readNotificationQueryResult = await this.pool.query(readNotificationQuery, [notification_id])
			if(readNotificationQueryResult[0].affectedRows === 0){
				return reject({success: false})
			} else {
				return resolve({success: true})
			}
		}catch(err){
			return reject({error: "Something went wrong"})
		}})
	}

	async deleteNotification(notification_id){
		return new Promise(async (resolve, reject)=>{
		try{
			if(!notification_id){
				return reject({error: "Someting went wrong"})
			}
			this.pool.query("START TRANSACTION")
			const deleteItermQuery = "DELETE FROM User_Notification WHERE notification_id = ?"
			const deleteNotificationQuery = "DELETE FROM Notification where id = ?"
			const deleteItermResult = await this.pool.query(deleteItermQuery, [notification_id])
			if(deleteItermResult[0].affectedRows === 0){
				resolve({success: false, a:1})
			}
			const deleteNotificationResult = await this.pool.query(deleteNotificationQuery,[notification_id])
			if(deleteNotificationResult[0].affectedRows === 0){
				resolve({success: false, a:2})
			}

      await this.pool.query('COMMIT');
			resolve({success: true})
		}catch(err){
			await this.pool.query('ROLLBACK');
			return reject(err)
		}
	})}
}

export default Notification
