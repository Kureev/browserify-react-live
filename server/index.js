const express = require('express');
const fs = require('fs');
const makeWatcher = require('./makeWatcher');
const compose = require('ramda').compose;
const app = express();

const args = process.argv.slice(2);
const file = args[0];

const bundle = fs.readFileSync(file, 'utf8');
const patchBundle = require('./makePatch')(bundle);
const wss = require('./wss')(bundle);
const broadcast = require('./notify')(wss);

require('./routes')(bundle, app);

const watcher = makeWatcher(file, compose(broadcast, patchBundle));

const server = app.listen(3000, function daemon() {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
