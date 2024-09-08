#!/bin/bash


# Color variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Export environment variables from .env file
export $(grep -v '^#' .env | xargs)

echo -e "${BLUE}Generate servers.json...${NC}"
# Generate servers.json dynamically
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

# Ensure the directory exists and write the JSON file
mkdir -p ./docker/pgAdmin 
echo "$JSON" > ./docker/pgAdmin/servers.json
echo -e "${GREEN}servers.json generates successful!${NC}"


# Start Docker Compose in detached mode
echo -e "${BLUE}Running docker containers...${NC}"
docker compose up -d

# Wait for the database to be ready
until [ "`docker inspect -f {{.State.Running}} pgadmin4_container`"=="true" ]; do
  echo -e "${YELLOW}Waiting for the database to be ready...${NC}"
  sleep 0.1;
done;

# Function to clean up and shut down Docker containers on exit
cleanup() {
    echo -e "${BLUE}Stopping containers and cleaning up...${NC}"
    docker compose down
    exit 0
}

# Trap EXIT, SIGINT (Ctrl+C), SIGTERM  to call cleanup
trap cleanup EXIT SIGINT SIGTERM

# Check if migrations exist
if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    echo -e "${YELLOW}No migrations found. Running migrations...${NC}"
    npm run migrate
else
    echo -e "${GREEN}Migrations already exist. Skipping migration step...${NC}"
fi

# Wait indefinitely, so the script stays running to handle the Ctrl+C
while true; do
    sleep 1
done