module.exports = function injectReactDeps(scope) {
  scope.React = require('react');
  scope.ReactAddons = require('react/addons');
  scope.ReactMount = require('react/lib/ReactMount');
};
