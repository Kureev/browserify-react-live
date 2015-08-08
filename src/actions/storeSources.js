var moment = require('moment');
var Logdown = require('logdown');
var bytesToKb = require('./bytesToKb');

var system = new Logdown({ prefix: '[BPS:SYSTEM]', });

module.exports = function storeSources(scope, sources) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';
  scope.files = scope.files || sources;

  scope.files.forEach(function iterateBundles(file) {
    system.log(timestamp + ' Initial file size: *' +
      bytesToKb(file.content.length) + 'Kb*');
  });
};
