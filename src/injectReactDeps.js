module.exports = function injectReactDeps(scope) {
  scope.React = require('react');
  scope.ReactAddons = require('react/addons');
  scope.ReactMount = require('react/lib/ReactMount');
  scope.makeHot = require('react-hot-api')(
    function getRootInstances() {
      return scope.ReactMount._instancesByReactRootID;
    }
  );
};
