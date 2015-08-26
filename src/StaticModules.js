function StaticModules() {
  this.modules = {};
}

StaticModules.prototype = {
  get: function get(name) {
    return this.modules[name];
  },

  add: function add(name, content) {
    if (!name || !content) {
      return false;
    }

    this.modules[name] = content;
  },
};

module.exports = StaticModules;
