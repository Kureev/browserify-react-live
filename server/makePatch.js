const jsdiff = require('diff');

module.exports = function scopeOriginal(originalContent) {
  return function calculateDiff(changedContent) {
    if (!changedContent.length) return false;

    return jsdiff.createPatch(Date.now(), originalContent, changedContent);
  };
};
