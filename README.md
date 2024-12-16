# energy-label-log-server

A logging server to log data from runs of the energy label extension.

# Setup

```
$ git clone https://github.com/AAU-SW7-PSAAAB/energy-label-log-server-oltp/
```

```
$ npm i
```

To run the server do

```
$ npm run exec
```

## Environment variables

In the root of the folder a text file should be created called _.env_. A template of the file is shown below:

```
USER_NAME="root"
PASSWORD="energylabel"
HOST="localhost"
PORT="3306"
DATABASE_NAME="oltp"

URL_FIRST="mysql://${USER_NAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE_NAME}"
```

## Setup initial database

Each database used in the code must be set up and migrated individually.
To set up a single database using docker the following command can be used. The notation _${}_ is used to reference environment variables, _PORT_ references the external port, and _CONTAINER_NAME_ references some container name:

```
docker run --name CONTAINER_NAME -d \
    -e MYSQL_ROOT_PASSWORD=${PASSWORD} \
    -e MYSQL_DATABASE=${DATABASE_NAME} \
    -p PORT:3306 \
    mariadb:latest
```

For every database the migration script must be run. To do this the _PORT_ variable should be updated in the .env file to the corresponding port of the docker container.

```
npx prisma migrate dev --name init && rm -rf ./prisma/migrations
```

Generate the prisma client

```
$ npx prisma generate
```
