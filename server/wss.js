const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8081, });

module.exports = function makeWSS(source) {
  wss.on('connection', function connection(ws) {
    ws.send(
      JSON.stringify({
        message: 'Connected to browserify-dev-server',
        source: source,
      })
    );
  });

  return wss;
};
