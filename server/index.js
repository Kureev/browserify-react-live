const express = require('express');
const fs = require('fs');
const makeWatcher = require('./makeWatcher');
const compose = require('ramda').compose;
const app = express();

module.exports = function runServer(file) {

  const content = fs.readFileSync(file, 'utf8');
  const wss = require('./wss')(content);
  const broadcast = require('./notify')(wss);

  const patch = require('./makePatch')(content);

  app.get('/favicon.ico', function getFavico(req, res) {
    res.status(404).end();
  });

  app.get('/dev.bundle.js', function defaultBundle(req, res) {
    res.send(fs.readFileSync(file, 'utf8'));
  });

  const watcher = makeWatcher(file, compose(broadcast, patch));
  const server = app.listen(3000, function daemon() {

    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
};
