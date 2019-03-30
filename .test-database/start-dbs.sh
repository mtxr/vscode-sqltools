#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker-compose -f $SCRIPT_DIR/mssql/docker-compose.yml up $@ -d
docker-compose -f $SCRIPT_DIR/mysql/docker-compose.yml up $@ -d
docker-compose -f $SCRIPT_DIR/pgsql/docker-compose.yml up $@ -d

# if [ ! -d "$SCRIPT_DIR/oracle/docker-images-master" ];then
#   wget https://github.com/oracle/docker-images/archive/master.zip -O $SCRIPT_DIR/oracle/master.zip && \
#   (
#     cd $SCRIPT_DIR/oracle && \
#     unzip master.zip && \
#     wget http://download.oracle.com/otn/linux/oracle12c/122010/linuxx64_12201_database.zip -O $SCRIPT_DIR/oracle/docker-images-master/OracleDatabase/SingleInstance/dockerfiles/12.2.0.1/linuxx64_12201_database.zip
#   )
# fi
# (
#   cd $SCRIPT_DIR/oracle/docker-images-master/OracleDatabase/SingleInstance/dockerfiles && \
#   ./buildDockerImage.sh -v 12.2.0.1 –e
# )
# docker-compose -f $SCRIPT_DIR/oracle/docker-compose.yml up $@ -d