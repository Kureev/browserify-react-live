const jsdiff = require('diff');

module.exports = function scopeOriginal(sources) {
  return function calculateDiff(file, changedContent) {
    if (!changedContent.length) return false;

    const originalContent = sources.filter(function filterSources(source) {
      return source.file === file;
    })[0].content;

    return jsdiff.createPatch(Date.now(), originalContent, changedContent);
  };
};
