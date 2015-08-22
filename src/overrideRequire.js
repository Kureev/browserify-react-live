var path = require('path');

function isNodeModule(name) {
  return name[0] !== '.';
}

module.exports = function overrideRequire(scope, req, filename) {
  scope.modules = scope.modules || {};

  return function overrideRequire(name) {
    var __name;
    if (isNodeModule(name)) {
      if (name === 'react') {
        return scope.React;
      } else if (name === 'react-dom') {
        return scope.ReactDOM;
      } else if (name === 'react/addons') {
        return scope.ReactAddons;
      } else {
        return req(name);
      }
    } else {
      __name = path.resolve(filename, '../', name);

      var module = Object.keys(scope.modules).filter(function (module) {
        return module.slice(-__name.length) === __name;
      })[0];

      if (scope.modules[module]) {
        return scope.modules[module];
      }

      scope.modules[__name] = req(name);
      return scope.modules[__name];
    }
  };
};
