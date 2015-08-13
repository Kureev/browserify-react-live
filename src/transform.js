const through = require('through2');
var minimatch = require('minimatch');
const pjson = require('../package.json');
const path = require('path');

/**
 * Resolve path to library file
 * @param  {String} file
 * @return {String}
 */
function pathTo(file) {
  return pjson.name + '/src/' + file;
}

/**
 * Initialize react live patch
 * @description Inject React & WS, create namespace
 * @param  {Object} options
 * @return {String}
 */
function initialize(options) {
  var port = options.port;

  return '\n' +
    'var $$scope = window.__RLP = (window.__RLP || {});\n' +
    'if (!$$scope.initialized) {\n' +
      'require("' + pathTo('injectReactDeps') + '")($$scope);\n' +
      'require("' + pathTo('injectWebSocket') + '")($$scope, require, ' + port + ');' +
      '$$scope.initialized = true;\n' +
    '}\n';
}

/**
 * Decorate every component module by `react-hot-api` makeHot method
 * @return {String}
 */
function overrideExports() {
  return '\n' +
    'if (module.exports && ' +
      '(module.exports.name || module.exports.displayName)) {\n' +
      'module.exports = $$scope.makeHot(module.exports);\n' +
    '}\n';
}

/**
 * Check if file is JSON (duck test)
 * @param  {String}  file
 * @return {Boolean}
 */
function isJSON(file) {
  return file.slice(-4) === 'json';
}

function overrideRequire() {
  return '\n' +
  'require = require("' + pathTo('overrideRequire') + '")' +
  '($$scope, require, __filename);\n';
}

function makeShouldBeDecorated(options) {
  var only = options.only;

  if (!only) {
    return function shouldBeDecorated() {
      return true;
    };
  }

  return function shouldBeDecorated(file) {
    return minimatch(file, options.only)
      || minimatch(file, '**/' + options.only);
  };
}

module.exports = function applyReactHotAPI(file, options) {
  var content = [];
  var shouldBeDecorated = makeShouldBeDecorated(options);

  return through(
    function transform(part, enc, next) {
      content.push(part);
      next();
    },

    function finish(done) {
      var bundle;
      content = content.join('');

      if (!shouldBeDecorated(file) || isJSON(file)) {
        bundle = content;
      } else {
        bundle = initialize(options) +
          overrideRequire() +
          content +
          overrideExports();
      }

      this.push(bundle);
      done();
    }
  );
};
