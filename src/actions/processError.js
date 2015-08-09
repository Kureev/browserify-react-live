var moment = require('moment');
var Logdown = require('logdown');

var error = new Logdown({ prefix: '[BPS:ERROR]', });
var stripAnsi = require('strip-ansi');

module.exports = function processError(data) {
  var timestamp = '['+ moment().format('HH:mm:ss') + ']';
  return error.error(timestamp, ' Error in file ' +
    data.file + ':\n' + stripAnsi(data.error));
};
