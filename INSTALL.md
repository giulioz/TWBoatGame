# Backend

## Dependencies

```
mongodb
npm
```

## Instructions

```
cd backend/SeaDuelServer
```

create a .env file containing

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

```
npm install
npm run db &
npm run compile
npm start &
```

# Frontend

## Dependencies

```
angular-cli
npm
```

## Instructions

```
cd angular-app/SeaDuel 
npm install
ng serve &
```

Navigate to http://localhost:4200 after ng serve has finished compiling
