'use strict';

var _require = require('webthing'),
    Property = _require.Property,
    SingleThing = _require.SingleThing,
    Thing = _require.Thing,
    Value = _require.Value,
    WebThingServer = _require.WebThingServer;

var uuidv4 = require('uuid/v4');

function makeThing() {
  var thing = new Thing('My Lamp', ['OnOffSwitch', 'Light'], 'A web connected lamp');

  thing.addProperty(new Property(thing, 'on', new Value(true, function () {}), {
    '@type': 'OnOffProperty',
    label: 'On/Off',
    type: 'boolean',
    description: 'Whether the lamp is turned on'
  }));
  thing.addProperty(new Property(thing, 'brightness', new Value(50, function () {}), {
    '@type': 'BrightnessProperty',
    label: 'Brightness',
    type: 'number',
    description: 'The level of light from 0-100',
    minimum: 0,
    maximum: 100,
    unit: 'percent'
  }));

  return thing;
}

function runServer() {
  var thing = makeThing();

  // If adding more than one thing, use MultipleThings() with a name.
  // In the single thing case, the thing's name will be broadcast.
  var server = new WebThingServer(new SingleThing(thing), 8888);

  process.on('SIGINT', function () {
    server.stop();
    process.exit();
  });

  server.start();
}

runServer();