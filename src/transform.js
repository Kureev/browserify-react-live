const through = require('through2');
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
  var baseDir = options.baseDir;

  return '\n' +
    'var $$scope = window.__RLP = (window.__RLP || {});\n' +
    'if (!$$scope.initialized) {\n' +
      'var Proxies = require("' + pathTo('Proxies') + '");\n' +
      'var StaticModules = require("' + pathTo('StaticModules') + '");\n' +
      'require("' + pathTo('injectWebSocket') + '")($$scope, require, ' + port + ');\n' +
      '$$scope.baseDir = "' + baseDir + '";\n' +
      '$$scope.modules = new StaticModules();\n' +
      '$$scope.proxies = new Proxies();\n' +
      '$$scope.initialized = true;\n' +
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

/**
 * Generate overriden require function
 * @param  {String} filename
 * @return {String} Overriden require injection
 */
function overrideRequire(filename) {
  return 'require = require("' + pathTo('overrideRequire') + '")' +
  '($$scope, require, "' + filename + '");\n';
}

module.exports = function applyReactHotAPI(file, options) {
  var content = [];
  var port = options.port;

  return through(
    function transform(part, enc, next) {
      content.push(part); next();
    },

    function finish(done) {
      var prelude = '';
      content = content.join('');

      if (!isJSON(file)) {
        prelude = initialize({
          port: port,
          baseDir: path.resolve('./'),
        }) + overrideRequire(file);
      }

      this.push(prelude + content); done();
    }
  );
};
