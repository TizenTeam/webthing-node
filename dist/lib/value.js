/**
 * An observable, settable value interface.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');

/**
 * A property value.
 *
 * This is used for communicating between the Thing representation and the
 * actual physical thing implementation.
 *
 * Notifies all observers when the underlying value changes through an external
 * update (command to turn the light off) or if the underlying sensor reports a
 * new value.
 */

var Value = function (_EventEmitter) {
  _inherits(Value, _EventEmitter);

  /**
   * Initialize the object.
   *
   * @param {*} initialValue The initial value
   * @param {function} valueForwarder The method that updates the actual value
   *                                  on the thing
   */
  function Value(initialValue, valueForwarder) {
    _classCallCheck(this, Value);

    var _this = _possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).call(this));

    _this.lastValue = initialValue;
    if (!valueForwarder) {
      _this.valueForwarder = function () {
        throw new Error('Read-only value');
      };
    } else {
      _this.valueForwarder = valueForwarder;
    }
    return _this;
  }

  /**
   * Set a new value for this thing.
   *
   * @param {*} value Value to set
   */


  _createClass(Value, [{
    key: 'set',
    value: function set(value) {
      this.valueForwarder(value);
      this.notifyOfExternalUpdate(value);
    }

    /**
     * Return the last known value from the underlying thing.
     *
     * @returns the value.
     */

  }, {
    key: 'get',
    value: function get() {
      return this.lastValue;
    }

    /**
     * Notify observers of a new value.
     *
     * @param {*} value New value
     */

  }, {
    key: 'notifyOfExternalUpdate',
    value: function notifyOfExternalUpdate(value) {
      if (typeof value !== 'undefined' && value !== null && value !== this.lastValue) {
        this.lastValue = value;
        this.emit('update', value);
      }
    }
  }]);

  return Value;
}(EventEmitter);

module.exports = Value;