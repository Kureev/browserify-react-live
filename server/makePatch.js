const jsdiff = require('diff');

module.exports = function scopeOriginal(original) {
  return function calculateDiff(changed) {
    return jsdiff.createPatch(Date.now(), original, changed);
  };
};
