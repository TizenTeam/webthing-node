/**
 * High-level Property base class implementation.
 */

'use strict';

/**
 * A Property represents an individual state value of a thing.
 */
function Property(thing, name, value, metadata) {
  /**
   * Initialize the object.
   *
   * @param {Object} thing Thing this property belongs to
   * @param {String} name Name of the property
   * @param {Value} value Value object to hold the property value
   * @param {Object} metadata Property metadata, i.e. type, description, unit,
   *                          etc., as an object.
   */
  {
    var self = this;
    this.thing = thing;
    this.name = name;
    this.value = value;
    this.hrefPrefix = '';
    this.href = '/properties/' + this.name;
    this.metadata = metadata || {};

    // Add the property change observer to notify the Thing about a property
    // change.
    this.value.on('update', function(){
        self.thing.propertyNotify(self);
    });
  }

  /**
   * Get the property description.
   *
   * @returns {Object} Description of the property as an object.
   */
  this.asPropertyDescription = function() {
    var description = JSON.parse(JSON.stringify(this.metadata))
    description.href = this.hrefPrefix + this.href;
    return description;
  }

  /**
   * Set the prefix of any hrefs associated with this property.
   *
   * @param {String} prefix The prefix
   */
  this.setHrefPrefix = function(prefix) {
    this.hrefPrefix = prefix;
  }

  /**
   * Get the href of this property.
   *
   * @returns {String} The href
   */
  this.getHref = function() {
    return this.hrefPrefix + this.href;
  }

  /**
   * Get the current property value.
   *
   * @returns {*} The current value
   */
  this.getValue = function() {
    return this.value.get();
  }

  /**
   * Set the current value of the property.
   *
   * @param {*} value The value to set
   */
  this.setValue = function(value) {
    this.value.set(value);
  }

  /**
   * Get the name of this property.
   *
   * @returns {String} The property name.
   */
  this.getName = function() {
    return this.name;
  }

  /**
   * Get the thing associated with this property.
   *
   * @returns {Object} The thing.
   */
  this.getThing = function() {
    return this.thing;
  }

  /**
   * Get the metadata associated with this property
   *
   * @returns {Object} The metadata
   */
  this.getMetadata = function() {
    return this.metadata;
  }
  return this;
}

module.exports = Property;
