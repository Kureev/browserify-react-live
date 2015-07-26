const fs = require('fs');
const makeWatcher = require('./makeWatcher');
const compose = require('ramda').compose;

const Logdown = require('logdown');
const chalk = require('chalk');
const moment = require('moment');
const logger = new Logdown({ prefix: '[BDS:SYSTEM]', });
const error = new Logdown({ prefix: '[BDS:ERROR]', });

function makeBuildPatchMessage(file) {
  return function buildPatchMessage(patch) {
    return {
      bundle: file,
      patch: patch,
    };
  };
}

function checkPatch(patch) {
  if (patch) {
    return patch;
  }
}

function getTimestamp() {
  return '['+ moment().format('HH:mm:ss') + ']';
}

module.exports = function runServer(file) {
  const content = fs.readFileSync(file, 'utf8');
  const wss = require('./wss')(content);
  const broadcast = require('./notify')(wss);
  const patchMessage = makeBuildPatchMessage(file);
  const patch = require('./makePatch')(content);
  const watcher = makeWatcher(file);

  watcher.on('change', function onChange(path) {
    const timestamp = getTimestamp();
    /**
     * Get latest content of the watched path
     */
    const _content = fs.readFileSync(path, 'utf8');

    /**
     * As long as watchify flush a file before
     * write content to it, chokidar catches this event
     * and fire `change` event for empty file.
     * Following code helps us avoid processing it ;)
     */
    if (!_content.length) return;

    /**
     * Check for syntax errors
     */
    const err = _content.match(/SyntaxError:/) ? _content : null;

    if (err) {
      const errObj = err.match(/console.error\("(.+)"\)/)[1].split(': ');
      const errType = errObj[0];
      const errFile = errObj[1];
      const errMsg = errObj[2].match(/(.+) while parsing file/)[1];

      error.error(timestamp + ' Bundle *' + path + '* is corrupted:' +
        '\n\n ' + chalk.red(errFile + '\n') +
        chalk.yellow('\t ⚠ ' + errMsg) + '\n');

      broadcast({
        bundle: path,
        error: err,
      });
    } else {
      logger.info(timestamp + ' Bundle *' + path + '* has been changed');
      compose(broadcast, patchMessage, patch)(_content);
    }
  });

  logger.info(getTimestamp() + ' *Browserify development server* has been started');
};
