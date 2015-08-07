var path = require('path');

function isReloadable(name) {
  var isReact = ['react', 'react/addons', 'react-dom', ].indexOf(name) > -1;
  return !isReact;
}

module.exports = function overrideRequire(scope, req, filename) {
  scope.modules = scope.modules || [];

  return function overrideRequire(name) {
    var __name;
    if (!isReloadable(name)) {
      if (name === 'react') {
        return scope.React;
      } else if (name === 'react-dom') {
        return scope.ReactDOM;
      } else if (name === 'react/addons') {
        return scope.ReactAddons;
      }
    } else {
      __name = path.resolve(filename, '../', name);

      if (scope.modules[__name]) {
        return scope.modules[__name];
      }
      scope.modules[__name] = req(name);
      return scope.modules[__name];
    }
  };
};
