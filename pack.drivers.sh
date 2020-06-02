#!/bin/bash

set -e
set -x

# temporary script
export DISPLAY_NAME=\"SQLTools\"
export NODE_ENV=production

rm -rf *.vsix || 'echo nothing to remove';
rm -rf dist || 'echo nothing to remove';
rm -rf packages/driver.mssql/out || 'echo nothing to remove';
rm -rf packages/driver.mysql/out || 'echo nothing to remove';
rm -rf packages/driver.pg/out || 'echo nothing to remove';
rm -rf packages/driver.sqlite/out || 'echo nothing to remove';

yarn run build || exit 1

checkAndPackDriver() {
  (
    cd packages/$1/ &&
    test -f "$PWD/out/extension.js" &&
    test -f "$PWD/out/ls/plugin.js" &&
    vsce package --yarn -o ../../.
  )
}

(cd dist && vsce package --yarn -o ../.)
checkAndPackDriver driver.mssql
checkAndPackDriver driver.mysql
checkAndPackDriver driver.pg
checkAndPackDriver driver.sqlite