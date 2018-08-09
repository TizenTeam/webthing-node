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

// TODO: disable logs here by editing to '!console.log'
const log = console.log || function() {};

let webthing;
try {
  webthing = require('webthing');
} catch (err) {
  webthing = require('../../webthing');
}

const WebThingServer = webthing.WebThingServer;
const SingleThing = webthing.SingleThing;

// Update with different board here if needed
let platform = 'artik710';
if (process.argv.length > 3) {
  platform = String(process.argv[3]);
}

log(`log: Loading platform: ${platform}`);
const thing = require(`./${platform}-thing.js`);

function runServer() {
  const port = process.argv[2] ? Number(process.argv[2]) : 8888;
  const url = `http://localhost:${port}`;

  log(`Usage:\n${
    process.argv[0]} ${process.argv[1]} [port]\n` +
        `Try:\ncurl -H "Accept: application/json" ${
          url}\n`);
  const server = new WebThingServer(new SingleThing(thing,
                                                    'SingleBoardComputer'),
                                    port);
  process.on('SIGINT', function() {
    server.stop();
    thing && thing.close();
    process.exit();
  });

  server.start();
}

runServer();
