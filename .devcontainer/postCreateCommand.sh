#!/bin/bash

echo '*** Please do not respond to any VS Code notification about opening a workspace until after this script completes ***'
sleep 5

# Suppress warnings triggered by engine value package.json of a VS Code extension
yarn config set ignore-engines true -g

# We have to build with Node.js version 14
. $NVM_DIR/nvm.sh
nvm install 14

# Appending this to .bashrc means shells opened within the project tree will use the Node.js version specified in .nvmrc in the project root,
# provided no overriding .nvmrc is found between the shell's cwd and that root folder.
echo nvm use >> $HOME/.bashrc

# Initialize for building
yarn
