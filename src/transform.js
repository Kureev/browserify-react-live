const through = require('through2');
const path = require('path');
const util = require('util');

function initialize(options) {
  return '\n' +
    'const options = JSON.parse(\'' + JSON.stringify(options) + '\');\n' +
    'const scope = window.__hmr = (window.__hmr || {});\n' +
    '(function() {\n' +
      'if (typeof window === \'undefined\') return;\n' +
      'if (!scope.initialized) {\n' +
        'require(\'browserify-react-live/browserify/injectReactDeps\')(scope, options);\n' +
        'require(\'browserify-react-live/browserify/injectWebSocket\')(scope, options);' +
        'scope.initialized = true;\n' +
      '}\n' +
    '})();\n';
}

function overrideRequire() {
  return '\n' +
    'require = require("browserify-react-live/browserify/overrideRequire")' +
    '(scope, require);';
}

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
      const bundle = util.format('%s%s%s%s',
        initialize(options),
        overrideRequire(),
        content,
        overrideExports()
      );

      this.push(bundle);
      done();
    }
  );
};
