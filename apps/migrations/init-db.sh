#!/bin/bash
set -e
echo '=========== HELLO ================='
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER auth_service;
	CREATE DATABASE "nestjs-ms-auth";
	GRANT ALL PRIVILEGES ON DATABASE tasks TO auth_service;
EOSQL