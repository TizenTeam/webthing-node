'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('webthing'),
    MultipleThings = _require.MultipleThings,
    Property = _require.Property,
    Thing = _require.Thing,
    Value = _require.Value,
    WebThingServer = _require.WebThingServer;

var uuidv4 = require('uuid/v4');

/**
 * A dimmable light that logs received commands to stdout.
 */

var ExampleDimmableLight = function (_Thing) {
  _inherits(ExampleDimmableLight, _Thing);

  function ExampleDimmableLight() {
    _classCallCheck(this, ExampleDimmableLight);

    var _this = _possibleConstructorReturn(this, (ExampleDimmableLight.__proto__ || Object.getPrototypeOf(ExampleDimmableLight)).call(this, 'My Lamp', ['OnOffSwitch', 'Light'], 'A web connected lamp'));

    _this.addProperty(new Property(_this, 'on', new Value(true, function (v) {
      return console.log('On-State is now', v);
    }), {
      '@type': 'OnOffProperty',
      label: 'On/Off',
      type: 'boolean',
      description: 'Whether the lamp is turned on'
    }));

    _this.addProperty(new Property(_this, 'brightness', new Value(50, function (v) {
      return console.log('Brightness is now', v);
    }), {
      '@type': 'BrightnessProperty',
      label: 'Brightness',
      type: 'number',
      description: 'The level of light from 0-100',
      minimum: 0,
      maximum: 100,
      unit: 'percent'
    }));

    _this.addProperty(_this.getOnProperty());
    _this.addProperty(_this.getLevelProperty());
    return _this;
  }

  _createClass(ExampleDimmableLight, [{
    key: 'getOnProperty',
    value: function getOnProperty() {
      return new Property(this, 'on', new Value(true, function (v) {
        return console.log('On-State is now', v);
      }), { type: 'boolean',
        description: 'Whether the lamp is turned on' });
    }
  }, {
    key: 'getLevelProperty',
    value: function getLevelProperty() {
      return new Property(this, 'level', new Value(50, function (l) {
        return console.log('New light level is', l);
      }), { type: 'number',
        description: 'The level of light from 0-100',
        minimum: 0,
        maximum: 100 });
    }
  }]);

  return ExampleDimmableLight;
}(Thing);

/**
 * A humidity sensor which updates its measurement every few seconds.
 */


var FakeGpioHumiditySensor = function (_Thing2) {
  _inherits(FakeGpioHumiditySensor, _Thing2);

  function FakeGpioHumiditySensor() {
    _classCallCheck(this, FakeGpioHumiditySensor);

    var _this2 = _possibleConstructorReturn(this, (FakeGpioHumiditySensor.__proto__ || Object.getPrototypeOf(FakeGpioHumiditySensor)).call(this, 'My Humidity Sensor', ['MultiLevelSensor'], 'A web connected humidity sensor'));

    _this2.level = new Value(0.0);
    _this2.addProperty(new Property(_this2, 'level', _this2.level, {
      '@type': 'LevelProperty',
      label: 'Humidity',
      type: 'number',
      description: 'The current humidity in %',
      minimum: 0,
      maximum: 100,
      unit: 'percent'
    }));

    // Poll the sensor reading every 3 seconds
    setInterval(function () {
      // Update the underlying value, which in turn notifies all listeners
      var newLevel = _this2.readFromGPIO();
      console.log('setting new humidity level:', newLevel);
      _this2.level.notifyOfExternalUpdate(newLevel);
    }, 3000);
    return _this2;
  }

  /**
   * Mimic an actual sensor updating its reading every couple seconds.
   */


  _createClass(FakeGpioHumiditySensor, [{
    key: 'readFromGPIO',
    value: function readFromGPIO() {
      return Math.abs(70.0 * Math.random() * (-0.5 + Math.random()));
    }
  }]);

  return FakeGpioHumiditySensor;
}(Thing);

function runServer() {
  // Create a thing that represents a dimmable light
  var light = new ExampleDimmableLight();

  // Create a thing that represents a humidity sensor
  var sensor = new FakeGpioHumiditySensor();

  // If adding more than one thing, use MultipleThings() with a name.
  // In the single thing case, the thing's name will be broadcast.
  var server = new WebThingServer(new MultipleThings([light, sensor], 'LightAndTempDevice'), 8888);

  process.on('SIGINT', function () {
    server.stop();
    process.exit();
  });

  server.start();
}

runServer();