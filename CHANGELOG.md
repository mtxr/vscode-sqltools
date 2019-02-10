# SQLTools Changelog

## v0.16

### v0.16.9
- **Enhancements**
  - **Settings**:
    - Added options to disable release notifications. `disableReleaseNotifications` defaults to `false`.
  - ***Connections***:
    - MySQL: Updated library to mysql instead of mysql2. Previous was vey buggy.
    - PostgreSQL: Updated library and migrated to connection pooling to avoid errors.
    - MSSQL: Updated library and migrated to connection pooling to avoid errors. Issue #126

### v0.16.8
- **Fixes**
  - ***Connections***:
    - MSSQL: Fixes `Requests can only be made in the LoggedIn state, not the LoggedInSendingInitialSql state`. Issue #126

### v0.16.7
- **Fixes**
  - ***UI***:
    - Using Octicons as suggested by VSCode team.
    - Adopeted the new QuickPick API.
    - Added disconnect icon to connection-explorer
  - ***Connections***:
    - General: quick pick not showing options if no connection active. Issue #124
    - General: Allow auto connect to multiple connections.
    - MySQL: Fixes `Can't add new command when connection is in closed state`. Should happen less often at least.
  - ***History***:
    - Add option to edit item from history.
    - Updated history to show most recenetly used at first position
  - ***Query Format***:
    - Fixed formatting with comments. Issue #97
    - Fixed formatting with non latin chars. Issue #99

### v0.16.6
- **Fixes**
  - ***Connections***: Error while connecting => `toString() of undefined`

### v0.16.5

- **Enhancements**
  - ***UI***: Updated extension icon and README.
  - ***Settings***: Added settings defintion for `dialectOptions`.
  - ***Connection Explorer***
    - Improved to show  `Generate insert Query` and `Add to cursor` only when an editor is open and editable.
    - Auto Expand connection on connect.
- **Fixes**
  - ***Connection Explorer***: Fixes tables not showing columns.

### v0.16.4

- Fixes disconnect not working. #122.
- Auto connecting if have just one connection
- 'Add new Server' changed to 'Add new connection'
- Fixes show records when not connected

### v0.16.3

- Show records and describe tables when using multiple connections. #119
- Avoid asking password for already open connection

### v0.16.2

- Minor fix. Show records infinity loop.

### v0.16.0 and v0.16.1

See [v0.16.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.16.x.md)

## v0.15

See [v0.15.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.15.x.md)

## v0.14

Skipped.

## v0.13

See [v0.13.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.13.x.md)

## v0.12

See [v0.12.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.12.x.md)

## v0.11

See [v0.11.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.11.x.md)