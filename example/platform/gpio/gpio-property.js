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

const console = require('console');

// Disable logs here by editing to '!console.log'
const log = console.log || function() {};

let webthing;
try {
  webthing = require('../../../webthing');
} catch (err) {
  webthing = require('webthing');
}
const Property = webthing.Property;
const Value = webthing.Value;

const gpio = require('gpio');

function GpioOutProperty(thing, name, value, metadata, config) {
  const self = this;
  const valueObject = new Value(value, (value) => {
    this.handleValueChanged && this.handleValueChanged(value);
  });
  Property.call(this, thing, name, valueObject,
                {
                  '@type': 'OnOffProperty',
                  label: (metadata && metadata.label) || `On/Off: ${name}`,
                  type: 'boolean',
                  description: (metadata && metadata.description) ||
              (`GPIO Actuator on pin=${config.pin}`),
                });
  {
    this.config = config;
    this.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.OUT,
    }, (err) => {
      log(`log: GPIO: ${self.getName()}: open: ${err}`);
      if (err) {
        console.error(`error: GPIO: ${self.getName()}: Fail to open: ${err}`);
        return err;
      }

      self.handleValueChanged = (value) => {
        try {
          log(`log: GPIO: ${self.getName()}: \
writing: ${value}`);
          self.port.write(value);
        } catch (err) {
          console.error(`error: GPIO: 
${self.getName()}: Fail to write: ${err}`);
          return err;
        }
      };
    });
  }

  this.close = () => {
    try {
      self.port && self.port.closeSync();
    } catch (err) {
      console.error(`error: GPIO: ${this.getName()}: Fail to close: ${err}`);
      return err;
    }
    log(`log: GPIO: ${this.getName()}: close:`);
  };

  return this;
}

function GpioInProperty(thing, name, value, metadata, config) {
  const self = this;
  const valueObject = new Value(Boolean(value), (value) => {
    self.handleValueChanged && self.handleValueChanged(value);
  });
  Property.call(this, thing, name, valueObject,
                {
                  '@type': 'BooleanProperty',
                  label: (metadata && metadata.label) || `On/Off: ${name}`,
                  type: 'boolean',
                  readOnly: true,
                  description:
            (metadata && metadata.description) ||
              (`GPIO Sensor on pin=${config.pin}`),
                });
  {
    this.valueObject = valueObject;
    this.config = config;
    self.period = 1000;
    self.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.IN,
    }, function(err) {
      log(`log: GPIO: ${self.getName()}: open: ${err} (null expected)`);
      if (err) {
        console.error(`error: GPIO: ${self.getName()}: Failed to open: ${err}`);
        return null;
      }

      self.inverval = setInterval(function() {
        const value = self.port.readSync();
        if (value !== self.lastValue) {
          log(`log: GPIO: ${self.getName()}: change: ${value}`);
          self.valueObject.notifyOfExternalUpdate(value);
          self.lastValue = value;
        }
      }, self.period);
    });
  }

  self.close = () => {
    try {
      self.inverval && clearInterval(self.inverval);
      self.port && self.port.closeSync();
    } catch (err) {
      console.error(`error: GPIO: ${this.getName()} close:${err}`);
      return err;
    }
    log(`log: GPIO: ${this.getName()}: close:`);
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
