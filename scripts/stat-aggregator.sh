#!/bin/bash
set -x

MONGO_VERSION=3.2.9
UBUNTU_VERSION=x86_64-ubuntu1404

if [ ! -d "mongodb-linux-${UBUNTU_VERSION}-${MONGO_VERSION}" ]; then
    wget http://downloads.mongodb.org/linux/mongodb-linux-${UBUNTU_VERSION}-${MONGO_VERSION}.tgz
    tar xf mongodb-linux-${UBUNTU_VERSION}-${MONGO_VERSION}.tgz
fi

export PATH=$PATH:$PWD/mongodb-linux-${UBUNTU_VERSION}-${MONGO_VERSION}/bin

MONGO_SHELL_URL=$(echo "${MONGO_URL}" | awk -F "[@?]" '{print $2})')
MONGO_SHELL_USER=$(echo "${MONGO_URL}" | awk -F "[/:]" '{print $4}')
MONGO_SHELL_PASSWORD=$(echo "${MONGO_URL}" | awk -F "[:@]" '{print $3}')

mongo --ssl --sslAllowInvalidCertificates ${MONGO_SHELL_URL} -u ${MONGO_SHELL_USER} -p ${MONGO_SHELL_PASSWORD} underscore-min.js crunch.js
