/**
 * High-level Thing base class implementation.
 */

'use strict';

/**
 * A Web Thing.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thing = function () {
  /**
   * Initialize the object.
   *
   * @param {String} name The thing's name
   * @param {String} type (Optional) The thing's type(s)
   * @param {String} description (Optional) Description of the thing
   */
  function Thing(name, type, description) {
    _classCallCheck(this, Thing);

    if (!Array.isArray(type)) {
      type = [type];
    }

    this.name = name;
    this.context = 'https://iot.mozilla.org/schemas';
    this.type = type || [];
    this.description = description || '';
    this.properties = {};
    this.subscribers = new Set();
    this.hrefPrefix = '';
    this.uiHref = null;
  }

  /**
   * Return the thing state as a Thing Description.
   *
   * @returns {Object} Current thing state
   */


  _createClass(Thing, [{
    key: 'asThingDescription',
    value: function asThingDescription() {
      var thing = {
        name: this.name,
        href: this.hrefPrefix ? this.hrefPrefix : '/',
        '@context': this.context,
        '@type': this.type,
        properties: this.getPropertyDescriptions(),
        links: [{
          rel: 'properties',
          href: this.hrefPrefix + '/properties'
        }]
      };

      if (this.uiHref) {
        thing.links.push({
          rel: 'alternate',
          mediaType: 'text/html',
          href: this.uiHref
        });
      }

      if (this.description) {
        thing.description = this.description;
      }

      return thing;
    }

    /**
     * Get this thing's href.
     *
     * @returns {String} The href.
     */

  }, {
    key: 'getHref',
    value: function getHref() {
      if (this.hrefPrefix) {
        return this.hrefPrefix;
      }

      return '/';
    }

    /**
     * Get this thing's UI href.
     *
     * @returns {String|null} The href.
     */

  }, {
    key: 'getUiHref',
    value: function getUiHref() {
      return this.uiHref;
    }

    /**
     * Set the prefix of any hrefs associated with this thing.
     *
     * @param {String} prefix The prefix
     */

  }, {
    key: 'setHrefPrefix',
    value: function setHrefPrefix(prefix) {
      this.hrefPrefix = prefix;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.values(this.properties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var property = _step.value;

          property.setHrefPrefix(prefix);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Set the href of this thing's custom UI.
     *
     * @param {String} href The href
     */

  }, {
    key: 'setUiHref',
    value: function setUiHref(href) {
      this.uiHref = href;
    }

    /**
     * Get the name of the thing.
     *
     * @returns {String} The name.
     */

  }, {
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * Get the type context of the thing.
     *
     * @returns {String} The context.
     */

  }, {
    key: 'getContext',
    value: function getContext() {
      return this.context;
    }

    /**
     * Get the type(s) of the thing.
     *
     * @returns {String[]} The type(s).
     */

  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }

    /**
     * Get the description of the thing.
     *
     * @returns {String} The description.
     */

  }, {
    key: 'getDescription',
    value: function getDescription() {
      return this.description;
    }

    /**
     * Get the thing's properties as an object.
     *
     * @returns {Object} Properties, i.e. name -> description
     */

  }, {
    key: 'getPropertyDescriptions',
    value: function getPropertyDescriptions() {
      var descriptions = {};
      for (var name in this.properties) {
        descriptions[name] = this.properties[name].asPropertyDescription();
      }

      return descriptions;
    }

    /**
     * Add a property to this thing.
     *
     * @param {Object} property Property to add
     */

  }, {
    key: 'addProperty',
    value: function addProperty(property) {
      property.setHrefPrefix(this.hrefPrefix);
      this.properties[property.name] = property;
    }

    /**
     * Remove a property from this thing.
     *
     * @param {Object} property Property to remove
     */

  }, {
    key: 'removeProperty',
    value: function removeProperty(property) {
      if (this.properties.hasOwnProperty(property.name)) {
        delete this.properties[property.name];
      }
    }

    /**
     * Find a property by name.
     *
     * @param {String} propertyName Name of the property to find
     *
     * @returns {(Object|null)} Property if found, else null
     */

  }, {
    key: 'findProperty',
    value: function findProperty(propertyName) {
      if (this.properties.hasOwnProperty(propertyName)) {
        return this.properties[propertyName];
      }

      return null;
    }

    /**
     * Get a property's value.
     *
     * @param {String} propertyName Name of the property to get the value of
     *
     * @returns {*} Current property value if found, else null
     */

  }, {
    key: 'getProperty',
    value: function getProperty(propertyName) {
      var prop = this.findProperty(propertyName);
      if (prop) {
        return prop.getValue();
      }

      return null;
    }

    /**
     * Determine whether or not this thing has a given property.
     *
     * @param {String} propertyName The property to look for
     *
     * @returns {Boolean} Indication of property presence
     */

  }, {
    key: 'hasProperty',
    value: function hasProperty(propertyName) {
      return this.properties.hasOwnProperty(propertyName);
    }

    /**
     * Set a property value.
     *
     * @param {String} propertyName Name of the property to set
     * @param {*} value Value to set
     */

  }, {
    key: 'setProperty',
    value: function setProperty(propertyName, value) {
      var prop = this.findProperty(propertyName);
      if (!prop) {
        return;
      }

      prop.setValue(value);
    }

    /**
     * Notify all subscribers of a property change.
     *
     * @param {Object} property The property that changed
     */

  }, {
    key: 'propertyNotify',
    value: function propertyNotify(property) {
      var message = JSON.stringify({
        messageType: 'propertyStatus',
        data: _defineProperty({}, property.name, property.getValue())
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var subscriber = _step2.value;

          try {
            subscriber.send(message);
          } catch (e) {
            // do nothing
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return Thing;
}();

module.exports = Thing;