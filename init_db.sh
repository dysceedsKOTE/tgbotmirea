#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "tgbot_admin" --dbname "tgbot_admin" <<-EOSQL
    CREATE USER tgbot_slave WITH PASSWORD 'tgbot';
    CREATE DATABASE tgbot WITH OWNER 'tgbot_slave';
EOSQL
