var moment = require('moment');
var Logdown = require('logdown');

var error = new Logdown({ prefix: '[BPS:ERROR]', });

module.exports = function processError(data) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';

  var errObj = data.error.match(/console.error\("(.+)"\)/)[1].split(': ');
  var errType = errObj[0];
  var errFile = errObj[1];
  var errMsg = errObj[2].match(/(.+) while parsing file/)[1];

  error.error(timestamp + ' File *' + data.file + '* is corrupted:' +
    '\n\n ' + errFile + '\n\t ⚠ ' + errMsg + '\n');
};
