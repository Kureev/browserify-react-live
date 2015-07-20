const through = require('through2');
const path = require('path');
const util = require('util');

function injectReact() {
  return `
    ;(function() {
      if (typeof window !== 'undefined') {
        const scope = window.__hmr = (window.__hmr || {});

        if (!scope.React || !scope.ReactMount || !scope.ws) {
          scope.React = require('react');
          scope.ReactMount = require('react/lib/ReactMount');
          scope.ws = new WebSocket('ws://localhost:8081');
          var diff = require('diff');

          scope.ws.onmessage = function(res) {
            var data = JSON.parse(res.data);
            if (data.source) {
              scope.initialBundle = data.source;
              var size = Math.round((data.source.length / 1024) * 100) / 100;
              console.log('Initial bundle size:', size, 'kb');
            }

            if (data.patch) {
              var patched = diff.applyPatch(scope.initialBundle, data.patch);
              var size = Math.round((data.patch.length / 1024) * 100) / 100;
              console.log('Received patch for ', size, 'kb');
              Function('return ' + patched)();
            }

            if (data.message) {
              console.log(data.message);
            }
          }
        }
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
      if (typeof window !== 'undefined' || !isReloadable(name)) {
        const scope = window.__hmr;
        return function(name) {
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
      if (typeof window !== 'undefined') {
        if (module.exports.name || module.exports.displayName) {
          const scope = window.__hmr;
          scope.makeHot = scope.makeHot ||
            require('react-hot-api')(function() {
              return scope.ReactMount._instancesByReactRootID;
            });
          module.exports = scope.makeHot(module.exports);
        }
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
    });
};
