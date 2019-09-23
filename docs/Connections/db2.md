# DB2 Start Guide

## 1. Prerequisites

- [Prerequisites by node-ibm_db](https://github.com/ibmdb/node-ibm_db/#prerequisite)

> Extension automatically installs Node DB2 driver (ibm_db) on:

For more information please see:
- [node-ibm_db](https://github.com/ibmdb/node-ibm_db/)
- [node-gyp](https://github.com/nodejs/node-gyp)

### 1.1 Tips
- To avoid download IBM CLI Driver automatically
  - Download IBM CLI Driver manually, and unpackage the content into a folder, e.g. `C:\ibm\db2\clidriver`
  Set an environment variable `IBM_DB_HOME` as the location.
- add the bin folder of the IBM CLI Driver folder in the environment variable `PATH`, e.g. `C:\ibm\db2\clidriver\bin`
- On Windows, may need to install `npm install --global --production windows-build-tools`
- On Windows, may nned to install Microsoft Visual Studio or Visual Studio Build Tools, with packages:
  - Windows 10 SDK
  - VS 2xxx.x vxx.xx (vxxx) toolset for desktop
- On Windows, may nned to run `npm config set msvs_version 2017` or `2015`
- On Windows, may need to set environment variable `VCTargetsPath` to point the VC, e.g. `C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\v140\`
- As a test, please try `npm install ibm_db` in a node project folder. If the following information presents in the output, it means the environment is ready.
- During this extension is installing `ibm_db`, please check the output in the output panel of 'SQLTools Language Server' for details.

```txt
...
Downloading of clidriver skipped - build is in progress...
...
Finished generating code
...
node-ibm_db installed successfully!
```

## 2. Connections

### 2.1 DB2 Connection

DB2's connectionString is constructed from connection properties as following (If all three properties are provided):

Connection example:
```json
{
  "dialect": "DB2",
  "name": "DB2 - MyDB",
  "username": "db2inst1",
  "password": "password",
  "server": "localhost",
  "port": 50000,
  "database": "MyDB"
}
```
