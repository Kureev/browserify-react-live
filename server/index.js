const fs = require('fs');
const compose = require('ramda').compose;
const check = require('syntax-error');

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

module.exports = function runServer(files, options) {
  const pjsonConfigPort = process.env
    .npm_package_browserify_dev_server_port;

  const port = options.port || pjsonConfigPort || 8081;

  const sources = files.map(function iterateFiles(file) {
    return {
      file: file,
      content: fs.readFileSync(file, 'utf8'),
    };
  });

  const wss = require('./wss')(sources, port);
  const broadcast = require('./notify')(wss);
  const patch = require('./makePatch')(sources);
  const watcher = require('./makeWatcher')(files);

  watcher.setMaxListeners(0);

  watcher.on('change', function onChange(path) {
    const patchMessage = makeBuildPatchMessage(path);
    const timestamp = getTimestamp();
    /**
     * Get latest content of the watched path
     */
    fs.readFile(path, 'utf8', function processFile(readError, _content) {
      if (readError) {
        error.error(timestamp + ' Error reading file *' + path + '*');
        return;
      }
      /**
       * As long as watchify flush a file before
       * write content to it, chokidar catches this event
       * and fire `change` event for empty file.
       * Following code helps us avoid processing it ;)
       */
      if (!_content.length || check(_content)) return;

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
        compose(broadcast, patchMessage, patch)(path, _content);
      }
    });
  });

  logger.info(getTimestamp() +
    ' *Browserify development server* has been started ' +
    'on port *' + port + '*'
  );
};
