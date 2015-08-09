var moment = require('moment');
var bytesToKb = require('./bytesToKb');
var diff = require('diff');

module.exports = function applyPatch(scope, source, data) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';

  console.groupCollapsed(timestamp, 'Patch for',
    data.file, '(' + bytesToKb(data.patch.length) + 'kb)');

  var patchArr = data.patch.split('\n');
  patchArr.forEach(function iteratePatch(str) {
    if (str.match(/^\+\s/)) {
      console.log('%c' + str.replace(/^\+\s+/, '+ '), 'color: green');
    } else if (str.match(/^\-\s/)) {
      console.log('%c' + str.replace(/^-\s+/, '- '), 'color: red');
    }
  });

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

  console.groupEnd();
};
