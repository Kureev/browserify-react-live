var path = require('path');
var detective = require('detective');

function isNodeModule(name) {
  return name[0] !== '.';
}

function makeAddStaticModule(scope, req) {
  return function addStaticModule(name, fullName) {
    var module = scope.modules.get(name);

    if (!module) {
      try {
        module = req(name);
        scope.modules.add(fullName || name, module);
      } catch (e) {
        return false;
      }
    }

    return module;
  }
}

module.exports = function overrideRequire(scope, req, filename) {
  var addStaticModule = makeAddStaticModule(scope, req);

  return function overrideRequire(name) {
    if (isNodeModule(name)) {
      return addStaticModule(name);
    }

    var fullName = path.resolve(path.dirname(filename), name);

    if (fullName.indexOf(scope.baseDir) === 0) {
      fullName = fullName.slice(scope.baseDir.length);
    }

    // Try to find stored proxy by name
    var proxy = scope.proxies.get(fullName);

    // If succeeded, return proxied component
    if (proxy) {
      return proxy.get();
    }

    // Otherwise try to add static module
    var module = addStaticModule(name, fullName);

    // And then proxy it
    proxy = scope.proxies.add(fullName, module);

    if (proxy) {
      return proxy.get();
    }

    return module;
  };
};
