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
var index  = require('../index');
var Property = index.Property;
var SingleThing = index.server.SingleThing;
var Thing = index.Thing;
var Value = index.Value;
var WebThingServer = index.server.WebThingServer;
var gpio = require('gpio');

function makeThing(context) {
  var self = this;
  var thing = new Thing('SensorExample', 'binarySensor', 'A sensor example that monitor a button');
  self.context = context;
  self.value = new Value(false);
  context.updatePropertyOnValue = function(value) {
    return !value;
  };
  thing.addProperty(
    new Property(thing,
                 'level',
                 value,
                 {type: 'number',
                  description: 'Whether the output is changed'}));
  setInterval(function() {
    var value = self.context.updatePropertyOnValue(self.value.lastValue);
    self.value.notifyOfExternalUpdate(value);
  }, 3000);
  return thing;
}

function runServer() {
  var port = process.argv[2] ? Number(process.argv[2]) : 8888;
  var pin = process.argv[3] ? Number(process.argv[3]) : 11;
  var url = 'http://localhost:' + port + '/properties/on';

  console.log('Usage:\n'
              + process.argv[0] + ' ' + process.argv[1] + ' [port] [gpio]\n\n'
              + 'Try:\ncurl -H "Content-Type: application/json" '
              + url + '\n');

  var context = {
    updatePropertyOnValue: null,
  };
  var thing = makeThing(context);
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function(){
    server.stop();
    process.exit();
  });
  var gpio_in = gpio.open({
    pin: pin,
    direction: gpio.DIRECTION.IN
  }, function(err) {
    if (err) {
      console.log("error: gpio: Can't be opened on pin " + pin);
      return err;
    }
    context.updatePropertyOnValue = function(value) {
      try {
        console.log("gpio: reading: pin#" + pin);
        value = gpio_in.readSync();
        console.log("gpio: read: " + value);
      } catch(err) {
        console.log("error: gpio: "  + pin);
      }
      return value;
    }
    server.start();
  });
}

runServer();
