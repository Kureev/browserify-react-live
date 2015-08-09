/**
 * Convert bytes to kb + round it to xx.xx mask
 * @param  {Number} bytes
 * @return {Number}
 */
module.exports = function bytesToKb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
};
