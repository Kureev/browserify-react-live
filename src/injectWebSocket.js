var moment = require('moment');
var Logdown = require('logdown');
var diff = require('diff');

var system = new Logdown({ prefix: '[BDS:SYSTEM]', });
var error = new Logdown({ prefix: '[BDS:ERROR]', });
var message = new Logdown({ prefix: '[BDS:MSG]', });
var size = 0;
var port = 8081;
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

module.exports = function injectWebSocket(scope, req, customPort) {
  if (scope.ws) return;

  port = customPort ? customPort : port;

  scope.ws = new WebSocket('ws://localhost:' + port);

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

      error.error(timestamp + ' Bundle *' + data.file + '* is corrupted:' +
        '\n\n ' + errFile + '\n\t ⚠ ' + errMsg + '\n');
    }

    /**
     * Setup initial files
     * @param  {String} data.sources
     */
    if (data.sources) {
      scope.files = data.sources;

      scope.files.forEach(function iterateBundles(file) {
        system.log(timestamp + ' Initial file size: *' +
          bytesToKb(file.content.length) + 'kb*');
      });
    }

    /**
     * Apply patch to initial file
     * @param  {Diff} data.patch
     */
    if (data.patch) {
      console.groupCollapsed(timestamp, 'Patch for', data.file);
      system.log('Received patch for *' +
        data.file + '* (' + bytesToKb(data.patch.length) + 'kb)');

      var source = scope.files.filter(function filterBundle(file) {
        return file.file === data.file;
      })[0].content;

      system.log('Patch content:\n\n', data.patch, '\n\n');

      try {
        patched = diff.applyPatch(source, data.patch);
      } catch (e) {
        return error.error('Patch failed. Can\'t apply last patch to source: ' + e);
      }

      var filename = scope.__root + '/' + data.file;
      var __require = require('./overrideRequire')(scope, require, filename);
      var f = Function(['require', 'module', 'exports', ], patched);

      var _module = {};
      f(__require, _module, {});

      if (_module.exports &&
        (_module.exports.name || _module.exports.displayName)) {
        scope.makeHot(_module.exports);
      }

      scope.files.forEach(function iterateBundles(file) {
        if (file.file === data.file) {
          file.content = patched;
        }
      });

      system.log('Applied patch to *' + data.file + '*');
      console.groupEnd();
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
