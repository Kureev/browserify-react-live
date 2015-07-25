const chokidar = require('chokidar');
const check = require('syntax-error');
const fs = require('fs');

const Logdown = require('logdown');
const moment = require('moment');
const logger = new Logdown({ prefix: '[BDS:SYSTEM]', });

module.exports = function makeWatcher(bundle, callback) {
  return chokidar.watch(bundle)
    .on('error', function processError(err) {
      logger.error('Oops, an error has been occured: ' + err);
    })
    .on('change', function onChange(path) {
      const file = fs.readFileSync(bundle, 'utf8');
      const err = check(file);

      if (!err) {
        const date = '['+ moment().format('HH:mm:ss') + ']';

        logger.log(date + ' File *' + path + '* has been changed');
        callback(file);
      }
    });
};
