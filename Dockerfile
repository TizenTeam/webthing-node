#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-
# SPDX-License-Identifier: MPL-2.0
#{
# Copyright: 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

FROM node:10
MAINTAINER Philippe Coval (p.coval@samsung.com)

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

ENV project webthing-node
ADD . /usr/local/${project}/${project}
WORKDIR /usr/local/${project}/${project}
RUN echo "#log: ${project}: Preparing sources" \
  && set -x \
  && node --version \
  && which npm \
  && npm --version \
  && npm install \
  && echo 'exports.logging = true;' >> node_modules/gpio/lib/gpio.js \
  && echo 'TODO: https://github.com/EnotionZ/GpiO/pull/50'
  && sed -e 's|fs.exists | fs.existsSync|g' -i node_modules/gpio/lib/gpio.js \
  && ls -l /sys/class/gpio \
  && npm run test || echo "TODO: check package.json" \
  && sync

EXPOSE 8888
WORKDIR /usr/local/${project}/${project}
ENTRYPOINT [ "/usr/local/bin/npm", "run" ]
CMD [ "start" ]
