# Login notifications

Login notifications service is used to manage notifications shown in login 
page.
Notifications are stored in the filesystem serialized as JSON.
Service consists of simple backend and frontend for CRUD operations for managing
aforementioned JSON file.

Example JSON
```
[
  {
    "id": 3,
    "text_fi": "foo",
    "text_sv": "bar"
  }
]
```

## Local development

### Prerequisites

* Java 11+
* Node 6.14.1

### Backend

Create property file $HOME/oph-configuration/common.properties

File should contain one key-value pair indicating the location for the JSON e.g.
```
loginNotificationsFilePath=<desired path to file>
```

Application can then be run via maven with:

`mvn clean install cargo:run`

Application should respond at http://localhost:8081/login-notifications/

### Frontend

`npm install && npm start`

Application should respond at http://localhost:8080

Make sure that the backend is running for full functionality

## Access control

_Zero, zip, zilch, nada_

There is no access control whatsoever. Access restrictions should be taken
care on [outer layers](https://github.com/Opetushallitus/nginx/blob/fd1d9d59ad1314faaf4879ff6b6c8be3c19805e9/templates/conf.d/includes/locations_virkailija.conf#L31-L40).

## Notes

### Deployments

Application is supposed to be deployed to AWS fargate. This means that all information
stored in ephemeral filesystem will be wiped out during deployments / restarts.
