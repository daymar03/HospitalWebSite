#!/bin/bash

# Ejecutar: sudo bash setup.sh


# Montar la base de datos
systemctl start mysql
mysql -h localhost -u root -e "DROP DATABASE IF EXISTS Hospital;"
mysql -h localhost -u root < ./utils/Hospital.sql
mysql -h localhost -u root < ./utils/dummy.sql

# Crear el .env, necesario modificarlo
touch .env
echo 'JWT_SECRET="thisIsARealyRandomSecretIDontKnowWhatToTypeHere"' >> .env        
echo 'DB_HOST="127.0.0.1"' >> .env
echo 'DB_USER="admin"' >> .env
echo 'DB_NAME="Hospital"' >> .env
echo 'DB_PASSWORD="admin"' >> .env
echo 'DB_PORT=3306' >> .env

# Crear certificados TLS v1.3
openssl req -nodes -new -x509 -keyout server.key -out server.cert
