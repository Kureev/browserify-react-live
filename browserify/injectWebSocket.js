var moment = require('moment');
var Logdown = require('logdown');
var system = new Logdown({ prefix: '[BDS:SYSTEM]', });
var message = new Logdown({ prefix: '[BDS:MSG]', });
var diff = require('diff');
var size = 0;
var patched;
var timestamp;
var data;

function bytesToKb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

module.exports = function injectWebSocket(scope) {
  if (scope.ws) return;
  scope.ws = new WebSocket('ws://localhost:8081');

  scope.ws.onmessage = function onMessage(res) {
    timestamp = '['+ moment().format('HH:mm:ss') + ']';
    data = JSON.parse(res.data);

    if (data.source) {
      scope.initialBundle = data.source;
      size = bytesToKb(data.source.length);
      system.log(timestamp + ' Initial bundle size: *' + size + 'kb*');
    }

    if (data.patch) {
      patched = diff.applyPatch(scope.initialBundle, data.patch);
      size = bytesToKb(data.patch.length);
      system.log(timestamp + ' Received patch for *' + size + 'kb*');
      Function('return ' + patched)();
    }

    if (data.message) {
      message.log(timestamp + ' ' + data.message);
    }
  };
};
