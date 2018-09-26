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
const fs = require('fs');

function Adc() {
  this.DIRECTION = {IN: 'in', OUT: 'out'};

  this.open = function(config, callback) {
    console.log('Adc.open: ');
    this.filename = '/sys/bus/platform/devices\
/c0053000.adc/iio:device0/in_voltage0_raw';
    fs.readFile(this.filename, 'utf-8', callback);
    return this;
  };
  this.readSync = function() {
    console.log('Adc.readSync: ');
    const contents = fs.readFileSync(this.filename, 'utf8');
    return contents;
  };
  this.closeSync = function() {
    console.log('Adc.closeSync: ');
  };
}


module.exports = new Adc();
