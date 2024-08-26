#!/bin/bash

set -e
set -u

function create_database() {
    local database=$1
    echo "  Checking if Database '$database' exists for '$POSTGRES_USER'"
    if psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -wq "$database"; then
        echo "  Database '$database' already exists, skipping creation."
    else
      echo "  Creating Database '$database' for '$POSTGRES_USER'"
      psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            CREATE DATABASE $database;
            GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
    fi
}


create_database $POSTGRES_DB

echo "Database created"