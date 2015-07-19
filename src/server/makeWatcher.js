const chokidar = require('chokidar');
const check = require('syntax-error');
const fs = require('fs');

module.exports = function makeWatcher(bundle, callback) {
  return chokidar.watch(bundle)
    .on('error', function processError(err) {
      console.log('Oops, an error has been occured:', err);
    })
    .on('change', function onChange(path) {
      console.log('File', path, 'has been changed');

      const file = fs.readFileSync(bundle, 'utf8');
      const err = check(file);

      if (!err) {
        callback(file);
      }
    });
};
