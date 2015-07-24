const jsdiff = require('diff');

module.exports = function scopeOriginal(original) {
  return function calculateDiff(changed) {
    if (!changed.length) return false;

    return jsdiff.createPatch(Date.now(), original, changed);
  };
};
