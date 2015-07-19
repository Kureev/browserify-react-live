const express = require('express');
const fs = require('fs');
const chokidar = require('chokidar');
const check = require('syntax-error');
const app = express();
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8081, });

const args = process.argv.slice(2);
const bundle = args[0];

app.get('/dev.bundle.js', function(req, res) {
  fs.createReadStream(bundle).pipe(res);
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  console.log('received new connection');

  ws.send(JSON.stringify({ message: 'Connection complete', }));
});

chokidar.watch(bundle)
  .on('error', function(err) {
    console.log('Oops, an error has been occured:', err);
  })
  .on('change', function(path) {
    console.log('File', path, 'has been changed');

    const file = fs.readFileSync(bundle, 'utf8');
    const err = check(file);

    if (!err) {
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ source: file, }));
      });
    }
  });

const server = app.listen(3000, function() {

  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
