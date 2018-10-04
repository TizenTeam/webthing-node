#!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

default: check

main_src ?= index.js
lib_srcs ?= $(wildcard */*.js | sort)
runtime ?= node
topreldir ?= ../..
topdir ?= ${CURDIR}/${topreldir}
run_args ?= start
sudo ?= sudo
tmp_dir ?= tmp
done_dir ?= ${tmp_dir}/done
SHELL := NODE_PATH=${topreldir} ${SHELL}

%: %/${runtime}
	echo "# $@: $^"

${done_dir}/%: %
	mkdir -p ${@}
	touch $@

setup/node: ${topreldir}/node_modules node_modules
	echo "$@: $^"

run/%: ${main_src} /sys/class/gpio/export
	ls $<
	-which ${@F}
	${@F} $< ${run_args}

run/node: ${main_src} package.json /sys/class/gpio/export
	ls -l node_modules || ${MAKE} node_modules
	ls -l ${topreldir}/node_modules || { cd ${topreldir} && npm install ; }
	npm run ${run_args}

board/%: ${main_src} board/%.js /sys/class/gpio/export ${done_dir}/setup/${runtime}
	${runtime} $< ${@F}

run: run/${runtime}

force:

/sys/class/gpio/export: force
	${sudo} cat /sys/kernel/debug/gpio

node_modules: package.json
	-which npm
	npm --version
	npm install
	@mkdir -p "$@"

package.json:
	npm init

${topreldir}/node_modules: ${topreldir}/package.json
	cd ${@D} && npm install


check/%: ${lib_srcs}
	status=0 ; \
	for src in $^; do \
 echo "log: check: $${src}: ($@)" ; \
 ${@F} $${src} \
 && echo "log: check: $${src}: OK" \
 || status=1 ; \
 done ; \
	exit $${status}

check: check/${runtime}


flex-phat/%: ${main_src} /sys/class/gpio/export
	-gpio -v || sudo apt-get install gpio
	gpio -g mode 11 up
	${MAKE} run/${@F} run_args="${@D}"


play-phat/%: ${main_src} /sys/class/gpio/export
	-lsmod | grep gpio_keys \
 && ${sudo} modprobe -rv gpio_keys \
 || echo "log: will use /sys/class/gpio/"
	${MAKE} run/${@F} run_args="${@D}"
