// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/
 */

const {
  Thing,
} = require('webthing');

const AdcProperty = require('../adc/adc-property');
const GpioProperty = require('../gpio/gpio-property');
const PwmProperty = require('../pwm/pwm-property');


class DefaultThing extends Thing {
  constructor(name, type, description) {
    super(name || 'Default',
          type || [],
          description || 'A web connected Default');
    const self = this;
    this.pinProperties = [

    ];
    this.pinProperties.forEach((property) => {
      self.addProperty(property);
    });

    this.setUiHref('http://purl.org/rzr/webthing-iotjs-opendata-20190202rzr');
  }

  close() {
    this.pinProperties.forEach((property) => {
      property.close && property.close();
    });
  }
}

module.exports = function() {
  if (!module.exports.instance) {
    module.exports.instance = new DefaultThing();
  }
  return module.exports.instance;
};
