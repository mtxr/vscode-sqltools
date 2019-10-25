---
name: Sessions and Multiple Connections
menu: Features
route: /features/sessions-and-multiple-connections
---

# Sessions and Multiple Connections

Sometimes is very useful to have SQL files attached to different connections.

On version v0.19 session files were introduced along with the ability of attaching and detaching connections from files.

## Session files

Session files are file that are attached to a connection.

You can use the setting `sqltools.autoOpenSessionFiles` to enable or disable session files to auto open when you open a connection.

![Session files](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/docs/assets/auto-open-session.gif)

If `sqltools.autoOpenSessionFiles` is enabled, every time you open a connection, a session file will be opened attached to the selected connection.

Also, switching to files that are attached, the respective connection is automatically set as active.

![Auto Switch](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/docs/assets/auto-switching.gif)

Now imagine that you have a SQL file open and you want to attach to a connection to execute all queries against that connection. You can manually attach and detach a connection from/to your SQL file.

![Attach/Detach](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/docs/assets/attach-detach-connection.gif)

Thats a new feature and still need more feedback to evolve. If you have any ideas and suggestions, please open a issue to help us to keep the project evolving!