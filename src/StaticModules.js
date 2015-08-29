function StaticModules() {
  this.modules = {};
}

function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}

StaticModules.prototype = {
  get: function get(name) {
    var moduleName = name
      .replace(/\.(js|jsx)$/, '')
      .replace(/^\//, '');

    var module = this.modules[moduleName];

    // If we don't have an exact match,
    // try to find by part of the name
    if (!module) {
      moduleName = Object.keys(this.modules).filter(function iterateModules(p) {
        if (isWindows()) {
          return moduleName.slice(-p.length) === p;
        }

        return p.slice(-moduleName.length) === moduleName;
      })[0];

      module = this.modules[moduleName];
    }

    return module;
  },

  add: function add(name, content) {
    if (!name || !content) {
      return false;
    }

    var moduleName = name
      .replace(/\.(js|jsx)$/, '')
      .replace(/^\//, '');

    this.modules[moduleName] = content;
  },

  update: function update(name, content) {
    var module = this.get(name);

    if (module) {
      this.add(name, content);
    } else {
      throw Error('Can\'t update ' + name + ' before it has been set');
    }
  }
};

module.exports = StaticModules;
