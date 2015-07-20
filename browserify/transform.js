const through = require('through2');
const path = require('path');
const util = require('util');

function injectReact() {
  return `
    ;const scope = window.__hmr = (window.__hmr || {});
    (function() {
      if (typeof window === 'undefined') return;

      if (!scope.initialized) {
        require('browserify-react-live/browserify/injectReactDeps')(scope);
        require('browserify-react-live/browserify/injectWebSocket')(scope);
        scope.initialized = true;
      }
    })();
  `;
}

function overrideRequire() {
  return `
    require = require('browserify-react-live/browserify/overrideRequire')(require);
  `;
}

function overrideExports() {
  return `
    ;(function() {
      if (module.exports.name || module.exports.displayName) {
        module.exports = scope.makeHot(module.exports);
      }
    })();
  `;
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
        injectReact(),
        overrideRequire(),
        content,
        overrideExports()
      );

      this.push(bundle);
      done();
    }
  );
};
