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

default: all check

tmp_dir ?= tmp
done_dir ?= ${tmp_dir}/done
eslint ?= node_modules/eslint/bin/eslint.js
srcs ?= $(wildcard lib/*.js example/*/*.js | sort | uniq)
main_src ?= example/multiple-things.js
runtime ?= node
run_args ?=
SHELL :=NODE_PATH=. ${SHELL}

${done_dir}/%: %
	mkdir -p ${@}
	touch $@

all: build

clean:
	rm -rf ${tmp_dir}

cleanall: clean
	rm *~

distclean: cleanall
	rm -rf node_modules

build: eslint

node_modules: package.json
	npm install
	mkdir -p $@

package.json:
	npm init


run/%: ${main_src}
	${@F} $< ${run_args}

run/node: ${main_src} package.json node_modules
	npm start

run: run/${runtime}

start: run

start/board/%: example/platform/Makefile example/platform/board/%.js
	${MAKE} -C ${<D} board/${@F}

check/%: ${srcs}
	status=0 ; \
 for src in $^; do \
 echo "log: check: $${src}: ($@)" ; \
 ${@F} $${src} \
 && echo "log: check: $${src}: OK" \
 || status=1 ; \
 done ; \
	exit $${status}

check/node:
	npm run lint

check: check/${runtime}

eslint: .eslintrc.js
	${eslint} --no-color --fix . ||:
	${eslint} --no-color .

${eslint}: node_modules
	npm install eslint-plugin-node eslint
	ls $@

.eslintrc.js: ${eslint}
	$< --init

setup/node: package.json
	node --version
	npm --version
	npm install

setup: setup/${runtime}

${tmp_dir}/rule/test/pid/%: ${main_src}
	mkdir -p "${@D}"
	${@F} $< & echo $$! > "$@"

test/%: ${tmp_dir}/rule/test/pid/%
	cat $<
	sleep 10 
	curl http://localhost:8888
	kill $$(cat $<)

test/npm:
	npm test || echo "TODO:"

test: test/${runtime}
