var path = require('path');

function isNodeModule(name) {
  return name[0] !== '.';
}

function makeAddStaticModule(scope) {
  return function addStaticModule(name, content) {
    var module = scope.modules.get(name);

    if (!module) {
      module = content
    }

    scope.modules.add(name, module);

    return scope.modules.get(name);
  }
}

module.exports = function overrideRequire(scope, req, filename) {
  var addStaticModule = makeAddStaticModule(scope);

  return function overrideRequire(name) {
    if (isNodeModule(name)) {
      return addStaticModule(name, req(name));
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

    // Otherwise try to include a module
    if (module = scope.modules.get(fullName || name)) {
      return module;
    }

    var module = req(name);

    // And then proxy it
    proxy = scope.proxies.add(fullName, module);

    if (proxy) {
      return proxy.get();
    }

    // if it's not proxible, add it to static
    addStaticModule(fullName, module);

    return module;
  };
};
