# SeaDuel

## Dependencies

```
mongodb
npm
node 8.*
```

## Instructions

create the .env file in backend/SeaDuelServer containing

```
APP_ID=SeaDuelServer
PORT=4201
LOG_LEVEL=debug
REQUEST_LIMIT=100kb
SECRET=mySecret
SALT=mySalt
DB_URL=mongodb://localhost/seaduel
OFFLINE_MINUTES=1
WARN=off

#Swagger
SWAGGER_API_SPEC=/spec
```

## Start Server

```
npm start
```

Navigate to http://localhost:4200 after ng serve has finished compiling
