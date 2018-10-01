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
'use strict';

var console = require('console'); // Disable logs here by editing to '!console.log'


var log = console.log || function () {};

var webthing;

try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing');
}

var Property = webthing.Property;
var Value = webthing.Value;

var artik = require('artik-sdk');

function AdcInProperty(thing, name, value, metadata, config) {
  var self = this; // name || name = `ADC${config.pin}`;

  Property.call(this, thing, name, new Value(value, function (value) {
    self.handleValueChanged && self.handleValueChanged(value);
  }), {
    '@type': 'LevelProperty',
    label: metadata && metadata.label || "Level: ".concat(name),
    type: 'number',
    readOnly: true,
    description: metadata && metadata.description || "ADC Sensor on pin=".concat(config.pin)
  });
  {
    config.frequency = config.frequency || 1;
    config.range = config.range || 4096;
    self.period = 1000.0 / config.frequency;
    this.config = config;
    this.port = artik.adc(config.pin, name);
    this.inverval = setInterval(function () {
      self.port.request();
      var value = self.port.get_value();
      log("log: ADC: ".concat(self.getName(), ": update:\n 0x").concat(Number(value).toString(0xF)));
      value = Number(Math.floor(100.0 * value / self.config.range));

      if (value !== self.lastValue) {
        log("log: ADC: ".concat(self.getName(), ": change: ").concat(value));
        self.value.notifyOfExternalUpdate(value);
        self.lastValue = value;
      }
    }, self.period);
  }

  this.close = function () {
    try {
      this.inverval && clearInterval(this.inverval);
      this.port = null;
    } catch (err) {
      console.error("error: ADC: ".concat(self.getName(), " close:").concat(err));
      return err;
    }

    log("log: ADC: ".concat(self.getName(), ": close:"));
  };

  return this;
}

function AdcProperty(thing, name, value, metadata, config) {
  if (config.direction === 'in') {
    return new AdcInProperty(thing, name, value, metadata, config);
  }

  throw 'error: Invalid param';
}

module.exports = AdcProperty;