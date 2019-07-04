// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const {
  Thing,
} = require('webthing');

const GpioProperty = require('../gpio/gpio-property');
const PwmProperty = require('../pwm/pwm-property');


class EdisonThing extends Thing {
  constructor(name, type, description) {
    super(name || 'Edison',
          type || [],
          description || 'A web connected Edison');
    const self = this;
    this.pinProperties = [
      new GpioProperty(this, 'GPIO45',
                       false,
                       {description: 'GPIO45 (J20-4 on breakout board)'},
                       {direction: 'out', pin: 45}),
      new PwmProperty(this, 'PWM0', 50, {
        description: 'Analog port of Edison',
      }),
    ];
    this.pinProperties.forEach((property) => {
      self.addProperty(property);
    });
  }

  close() {
    this.pinProperties.forEach((property) => {
      property.close && property.close();
    });
  }
}

module.exports = function() {
  if (!module.exports.instance) {
    module.exports.instance = new EdisonThing();
  }
  return module.exports.instance;
};
