function isReloadable(name) {
  var isReact = ['react', 'react/addons', 'react-dom', ].indexOf(name) > -1;
  return !isReact;
}

module.exports = function overrideRequire(scope, req) {
  return function overrideRequire(name) {
    if (!isReloadable(name)) {
      if (name === 'react') {
        return scope.React;
      } else if (name === 'react-dom') {
        return scope.ReactDOM;
      } else if (name === 'react/addons') {
        return scope.ReactAddons;
      }
    } else {
      scope.modules = scope.modules || {};
      scope.modules[name] = req(name);

      return scope.modules[name];
    }
  };
};
