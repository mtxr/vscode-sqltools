#!/bin/bash

echo
echo '*** Ignore the VS Code notification about opening a workspace until after this script completes.'
echo
echo '*** If setup progress bars cause linewrap, widen your terminal.'
echo
echo 'Setup will continue in 5 seconds...'
sleep 5

# Avoid unactionable prompt during GitHub Codespace setup, which causes the setup to fail.
#  ! Corepack is about to download https://registry.yarnpkg.com/yarn/-/yarn-1.22.22.tgz
#  ? Do you want to continue? [Y/n]  
##npm install -g --no-update-notifier corepack@latest
##corepack install
##corepack enable yarn
##echo "yarn version $(yarn --version)"

# Build with Node.js version 20
. $NVM_DIR/nvm.sh
nvm install 20

# Appending this to .bashrc means shells opened within the project tree will use the Node.js version specified in .nvmrc in the project root,
# provided no overriding .nvmrc is found between the shell's cwd and that root folder.
echo nvm use >> $HOME/.bashrc

# Install yarn
npm install --global yarn
echo "yarn version $(yarn --version)"

# Suppress warnings triggered by engine value package.json of a VS Code extension
yarn config set ignore-engines true -g

# Initialize for building
yarn
