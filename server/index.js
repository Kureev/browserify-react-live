const fs = require('fs');
const makeWatcher = require('./makeWatcher');
const compose = require('ramda').compose;

const Logdown = require('logdown');
const moment = require('moment');
const logger = new Logdown({ prefix: '[BDS:SYSTEM]', });

module.exports = function runServer(file) {
  const content = fs.readFileSync(file, 'utf8');
  const wss = require('./wss')(content);
  const broadcast = require('./notify')(wss);
  const patch = require('./makePatch')(content);
  const watcher = makeWatcher(file, compose(broadcast, patch));
  const date = '['+ moment().format('HH:mm:ss') + ']';

  logger.log(date + ' *Browserify development server* has been started');
};
