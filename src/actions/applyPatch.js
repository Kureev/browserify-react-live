var moment = require('moment');
var React = require('react');
var ReactProxy = require('react-proxy');
var bytesToKb = require('./bytesToKb');
var diff = require('diff');

var forceUpdate = ReactProxy.getForceUpdate(React);

/**
 * Parse patch file and log changes in a fancy way
 * @param  {String} patch
 * @return {Void}
 */
function logChanges(patch) {
  patch.split('\n').forEach(function iteratePatch(str) {
    if (str.match(/^\+\s/)) {
      console.log('%c' + str.replace(/^\+\s+/, '+ '), 'color: green');
    } else if (str.match(/^\-\s/)) {
      console.log('%c' + str.replace(/^-\s+/, '- '), 'color: red');
    }
  });
}

/**
 * Check if react hot replacement can
 * be applied to the module
 * @param  {Object} module
 * @return {Boolean}
 */
function canBePatched(module) {
  return module.exports &&
    (typeof module.exports === 'function') &&
    (module.exports.name || module.exports.displayName);
}

module.exports = function applyPatch(scope, source, data) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';

  console.groupCollapsed(timestamp, 'Patch for',
    data.file, '(' + bytesToKb(data.patch.length) + 'kb)');

  logChanges(data.patch);

  var patched = diff.applyPatch(source, data.patch);

  // Build full file path for require
  // var filename = scope.__root + '/' + data.file;
  var filename = data.file;

  // Building require for specific filename
  // In our custom require we'll use filename to scope relative paths
  var __require = require('../overrideRequire')(scope, require, filename);

  // Create anon function for our patched source
  var f = Function(['require', 'module', 'exports', ], patched);

  // Mock module to get function result
  var _module = {};

  // Run module like as browserify does
  f(__require, _module, {});

  if (canBePatched(_module)) {
    var mountedInstances = scope.proxies.update(filename, _module.exports);
    if (!mountedInstances) {
      throw Error('Can\'t find ' + filename + ' in mounted instances');
    }

    mountedInstances.forEach(forceUpdate);
  } else {
    scope.modules.update(filename, _module.exports);
  }

  scope.files.forEach(function iterateBundles(file) {
    if (file.file === data.file) {
      file.content = patched;
    }
  });

  console.groupEnd();
};
