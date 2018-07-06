/**
 * High-level Property base class implementation.
 */

'use strict';

/**
 * A Property represents an individual state value of a thing.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Property = function () {
  /**
   * Initialize the object.
   *
   * @param {Object} thing Thing this property belongs to
   * @param {String} name Name of the property
   * @param {Value} value Value object to hold the property value
   * @param {Object} metadata Property metadata, i.e. type, description, unit,
   *                          etc., as an object.
   */
  function Property(thing, name, value, metadata) {
    var _this = this;

    _classCallCheck(this, Property);

    this.thing = thing;
    this.name = name;
    this.value = value;
    this.hrefPrefix = '';
    this.href = '/properties/' + this.name;
    this.metadata = metadata || {};

    // Add the property change observer to notify the Thing about a property
    // change.
    this.value.on('update', function () {
      return _this.thing.propertyNotify(_this);
    });
  }

  /**
   * Get the property description.
   *
   * @returns {Object} Description of the property as an object.
   */


  _createClass(Property, [{
    key: 'asPropertyDescription',
    value: function asPropertyDescription() {
      var description = Object.assign({}, this.metadata);
      description.href = this.hrefPrefix + this.href;
      return description;
    }

    /**
     * Set the prefix of any hrefs associated with this property.
     *
     * @param {String} prefix The prefix
     */

  }, {
    key: 'setHrefPrefix',
    value: function setHrefPrefix(prefix) {
      this.hrefPrefix = prefix;
    }

    /**
     * Get the href of this property.
     *
     * @returns {String} The href
     */

  }, {
    key: 'getHref',
    value: function getHref() {
      return '' + this.hrefPrefix + this.href;
    }

    /**
     * Get the current property value.
     *
     * @returns {*} The current value
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.value.get();
    }

    /**
     * Set the current value of the property.
     *
     * @param {*} value The value to set
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value.set(value);
    }

    /**
     * Get the name of this property.
     *
     * @returns {String} The property name.
     */

  }, {
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * Get the thing associated with this property.
     *
     * @returns {Object} The thing.
     */

  }, {
    key: 'getThing',
    value: function getThing() {
      return this.thing;
    }

    /**
     * Get the metadata associated with this property
     *
     * @returns {Object} The metadata
     */

  }, {
    key: 'getMetadata',
    value: function getMetadata() {
      return this.metadata;
    }
  }]);

  return Property;
}();

module.exports = Property;