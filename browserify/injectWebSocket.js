function bytesToKb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

module.exports = function injectWebSocket(scope) {
  scope.ws = new WebSocket('ws://localhost:8081');

  scope.ws.onmessage = function onMessage(res) {
    var diff = require('diff');
    var size = 0;
    var patched;
    var data = JSON.parse(res.data);

    if (data.source) {
      scope.initialBundle = data.source;
      size = bytesToKb(data.source.length);
      console.log('Initial bundle size:', size, 'kb');
    }

    if (data.patch) {
      patched = diff.applyPatch(scope.initialBundle, data.patch);
      size = bytesToKb(data.patch.length);
      console.log('Received patch for ', size, 'kb');
      Function('return ' + patched)();
    }

    if (data.message) {
      console.log(data.message);
    }
  };
};
