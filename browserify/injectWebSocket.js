var moment = require('moment');
var Logdown = require('logdown');
var logger = new Logdown({ prefix: '[BDS]', });
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
      logger.log(timestamp + ' Initial bundle size: *' + size + 'kb*');
    }

    if (data.patch) {
      patched = diff.applyPatch(scope.initialBundle, data.patch);
      size = bytesToKb(data.patch.length);
      logger.log(timestamp + ' Received patch for *' + size + 'kb*');
      Function('return ' + patched)();
    }

    if (data.message) {
      console.log(data.message);
    }
  };
};
