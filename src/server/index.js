const express = require('express');
const fs = require('fs');
const diff = require('diff');
const wss = require('./wss');
const broadcast = require('./notify')(wss);
const makeWatcher = require('./makeWatcher');
const app = express();

require('./routes')(app);

const args = process.argv.slice(2);
const bundle = args[0];

const sourceBundle = fs.readFileSync(bundle, 'utf8');

const watcher = makeWatcher(bundle, broadcast);

const server = app.listen(3000, function daemon() {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
