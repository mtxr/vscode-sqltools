# SAP HANA Start Guide

## 1. Prerequisites

> Extension automatically asks to install the SAP HANA driver (@sap/sap-client)

## 2. Connections

### 2.1 SAP HANA Connection

For full reference, see [SAP Documentation](https://help.sap.com/viewer/0eec0d68141541d1b07893a39944924e/2.0.02/en-US/4fe9978ebac44f35b9369ef5a4a26f4c.html)

```json
{
  "name": "<your prefered name>",
  "dialect": "SAPHana",
  "database": "<the schema you want to connect to>", 
  "username": "<user-name",
  "password": "<pwd>",
  "connectionTimeout": 15 //in seconds,0 for disabling
}
```


### 2.2 Alternative Connection Strings

ConnectionString maps from `connectString` property:

```json
{
  "name": "<your prefered name>",
  "dialect": "SAPHana",
  "connectString": "<see docs>" // Example: "connectString": "HOST=myServer;PORT=30015;UID=MyUser;PWD=MyPassword"
}
```