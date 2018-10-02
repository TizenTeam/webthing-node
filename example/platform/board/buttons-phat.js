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
var webthing;

try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing');
}

var Thing = webthing.Thing;

var GpioProperty = require('../gpio/gpio-property');

function ButtonsPHatThing(name, type, description) {
  var self = this;
  Thing.call(this, name || 'FlexPHat', type || [], description || 'A web connected Flex RaspberryPi Hat');
  {
    this.gpioProperties = [new GpioProperty(this, 'B1', false, {
      description: 'SW1 Sensor Bottom Button on GPIO4 (Pin7)'
    }, {
      direction: 'in',
      pin: 13
    }), new GpioProperty(this, 'B2', false, {
      description: 'SW2 Sensor button on GPIO17 (Pin11)'
    }, {
      direction: 'in',
      pin: 19
    }), new GpioProperty(this, 'B3', false, {
      description: 'SW3 Sensor button on GPIO22 (Pin15)'
    }, {
      direction: 'in',
      pin: 26
    }), new GpioProperty(this, 'Green', false, {
      description: 'SW3 Sensor button on GPIO22 (Pin15)'
    }, {
      direction: 'out',
      pin: 4
    }), new GpioProperty(this, 'Orange', false, {
      description: 'SW3 Sensor button on GPIO22 (Pin15)'
    }, {
      direction: 'out',
      pin: 3
    }), new GpioProperty(this, 'Red', false, {
      description: 'SW3 Sensor button on GPIO22 (Pin15)'
    }, {
      direction: 'out',
      pin: 2
    })];
    this.gpioProperties.forEach(function (property) {
      self.addProperty(property);
    });
  }
  this.close = function () {
    this.gpioProperties.forEach(function (property) {
      property.close && property.close();
    });
  }
  return this;
}

module.exports = function () {
  if (!module.exports.instance) {
    module.exports.instance = new ButtonsPHatThing();
  }

  return module.exports.instance;
};
