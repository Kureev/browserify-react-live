const fs = require('fs');
const WebSocketServer = require('ws').Server;

module.exports = function makeWSS(sources, port) {
  const wss = new WebSocketServer({ port: port, });

  wss.on('connection', function connection(ws) {
    ws.send(
      JSON.stringify({
        message: 'Connected to browserify-dev-server',
        sources: sources,
      })
    );
  });

  return wss;
};
