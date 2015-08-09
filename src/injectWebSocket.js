var processError = require('./actions/processError');
var storeSources = require('./actions/storeSources');
var applyPatch = require('./actions/applyPatch');

module.exports = function injectWebSocket(scope, req, port) {
  scope.ws = new WebSocket('ws://localhost:' + (port || 8081));
  scope.ws.onmessage = function onMessage(res) {
    var data = JSON.parse(res.data);

    /**
     * Handle error reports from patch-server
     * @param {String} data.error
     */
    if (data.error) {
      processError(data);
    }

    /**
     * Setup initial files
     * @param  {String} data.sources
     */
    if (data.sources) {
      storeSources(scope, data.sources);
    }

    /**
     * Apply patch to initial file
     * @param  {Diff} data.patch
     */
    if (data.patch) {
      var source = scope.files
        .filter(function filterBundle(file) {
          return file.file === data.file;
        })
        .map(function getContent(file) {
          return file.content;
        })
        .pop();

      applyPatch(scope, source, data);
    }
  };

  return scope.ws;
};
