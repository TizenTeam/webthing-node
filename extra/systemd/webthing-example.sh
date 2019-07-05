#!/bin/sh
set -x
set -e

# TODO
user=rzr

HOME=/home/$user
. ${HOME}/.bashrc
node --version

# iotjs example/simplest-thing.js 
make -C example/platform artik1020
