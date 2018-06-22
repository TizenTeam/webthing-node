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

function makeThing() {
  var self = this;
  var thing = new Thing('SensorExample', 'multiLevelSensor', 'An actuator example that just log');

  self.value = new Value(0,0);
  thing.addProperty(
    new Property(thing,
                 'level',
                 value,
                 {type: 'number',
                  description: 'Whether the output is changed'}));
  setInterval(function() {
    console.log(JSON.stringify(value));
    self.value.notifyOfExternalUpdate(++self.value.lastValue);
  }, 3000);
  return thing;
}

function runServer() {
  var port = process.argv[2] ? Number(process.argv[2]) : 8888;
  var url = 'http://localhost:' + port + '/properties/on';

  console.log('Usage:\n'
              + process.argv[0] + ' ' + process.argv[1] + ' [port]\n\n'
              + 'Try:\ncurl -H "Content-Type: application/json" '
              + url + '\n');

  var thing = makeThing();
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function(){
    server.stop();
    process.exit();
  });
  server.start();
}

runServer();
