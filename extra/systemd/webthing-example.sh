#!/bin/sh
set -x
set -e
cd /usr/share/local/src/webthing-node
iotjs example/simplest-thing.js 
cd /usr/local/opt/webthing-node

# TODO
user=rzr

HOME=/home/$user
. ${HOME}/.bashrc
node --version

# iotjs example/simplest-thing.js 
make -C example/platform artik1020
