/**
 * Node Web Thing server implementation.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var express = require('./express.js');

/**
 * A container for a single thing.
 */

var SingleThing = function () {
  /**
   * Initialize the container.
   *
   * @param {Object} thing The thing to store
   */
  function SingleThing(thing) {
    _classCallCheck(this, SingleThing);

    this.thing = thing;
  }

  /**
   * Get the thing at the given index.
   */


  _createClass(SingleThing, [{
    key: 'getThing',
    value: function getThing() {
      return this.thing;
    }

    /**
     * Get the list of things.
     */

  }, {
    key: 'getThings',
    value: function getThings() {
      return [this.thing];
    }

    /**
     * Get the mDNS server name.
     */

  }, {
    key: 'getName',
    value: function getName() {
      return this.thing.name;
    }
  }]);

  return SingleThing;
}();

/**
 * A container for multiple things.
 */


var MultipleThings = function () {
  /**
   * Initialize the container.
   *
   * @param {Object} things The things to store
   * @param {String} name The mDNS server name
   */
  function MultipleThings(things, name) {
    _classCallCheck(this, MultipleThings);

    this.things = things;
    this.name = name;
  }

  /**
   * Get the thing at the given index.
   *
   * @param {Number|String} idx The index
   */


  _createClass(MultipleThings, [{
    key: 'getThing',
    value: function getThing(idx) {
      idx = parseInt(idx);
      if (isNaN(idx) || idx < 0 || idx >= this.things.length) {
        return null;
      }

      return this.things[idx];
    }

    /**
     * Get the list of things.
     */

  }, {
    key: 'getThings',
    value: function getThings() {
      return this.things;
    }

    /**
     * Get the mDNS server name.
     */

  }, {
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }]);

  return MultipleThings;
}();

/**
 * Base handler that is initialized with a list of things.
 */


var BaseHandler = function () {
  /**
   * Initialize the handler.
   *
   * @param {Object} things List of Things managed by the server
   */
  function BaseHandler(things) {
    _classCallCheck(this, BaseHandler);

    this.things = things;
  }

  /**
   * Get the thing this request is for.
   *
   * @param {Object} req The request object
   * @returns {Object} The thing, or null if not found.
   */


  _createClass(BaseHandler, [{
    key: 'getThing',
    value: function getThing(req) {
      return this.things.getThing(req.params.thingId);
    }
  }]);

  return BaseHandler;
}();

/**
 * Handle a request to / when the server manages multiple things.
 */


var ThingsHandler = function (_BaseHandler) {
  _inherits(ThingsHandler, _BaseHandler);

  function ThingsHandler() {
    _classCallCheck(this, ThingsHandler);

    return _possibleConstructorReturn(this, (ThingsHandler.__proto__ || Object.getPrototypeOf(ThingsHandler)).apply(this, arguments));
  }

  _createClass(ThingsHandler, [{
    key: 'get',

    /**
     * Handle a GET request.
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    value: function get(req, res) {
      res.json(this.things.getThings().map(function (thing) {
        return thing.asThingDescription();
      }));
    }
  }]);

  return ThingsHandler;
}(BaseHandler);

/**
 * Handle a request to /.
 */


var ThingHandler = function (_BaseHandler2) {
  _inherits(ThingHandler, _BaseHandler2);

  function ThingHandler() {
    _classCallCheck(this, ThingHandler);

    return _possibleConstructorReturn(this, (ThingHandler.__proto__ || Object.getPrototypeOf(ThingHandler)).apply(this, arguments));
  }

  _createClass(ThingHandler, [{
    key: 'get',

    /**
     * Handle a GET request.
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    value: function get(req, res) {
      var thing = this.getThing(req);
      if (thing === null) {
        res.status(404).end();
        return;
      }

      res.json(thing.asThingDescription());
    }
  }]);

  return ThingHandler;
}(BaseHandler);

/**
 * Handle a request to /properties.
 */


var PropertiesHandler = function (_BaseHandler3) {
  _inherits(PropertiesHandler, _BaseHandler3);

  function PropertiesHandler() {
    _classCallCheck(this, PropertiesHandler);

    return _possibleConstructorReturn(this, (PropertiesHandler.__proto__ || Object.getPrototypeOf(PropertiesHandler)).apply(this, arguments));
  }

  _createClass(PropertiesHandler, [{
    key: 'get',

    /**
     * Handle a GET request.
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    value: function get(req, res) {
      var thing = this.getThing(req);
      if (thing === null) {
        res.status(404).end();
        return;
      }

      // TODO: this is not yet defined in the spec
      res.status(200).end();
    }
  }]);

  return PropertiesHandler;
}(BaseHandler);

/**
 * Handle a request to /properties/<property>.
 */


var PropertyHandler = function (_BaseHandler4) {
  _inherits(PropertyHandler, _BaseHandler4);

  function PropertyHandler() {
    _classCallCheck(this, PropertyHandler);

    return _possibleConstructorReturn(this, (PropertyHandler.__proto__ || Object.getPrototypeOf(PropertyHandler)).apply(this, arguments));
  }

  _createClass(PropertyHandler, [{
    key: 'get',

    /**
     * Handle a GET request.
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    value: function get(req, res) {
      var thing = this.getThing(req);
      if (thing === null) {
        res.status(404).end();
        return;
      }

      var propertyName = req.params.propertyName;
      if (thing.hasProperty(propertyName)) {
        res.json(_defineProperty({}, propertyName, thing.getProperty(propertyName)));
      } else {
        res.status(404).end();
      }
    }

    /**
     * Handle a PUT request.
     *
     * @param {Object} req The request object
     * @param {Object} res The response object
     */

  }, {
    key: 'put',
    value: function put(req, res) {
      var thing = this.getThing(req);
      if (thing === null) {
        res.status(404).end();
        return;
      }

      var propertyName = req.params.propertyName;
      if (!req.body.hasOwnProperty(propertyName)) {
        res.status(400).end();
        return;
      }

      if (thing.hasProperty(propertyName)) {
        try {
          thing.setProperty(propertyName, req.body[propertyName]);
        } catch (e) {
          res.status(403).end();
          return;
        }

        res.json(_defineProperty({}, propertyName, thing.getProperty(propertyName)));
      } else {
        res.status(404).end();
      }
    }
  }]);

  return PropertyHandler;
}(BaseHandler);

/**
 * Server to represent a Web Thing over HTTP.
 */


var WebThingServer = function () {
  /**
   * Initialize the WebThingServer.
   *
   * @param {Object} things Things managed by this server -- should be of type
   *                        SingleThing or MultipleThings
   * @param {Number} port Port to listen on (defaults to 80)
   * @param {Object} sslOptions SSL options to pass to the express server
   */
  function WebThingServer(things, port, sslOptions) {
    _classCallCheck(this, WebThingServer);

    this.things = things;
    this.name = things.getName();
    this.port = Number(port) || (sslOptions ? 443 : 80);
    if (this.things.constructor.name === 'MultipleThings') {
      var list = things.getThings();
      for (var i = 0; i < list.length; i++) {
        var thing = list[i];
        thing.setHrefPrefix('/' + i);
      }
    }

    this.app = express();
    this.server = http.createServer(this.app.request);

    var thingsHandler = new ThingsHandler(this.things);
    var thingHandler = new ThingHandler(this.things);
    var propertiesHandler = new PropertiesHandler(this.things);
    var propertyHandler = new PropertyHandler(this.things);

    if (this.things.constructor.name === 'MultipleThings') {
      this.app.get('/', function (req, res) {
        return thingsHandler.get(req, res);
      });
      this.app.get('/:thingId', function (req, res) {
        return thingHandler.get(req, res);
      });
      this.app.get('/:thingId/properties', function (req, res) {
        return propertiesHandler.get(req, res);
      });
      this.app.get('/:thingId/properties/:propertyName', function (req, res) {
        return propertyHandler.get(req, res);
      });
      this.app.put('/:thingId/properties/:propertyName', function (req, res) {
        return propertyHandler.put(req, res);
      });
    } else {
      this.app.get('/', function (req, res) {
        return thingHandler.get(req, res);
      });
      this.app.get('/properties', function (req, res) {
        return propertiesHandler.get(req, res);
      });
      this.app.get('/properties/:propertyName', function (req, res) {
        return propertyHandler.get(req, res);
      });
      this.app.put('/properties/:propertyName', function (req, res) {
        return propertyHandler.put(req, res);
      });
    }

    this.app.request = function (req, res) {
      self.app.request(req, res);
    };
  }

  /**
   * Start listening for incoming connections.
   */


  _createClass(WebThingServer, [{
    key: 'start',
    value: function start() {
      this.server.listen(this.port);
    }

    /**
     * Stop listening.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.server.close();
    }
  }]);

  return WebThingServer;
}();

module.exports = {
  MultipleThings: MultipleThings,
  SingleThing: SingleThing,
  WebThingServer: WebThingServer
};