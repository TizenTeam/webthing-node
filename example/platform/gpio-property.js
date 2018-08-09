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
// Disable logs here by editing to '!console.log'
const log = console.log || function() {};

let webthing;
try {
  webthing = require('webthing');
} catch (err) {
  webthing = require('../../webthing');
}

const Property = webthing.Property;
const Value = webthing.Value;

const gpio = require('gpio');

class GpioSwitchOnOffProperty extends Property {
  constructor(thing, name, value, metadata, config) {
    const valueObject = new Value(value, (value) => {
      this.handleValueChanged && this.handleValueChanged(value);
    });
    super(thing, name, valueObject,
          {
            '@type': 'OnOffProperty',
            label: (metadata && metadata.label) || `On/Off: ${name}`,
            type: 'boolean',
            description: (metadata && metadata.description) ||
              (`GPIO Switch on pin=${config.pin}`),
          });
    const self = this;
    self.config = config;
    self.thing = thing;
    this.port = gpio.export(config.pin,
                            {direction: 'out',
                             ready: () => {
                               log(`log: gpio: ${self.getName()}: ready`);
                               self.handleValueChanged = function(value) {
                                 try {
                                   log(`log: gpio: ${self.getName()}:
writing: ${value}`);
                                   self.port.set(value);
                                 } catch (err) {
                                   console.error(`error: gpio: 
${self.getName()}: Fail to write: ${err}`);
                                   return err;
                                 }
                               };
                             }});
  }

  close() {
    try {
      this.port && this.port.unexport(this.config.pin);
    } catch (err) {
      console.error(`error: gpio: ${this.getName()}: Fail to close: ${err}`);
      return err;
    }
  }
}

class GpioSensorOnOffProperty extends Property {
  constructor(thing, name, value, metadata, config) {
    const valueObject = new Value(value, function(value) {
      thing.handleValueChanged && thing.handleValueChanged(value); // TODO
    });
    super(thing, name, valueObject,
          {
            '@type': 'BooleanProperty',
            label: (metadata && metadata.label) || `On/Off: ${name}`,
            type: 'boolean',
            description:
            (metadata && metadata.description) ||
              (`GPIO Sensor on pin=${config.pin}`),
          });
    const self = this;
    this.config = config;
    // TODO, 1000 is working , 42 is not faster, polling about 5sec
    this.period = 500;
    this.value = valueObject;
    this.port = gpio.export(config.pin,
                            {direction: 'in',
                             ready: () => {
                               log(`log: ${self.getName()} ready:`);
                               self.inverval = setInterval(function() {
                                 self.port._get((value) => {
                                   log(`log: gpio:
 ${self.getName()}: update: ${value}`);
                                   if (value !== self.lastValue) {
                                     const bool = Boolean(value);
                                     self.value.notifyOfExternalUpdate(bool);
                                   }
                                   self.lastValue = value;
                                 });
                               }, self.period);
                             }});
  }

  close() {
    try {
      this.inverval && clearInterval(this.inverval);
      this.port && this.port.unexport(this.config.pin);
    } catch (err) {
      console.error(`error: gpio: ${this.getName()} close:${err}`);
    }
  }
}


function GpioOnOffProperty(thing, name, value, metadata, config) {
  if (config.direction === 'out') {
    return new GpioSwitchOnOffProperty(thing, name, value, metadata, config);
  } else if (config.direction === 'in') {
    return new GpioSensorOnOffProperty(thing, name, value, metadata, config);
  }
  throw 'error: Invalid param';
}

module.exports = GpioOnOffProperty;
