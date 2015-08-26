var path = require('path');

function isNodeModule(name) {
  return name[0] !== '.';
}

module.exports = function overrideRequire(scope, req, filename) {
  scope.modules = scope.modules || {};

  return function overrideRequire(name) {
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
      var __name = path.resolve(filename, '../', name);
      // Try to find stored proxy by name
      var proxy = scope.proxies.get(__name);

      // If succeeded, return proxied component
      if (proxy) {
        return proxy.get();
      }

      // Otherwise use standard require to get module
      var module = req(name);
      // And try to proxy it
      proxy = scope.proxies.add(name, module);

      if (proxy) {
        return proxy.get();
      }

      return module;
    }
  };
};
