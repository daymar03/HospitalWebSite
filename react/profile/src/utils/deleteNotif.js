const DELETE_URL = "http://localhost:3000/api/notifications/delete"

export async function deleteNotif(id){
  const data = {"notification_id" : id}
  const result = await fetch(DELETE_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body : JSON.stringify(data)
  })
  const res = await result.json()

  if (res.success) return res.notif
  else return false
}
