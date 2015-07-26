var moment = require('moment');
var Logdown = require('logdown');
var diff = require('diff');

var system = new Logdown({ prefix: '[BDS:SYSTEM]', });
var error = new Logdown({ prefix: '[BDS:ERROR]', });
var message = new Logdown({ prefix: '[BDS:MSG]', });
var size = 0;
var patched;
var timestamp;
var data;

/**
 * Convert bytes to kb + round it to xx.xx mask
 * @param  {Number} bytes
 * @return {Number}
 */
function bytesToKb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

module.exports = function injectWebSocket(scope) {
  if (scope.ws) return;
  scope.ws = new WebSocket('ws://localhost:8081');

  scope.ws.onmessage = function onMessage(res) {
    timestamp = '['+ moment().format('HH:mm:ss') + ']';
    data = JSON.parse(res.data);

    /**
     * Check for errors
     * @param  {String} data.error
     */
    if (data.error) {
      var errObj = data.error.match(/console.error\("(.+)"\)/)[1].split(': ');
      var errType = errObj[0];
      var errFile = errObj[1];
      var errMsg = errObj[2].match(/(.+) while parsing file/)[1];

      error.error(timestamp + ' Bundle *' + data.bundle + '* is corrupted:' +
        '\n\n ' + errFile + '\n\t ⚠ ' + errMsg + '\n');
    }

    /**
     * Setup initial bundle
     * @param  {String} data.source
     */
    if (data.source) {
      scope.initialBundle = data.source;

      system.log(timestamp + ' Initial bundle size: *' +
        bytesToKb(data.source.length) + 'kb*');
    }

    /**
     * Apply patch to initial bundle
     * @param  {Diff} data.patch
     */
    if (data.patch) {
      patched = diff.applyPatch(scope.initialBundle, data.patch);

      system.log(timestamp + ' Received patch for *' +
        data.bundle + '* (' + bytesToKb(data.patch.length) + 'kb)');

      Function('return ' + patched)();
    }

    /**
     * Some other info messages
     * @param  {String} data.message
     */
    if (data.message) {
      message.log(timestamp + ' ' + data.message);
    }
  };
};
