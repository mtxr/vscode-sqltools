#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

sudo rm $SCRIPT_DIR/local-mysqld -rf
mkdir -p $SCRIPT_DIR/local-mysqld
chmod -R 777 $SCRIPT_DIR/local-mysqld
