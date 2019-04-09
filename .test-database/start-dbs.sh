#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

sudo rm $SCRIPT_DIR/mysql/local-mysqld -rf
sudo mkdir -p $SCRIPT_DIR/mysql/local-mysqld
sudo chown -R 999:999 $SCRIPT_DIR/mysql/local-mysqld

docker-compose -f $SCRIPT_DIR/docker-compose.yml up $@ -d
