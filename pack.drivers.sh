#!/bin/bash

# temporary script

rm -rf packages/driver.mssql/out
rm -rf packages/driver.mysql/out
rm -rf packages/driver.pg/out
rm -rf packages/driver.sqlite/out

yarn run build --env.pkg=driver.mssql --env.pkg=driver.mysql --env.pkg=driver.pg --env.pkg=driver.sqlite

(
  cd packages/driver.mssql/ &&
  vsce package --yarn &&
  mv *.vsix ../../.
)&
(
  cd packages/driver.mysql/ &&
  vsce package --yarn &&
  mv *.vsix ../../.
)&
(
  cd packages/driver.pg/ &&
  vsce package --yarn &&
  mv *.vsix ../../.
)&
(
  cd packages/driver.sqlite/ &&
  vsce package --yarn &&
  mv *.vsix ../../.
)&