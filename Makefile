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

default: all

tmp_dir ?= tmp
runtime ?= iotjs
export runtime
eslint ?= node_modules/eslint/bin/eslint.js
babel ?= ./node_modules/.bin/babel
babelrc ?= ${CURDIR}/extra/${runtime}/.babelrc
babel_stamp_file += docs/babel.txt

srcs ?= $(wildcard *.js lib/*.js | sort | uniq)
run_args ?=
run_timeout ?= 10

main_src ?= example/multiple-things.js
NODE_PATH := .:${NODE_PATH}
export NODE_PATH


all: build

setup/%:
	${@F}

node_modules: package.json
	npm install

setup/node: node_modules
	@echo "NODE_PATH=$${NODE_PATH}"
	node --version
	npm --version

setup: setup/${runtime}

build/%: setup
	@echo "log: $@: $^"

build/node: setup node_modules eslint

build: build/${runtime}

run/%: ${main_src} build
	${@F} $< ${run_args}

run/npm: ${main_src} setup
	npm start

run: run/${runtime}

clean:
	rm -rf ${tmp_dir}

cleanall: clean
	rm *~

distclean: cleanall
	rm -rf node_modules

${tmp_dir}/rule/test/pid/%: ${main_src} build
	@mkdir -p "${@D}"
	${@F} $< & echo $$! > "$@"
	sleep ${run_timeout}
	cat $@

test/%: ${tmp_dir}/rule/test/pid/%
	cat $<
	curl http://localhost:8888 \
 || curl -I http://localhost:8888 \
	kill $$(cat $<) ||:
	kill -9 $$(cat $<) ||:

test/npm: package.json
	npm test

test: test/${runtime}

start: run

start/board/%: example/platform/Makefile example/platform/board/%.js
	${MAKE} -C ${<D} board/${@F}

check/%: ${srcs}
	${MAKE} setup
	@echo "log: SHELL=$${SHELL}"
	status=0 ; \
 for src in $^; do \
 echo "log: check: $${src}: ($@)" ; \
 ${@F} $${src} \
 && echo "log: check: $${src}: OK" \
 || status=1 ; \
 done ; \
	exit $${status}

check/npm:
	npm run lint

check: check/${runtime}

eslint: .eslintrc.js ${eslint}
	@rm -rf tmp/dist
	${eslint} --no-color --fix . ||:
	${eslint} --no-color .

eslint/setup: node_modules
	ls ${eslint} || npm install eslint-plugin-node eslint
	${eslint} --version

${eslint}:
	ls $@ || make eslint/setup
	touch $@

.eslintrc.js: ${eslint}
	ls $@ || $< --init

### IoT.js related rules:

setup/iotjs:
	iotjs \
 || echo "log: Should have printed iotjs's usage..."
	-which iotjs

build/iotjs: setup ${babel_stamp_file}
	echo "log: $@: $^"

babel: ${babelrc} ${babel}
	${babel} \
 --no-babelrc \
 --config-file "$<" \
 --delete-dir-on-start \
 --ignore 'node_modules/**,dist/**' \
 -d "${CURDIR}/tmp/dist/${runtime}/" \
 --verbose \
 .
	rsync -avx tmp/dist/${runtime}/ ./
	@rm -rf tmp/dist/${runtime}/

${babelrc}:
	ls $@ || echo '{ "ignore": [ "node_modules/**.js" ] }' > $@
	cat $@

babel/runtime/%:
	-git commit -am "WIP: babel: About to transpile for ${@F}"
	${MAKE} babel runtime=${@F}
	-git commit -am "${runtime}: Transpiled using babel"

babel/runtimes:
	${MAKE} babel/runtime/node
	${MAKE} babel/runtime/iotjs

babel/setup: Makefile
	ls node_modules || ${MAKE} node_modules
	-git commit -am "WIP: babel: About to setup"
	npm install @babel/cli
	npm install @babel/core
	npm install @babel/plugin-transform-arrow-functions
	npm install @babel/plugin-transform-block-scoping
	npm install @babel/plugin-transform-template-literals
	@echo "TODO: npm install @babel/plugin-transform-for-of"
	@echo "TODO: npm install @babel/plugin-transform-classes"
	npm install @babel/preset-env
	-git commit -am "WIP: babel: Installed tools"

${babel}:
	ls $@ || ${MAKE} babel/setup

docs/babel.txt:
	ls $@ && exit 0 || echo "log: Assuming it is not transpiled yet"
	${MAKE} babel/build
	${babel} --version > $@
	${babel} --help >> $@
	-git add "$@"
	-git commit -m "${runtime}: Add babel's doc file as build stamp" "$@"

babel/revert:
	@echo "TODO: move $@ patch and iotjs port at end of list"
	-git commit -am "WIP: babel: About to $@"
	git rebase -i remotes/upstream/master
	git revert HEAD
	git revert HEAD~2
	git revert HEAD~4

babel/build: eslint babel/runtime/node babel/runtime/${runtime}

babel/devel: babel/revert eslint
	${MAKE} babel/build
	git rebase -i remotes/upstream/master
