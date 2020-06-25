#!/bin/bash

set -e

export DISPLAY_NAME=SQLTools
export NODE_ENV=production

VSCE=$(yarn bin)/vsce
OUTDIR=$PWD
$VSCE --version

yarn run rimraf -rf *.vsix dist

yarn run concurrently --kill-others-on-fail \
  "(cd packages/driver.mssql/ && yarn run package && mv *.vsix '$OUTDIR/.')" \
  "(cd packages/driver.mysql/ && yarn run package && mv *.vsix '$OUTDIR/.')" \
  "(cd packages/driver.pg/ && yarn run package && mv *.vsix '$OUTDIR/.')" \
  "(cd packages/driver.sqlite/ && yarn run package && mv *.vsix '$OUTDIR/.')" \
  "yarn run build:pack"

ls -hal *.vsix