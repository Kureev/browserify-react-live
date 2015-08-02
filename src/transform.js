const through = require('through2');
const pjson = require('../package.json');

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
  return '\n' +
    'const options = JSON.parse(\'' + JSON.stringify(options) + '\');\n' +
    'const scope = window.__hmr = (window.__hmr || {});\n' +
    '(function() {\n' +
      'if (typeof window === \'undefined\') return;\n' +
      'if (!scope.initialized) {\n' +
        'require("' + pathTo('injectReactDeps') + '")(scope, options);\n' +
        'require("' + pathTo('injectWebSocket') + '")(scope, options);' +
        'scope.initialized = true;\n' +
      '}\n' +
    '})();\n';
}

/**
 * Override require to proxy react/component require
 * @return {String}
 */
function overrideRequire() {
  return '\n' +
    'require = require("' + pathTo('overrideRequire') + '")' +
    '(scope, require);';
}

/**
 * Decorate every component module by `react-hot-api` makeHot method
 * @return {String}
 */
function overrideExports() {
  return '\n' +
    ';(function() {\n' +
      'if (module.exports.name || module.exports.displayName) {\n' +
        'module.exports = scope.makeHot(module.exports);\n' +
      '}\n' +
    '})();\n';
}

module.exports = function applyReactHotAPI(file, options) {
  var content = [];

  return through(
    function transform(part, enc, next) {
      content.push(part);
      next();
    },

    function finish(done) {
      content = content.join('');
      const bundle = initialize(options) +
        overrideRequire() +
        content +
        overrideExports();

      this.push(bundle);
      done();
    }
  );
};
