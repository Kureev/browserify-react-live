const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8081, });

wss.on('connection', function connection(ws) {
  ws.send(JSON.stringify({ message: 'Connection complete', }));
});

module.exports = wss;
