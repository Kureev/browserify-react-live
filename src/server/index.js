const express = require('express');
const fs = require('fs');
const diff = require('diff');
const wss = require('./wss');
const broadcast = require('./notify')(wss);
const makeWatcher = require('./makeWatcher');
const app = express();

const args = process.argv.slice(2);
const file = args[0];

const bundle = fs.readFileSync(file, 'utf8');

require('./routes')(bundle, app);

const watcher = makeWatcher(file, broadcast);

const server = app.listen(3000, function daemon() {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
