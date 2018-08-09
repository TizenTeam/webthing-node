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
  webthing = require('../webthing');
}
const Thing = webthing.Thing;
const GpioOnOffProperty = require('./gpio-property');

function ARTIK05x(description) {
  Thing.call(this, 'ARTIK710', 'SingleBoardComputer',
             description || 'A web connected ARTIK710');
  const self = this;
  {
    self.gpioOnOffProperties = [
      new GpioOnOffProperty(this, 'BlueLED', false,
                            {description:
                             'Blue LED on interposer board (on GPIO38)'},
                            {direction: 'out', pin: 38}),
      new GpioOnOffProperty(this, 'RedLed', false,
                            {description:
                             'Red LED on interposer board (on GPIO28)'},
                            {direction: 'out', pin: 28}),
      new GpioOnOffProperty(this, 'SW403', false,
                            {description:
                             'Up Button: Nearest board edge,\
 next to red LED (on GPIO30)'},
                            {direction: 'in', pin: 30}),
      new GpioOnOffProperty(this, 'SW404', false,
                            {description:
                             'Down Button: Next to blue LED (on GPIO32)'},
                            {direction: 'in', pin: 32}),
    ];
    self.gpioOnOffProperties.forEach(function(property) {
      self.addProperty(property);
    });
  }

  this.close = function() {
    self.gpioOnOffProperties.forEach(function(property) {
      property.close && property.close();
    });
  };
}

module.exports = new ARTIK05x();
