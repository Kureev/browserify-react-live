const through = require('through2');
const path = require('path');
const util = require('util');

function injectReact() {
  return `
    ;const scope = window.__hmr = (window.__hmr || {});
    (function() {
      if (typeof window === 'undefined') return;

      if (!scope.initialized) {
        require('browserify-react-live/src/browserify/injectReactDeps')(scope);
        require('browserify-react-live/src/browserify/injectWebSocket')(scope);
        scope.initialized = true;
      }
    })();
  `;
}

function overrideRequire() {
  return `
    function isReloadable(name) {
      // @todo Replace this sketch by normal one
      return name.indexOf('react') === -1;
    }

    require = (function(req) {
      return function(name) {
        if (!isReloadable(name)) {
          if (name === 'react') {
            return scope.React;
          } else if (name === 'react-dom') {
            return scope.ReactDOM;
          }
        } else {
          if (!scope["__reactModule_"+name] ||
            scope["__reactModule_"+name] != req(name)) {
            scope["__reactModule_"+name] = req(name);
          }

          return scope["__reactModule_"+name];
        }
      } else {
        return req(name);
      }
    })(require);
  `;
}

function overrideExports() {
  return `
    ;(function() {
      if (module.exports.name || module.exports.displayName) {
        module.exports = window.__hmr.makeHot(module.exports);
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
