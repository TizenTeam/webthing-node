const {
  Property,
  SingleThing,
  Thing,
  Value,
  WebThingServer,
} = require('webthing');
const uuidv4 = require('uuid/v4');


function makeThing() {
  const thing = new Thing('My Lamp', 'dimmableLight', 'A web connected lamp');

  thing.addProperty(
    new Property(thing,
                 'on',
                 new Value(true, () => {}),
                 {type: 'boolean',
                  description: 'Whether the lamp is turned on'}));
  thing.addProperty(
    new Property(thing,
                 'level',
                 new Value(50, () => {}),
                 {type: 'number',
                  description: 'The level of light from 0-100',
                  minimum: 0,
                  maximum: 100}));
  return thing;
}

function runServer() {
  const thing = makeThing();

  // If adding more than one thing, use MultipleThings() with a name.
  // In the single thing case, the thing's name will be broadcast.
  const server = new WebThingServer(new SingleThing(thing), 8888);

  process.on('SIGINT', () => {
    server.stop();
    process.exit();
  });

  server.start();
}

runServer();
