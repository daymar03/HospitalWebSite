### 1. Iniciar y crear la base de datos
sudo systemctl start mysql && sudo mysql < create_db.sql && sudo mysql < dummy.sql

### 2. Instalar las dependencias del proyecto
npm install 

### 3. Crear un archivo .env
```
# Local
DB_HOST='127.0.0.1'
DB_USER='admin'
DB_PASSWORD='admin'
DB_NAME='Hospital'
PORT='3306'
```
### 4. Iniciar el servidor
sudo npm run dev

## Rutas disponibles

![photo_2024-11-27_11-48-36](https://github.com/user-attachments/assets/37e04b73-f28a-458f-8c2f-e2260939d72d)

