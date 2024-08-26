#!/bin/bash

export $(grep -v '^#' .env | xargs)


JSON=$(cat <<-END
  {
    "Servers": {
        "1": {
            "Group": "$DATABASE_SERVERGROUP",
            "Name": "$DATABASE_SERVERNAME",
            "Host": "$DATABASE_HOST",
            "Port": $DATABASE_PORT,
            "MaintenanceDB": "$DATABASE_NAME",
            "Username": "$DATABASE_USER",
            "Password": "$DATABASE_PASSWORD",
            "SSLMode": "$DATABASE_SSLMODE",
            "Favorite": $DATABASE_FAVORITE
        }
    }
}
END
)

echo "$JSON" > ./docker/pgAdmin/servers.json

docker compose up
