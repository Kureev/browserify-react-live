function isReloadable(name) {
  // @todo Replace this sketch by normal one
  return name.indexOf('react') === -1;
}

module.exports = function overrideRequire(scope, req) {
  return function overrideRequire(name) {
    if (!isReloadable(name)) {
      if (name === 'react') {
        return scope.React;
      } else if (name === 'react-dom') {
        return scope.ReactDOM;
      }
    } else {
      scope.modules = scope.modules || {};
      scope.modules[name] = req(name);

      return scope.modules[name];
    }
  };
};
