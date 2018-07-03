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
var Gpio = require('onoff').Gpio;

function makeThing(context) {
  var self = this;
  var thing = new Thing('GpioSensorExample', 'binarySensor', 'A sensor example that monitor a button');
  self.context = context;
  thing.value = new Value(false);
  context.updatePropertyOnValue = function(value) {
    return !value;
  };
  thing.addProperty(
    new Property(thing,
                 'on',
                 thing.value,
                 {type: 'boolean',
                  description: 'Whether the output is changed'}));
  return thing;
}

function runServer() {
  var self = this;
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
  self.thing = makeThing(context);
  self.server = new WebThingServer(new SingleThing(self.thing), port);
  console.log("gpio: pin#" + pin);
  const input = new Gpio(pin,'in', 'rising');
  console.log("gpio: pin#" + pin);
  self.delay = 5000; //TODO: update if needed 42 is good value too
  self.count = 0;
  self.lastOnDate = new Date();

  process.on('SIGINT', function(){
    server.stop();
    input.unexport();
    process.exit();
  });

  input.watch(function (err, value) {
    console.log("watch: " + value);
    if (err) throw err;
    if (!self.count++) {
      return self.server.start();
    }
    var now = new Date();
    var delay = (now - self.lastOnDate);
    console.log("delay" + delay);
    if (value && ( delay >= self.delay))
    {
      var toggle  = ! self.thing.value.get();
      console.log("switching: " + toggle);
      self.thing.value.notifyOfExternalUpdate(toggle);
      self.lastOnDate = now;
    }
  });
}

runServer();
