#!/bin/bash

# temporary script
export DISPLAY_NAME=\"SQLTools\"
export NODE_ENV=production

rm -rf *.vsix
rm -rf dist
rm -rf packages/driver.mssql/out
rm -rf packages/driver.mysql/out
rm -rf packages/driver.pg/out
rm -rf packages/driver.sqlite/out

yarn run build || exit 1

(
  cd dist &&
  vsce package --yarn -o ../.
)&
(
  cd packages/driver.mssql/ &&
  vsce package --yarn -o ../../.
)&
(
  cd packages/driver.mysql/ &&
  vsce package --yarn -o ../../.
)&
(
  cd packages/driver.pg/ &&
  vsce package --yarn -o ../../.
)&
(
  cd packages/driver.sqlite/ &&
  vsce package --yarn -o ../../.
)&