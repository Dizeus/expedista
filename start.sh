#!/bin/bash

# Color variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
VIOLET='\033[0;35m'
NC='\033[0m' # No Color
LINE="\n${VIOLET}--------------------------------------------------${NC}"

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker is not installed. Please install Docker to proceed.${NC}" >&2
  exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start the Docker daemon.${NC}" >&2
  exit 1
fi

#Export environment variables from .env file
if [ "$1" = "production" ]; then
  export $(grep -v '^#' .env.production | xargs)
else
  export $(grep -v '^#' .env | xargs)
fi

echo -e "${CYAN}\nRunning in ${NODE_ENV} mode...${LINE}"

echo -e "${BLUE}Generate servers.json...${LINE}"
# Generate servers.json dynamically
JSON=$(cat <<-END
  {
    "Servers": {
        "1": {
            "Group": "$DATABASE_SERVERGROUP",
            "Name": "$DATABASE_SERVERNAME",
            "Host": "$DATABASE_DEFAULT_HOST",
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
echo -e "${GREEN}File servers.json generated successful!${LINE}"


# Start Docker Compose in detached mode
echo -e "${BLUE}Running docker containers...${LINE}"
docker compose up -d

# Wait for the database to be ready
until [ "`docker inspect -f {{.State.Running}} pgadmin4_container`"=="true" ]; do
  echo -e "${YELLOW}Waiting for the database to be ready...${LINE}"
  sleep 0.1;
done;

# Function to clean up and shut down Docker containers on exit
cleanup() {
  echo -e "${BLUE}Stopping containers and cleaning up...${LINE}"
  docker compose down
  exit 0
}

# Trap EXIT, SIGINT (Ctrl+C), SIGTERM  to call cleanup
trap cleanup EXIT SIGINT SIGTERM


# Get the modification time of the schema.prisma file
schema_time=$(stat -c %Y prisma/schema.prisma)

# Get the modification time of the latest migration folder
latest_migration_time=$(stat -c %Y $(ls -td prisma/migrations/*/ 2>/dev/null | head -n 1) 2>/dev/null || echo 0)

#Check if migrations exist or if the schema has been updated
if [ ! "$(ls -A prisma/migrations 2>/dev/null)" ] || [ "$schema_time" -gt "$latest_migration_time" ]; then
  echo -e "${YELLOW}\nRunning migrations...${LINE}"
  if [ "$NODE_ENV" = "production" ]; then
    npm run migrate:deploy
    echo -e "${YELLOW}\nRunning seeds...${LINE}"
    npm run seed:deploy
  else
    npm run migrate:dev
  fi
else
  echo -e "${GREEN}\nMigration is up-to-date. Skipping migration step...${LINE}"
fi

echo -e "${YELLOW}\nStarting application...${LINE}"
npm run start:dev
