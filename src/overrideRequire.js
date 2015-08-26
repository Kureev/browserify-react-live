var path = require('path');
var StaticModules = require('./StaticModules');

function isNodeModule(name) {
  return name[0] !== '.';
}

module.exports = function overrideRequire(scope, req, filename) {
  scope.modules = scope.modules || new StaticModules();

  return function overrideRequire(name) {
    if (isNodeModule(name)) {
      if (name === 'react') {
        return scope.React;
      }

      if (name === 'react-dom') {
        return scope.ReactDOM;
      }

      if (name === 'react/addons') {
        return scope.ReactAddons;
      }

      return req(name);
    }

    var fullName = path.resolve(filename, '../', name);

    if (fullName.indexOf(scope.baseDir) === 0) {
      fullName = fullName.slice(scope.baseDir.length);
    }

    // Try to find stored proxy by name
    var proxy = scope.proxies.get(fullName);

    // If succeeded, return proxied component
    if (proxy) {
      return proxy.get();
    }

    // Otherwise check if we have it as static module
    var module = scope.modules.get(fullName);

    // If not, use standard require to get module
    if (!module) {
      module = req(name);
    }

    // And try to proxy it
    proxy = scope.proxies.add(fullName, module);

    if (proxy) {
      return proxy.get();
    }

    // Hm, seems it's not a React Component or whatever...
    scope.modules.add(fullName, module);

    return module;
  };
};
