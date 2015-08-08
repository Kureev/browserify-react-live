var moment = require('moment');
var Logdown = require('logdown');
var bytesToKb = require('./bytesToKb');

var system = new Logdown({ prefix: '[BPS:SYSTEM]', });

module.exports = function storeSources(scope, sources) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';
  scope.files = scope.files || sources;

  console.groupCollapsed(timestamp, 'Initialized react-live-patch');

  scope.files.forEach(function iterateSources(source) {
    system.log(timestamp + ' File *' + source.file + '*(' +
      bytesToKb(source.content.length) + 'Kb) has been added to react-live-patch');
  });

  console.groupEnd();
};
