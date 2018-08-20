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

let webthing;
try {
  webthing = require('webthing');
} catch (err) {
  webthing = require('../../webthing');
}

const Thing = webthing.Thing;
const GpioOnOffProperty = require('./gpio-property');

class Flex extends Thing {
  constructor(name, type, description) {
    super(name || 'Flex',
          type || 'SingleBoardComputer',
          description || 'A web connected Flex');
    const self = this;
    this.gpioOnOffProperties = [
      new GpioOnOffProperty(this, 'Relay', false,
                            {description:
                             'Actuator (on GPIO5)'},
                            {direction: 'out', pin: 5}),
      new GpioOnOffProperty(this, 'BlueLED', false,
                            {description:
                             'Actuator (on GPIO13)'},
                            {direction: 'out', pin: 13}),
      new GpioOnOffProperty(this, 'GreenLED', false,
                            {description:
                             'Actuator (on GPIO19)'},
                            {direction: 'out', pin: 19}),
      new GpioOnOffProperty(this, 'RedLED', false,
                            {description:
                             'Actuator (on GPIO26)'},
                            {direction: 'out', pin: 26}),
      new GpioOnOffProperty(this, 'Button', false,
                            {description:
                             'Push Button (on GPIO11)'},
                            {direction: 'in', pin: 11}),
      new GpioOnOffProperty(this, 'GPIO23', false,
                            {description:
                             'Input on GPIO 23 (unwired but modable)'},
                            {direction: 'in', pin: 23}),
    ];
    this.gpioOnOffProperties.forEach(function(property) {
      self.addProperty(property);
    });
  }

  close() {
    this.gpioOnOffProperties.forEach(function(property) {
      property.close && property.close();
    });
  }
}

module.exports = new Flex();
