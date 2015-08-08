var moment = require('moment');
var Logdown = require('logdown');
var bytesToKb = require('./bytesToKb');
var diff = require('diff');

var system = new Logdown({ prefix: '[BPS:SYSTEM]', });

module.exports = function applyPatch(scope, source, data) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';

  console.groupCollapsed(timestamp, 'Patch for', data.file);
  system.log('Received patch for *' +
    data.file + '* (' + bytesToKb(data.patch.length) + 'kb)');

  console.groupCollapsed('Patch content');
  console.log(data.patch);
  console.groupEnd();

  var patched = diff.applyPatch(source, data.patch);

  var filename = scope.__root + '/' + data.file;
  var __require = require('../overrideRequire')(scope, require, filename);
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
};
