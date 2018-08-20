#!/bin/make -f

srcs ?= $(wildcard lib/*.js | sort )
main ?= example/platform/index.js

default: run/iotjs

run/iotjs: ${main}
	iotjs $<

run/node: ${main}
	NODE_PATH=.:extra node $<

check: ${srcs}
	for src in $^; do iotjs $${src} ; done

eslint: .eslintrc.js
	eslint --no-color --fix .
	eslint --no-color .

.eslintrc.js:
	echo npm install eslint-plugin-node@5.1.0 eslint
	eslint --init

test: example/multiple-things.js
	iotjs $< & pid=$$!
	sleep 10
	curl http://localhost:8888
	kill $$pid
