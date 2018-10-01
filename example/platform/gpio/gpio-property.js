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

var gpio = require('gpio');

function GpioOutProperty(thing, name, value, metadata, config) {
  var _this = this;

  var self = this;
  var valueObject = new Value(value, function (value) {
    _this.handleValueChanged && _this.handleValueChanged(value);
  });
  Property.call(this, thing, name, valueObject, {
    '@type': 'OnOffProperty',
    label: metadata && metadata.label || "On/Off: ".concat(name),
    type: 'boolean',
    description: metadata && metadata.description || "GPIO Actuator on pin=".concat(config.pin)
  });
  {
    this.config = config;
    this.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.OUT
    }, function (err, port) {
      log("log: GPIO: ".concat(self.getName(), ": open: ").concat(err));

      if (err) {
        console.error("error: GPIO: ".concat(self.getName(), ": Fail to open: ").concat(err));
        return err;
      }
      self.port = port;
      self.handleValueChanged = function (value) {
        try {
          log("log: GPIO: ".concat(self.getName(), ": writing: ").concat(value));
          self.port.write(value);
          log("log: GPIO: ".concat(self.getName(), ": writing: ").concat(value));
        } catch (err) {
          console.error("error: GPIO: \n".concat(self.getName(), ": Fail to write: ").concat(err));
          return err;
        }
      };
    });
  }

  this.close = function () {
    try {
      self.port && self.port.closeSync();
    } catch (err) {
      console.error("error: GPIO: ".concat(_this.getName(), ": Fail to close: ").concat(err));
      return err;
    }

    log("log: GPIO: ".concat(_this.getName(), ": close:"));
  };

  return this;
}

function GpioInProperty(thing, name, value, metadata, config) {
  var _this2 = this;

  var self = this;
  var valueObject = new Value(Boolean(value), function (value) {
    self.handleValueChanged && self.handleValueChanged(value);
  });
  Property.call(this, thing, name, valueObject, {
    '@type': 'BooleanProperty',
    label: metadata && metadata.label || "On/Off: ".concat(name),
    type: 'boolean',
    readOnly: true,
    description: metadata && metadata.description || "GPIO Sensor on pin=".concat(config.pin)
  });
  {
    this.valueObject = valueObject;
    this.config = config;
    self.period = 1000;
    self.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.IN
    }, function (err) {
      log("log: GPIO: ".concat(self.getName(), ": open: ").concat(err, " (null expected)"));

      if (err) {
        console.error("error: GPIO: ".concat(self.getName(), ": Failed to open: ").concat(err));
        return null;
      }

      self.inverval = setInterval(function () {
        var value = self.port.readSync();

        if (value !== self.lastValue) {
          log("log: GPIO: ".concat(self.getName(), ": change: ").concat(value));
          self.valueObject.notifyOfExternalUpdate(value);
          self.lastValue = value;
        }
      }, self.period);
    });
  }

  self.close = function () {
    try {
      self.inverval && clearInterval(self.inverval);
      self.port && self.port.closeSync();
    } catch (err) {
      console.error("error: GPIO: ".concat(_this2.getName(), " close:").concat(err));
      return err;
    }

    log("log: GPIO: ".concat(_this2.getName(), ": close:"));
  };

  return this;
}

function GpioProperty(thing, name, value, metadata, config) {
  if (config.direction === 'out') {
    return new GpioOutProperty(thing, name, value, metadata, config);
  } else if (config.direction === 'in') {
    return new GpioInProperty(thing, name, value, metadata, config);
  }

  throw 'error: Invalid param';
}

module.exports = GpioProperty;
