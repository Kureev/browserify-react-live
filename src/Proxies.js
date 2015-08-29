var ReactProxy = require('react-proxy');

function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}

function isObject(toTest) {
  return Object.prototype.toString.apply(toTest) === '[object Object]';
}

function isFunction(toTest) {
  return Object.prototype.toString.apply(toTest) === '[object Function]';
}

function isReactComponent(component) {
  return isFunction(component) && component.name &&
    isFunction(component.prototype.render);
}

function Proxies() {
  this.proxies = {};
}

Proxies.prototype = {
  get: function get(name) {
    // Preprocess name to shrink extension if supplied
    var proxyName = name.replace(/\.(js|jsx)$/, '');
    var proxy = this.proxies[proxyName];

    // If we don't have an exact match,
    // try to find by part of the name
    if (!proxy) {
      proxyName = Object.keys(this.proxies).filter(function iterateProxies(p) {
        if (isWindows()) {
          return proxyName.slice(-p.length) === p;
        }

        return p.slice(-proxyName.length) === proxyName;
      })[0];

      proxy = this.proxies[proxyName];
    }

    return proxy;
  },

  add: function add(name, component) {
    if (!name || !component) {
      return false;
    }

    var proxy;

    // If we already have a proxy with
    // this name, just return it
    if (proxy = this.get(name)) {
      return proxy;
    }

    // We can proxy only React Classes
    if (isReactComponent(component)) {
      proxy = ReactProxy.createProxy(component);
      this.proxies[name] = proxy;

      return proxy;
    }

    return false;
  },

  update: function update(name, newComponent) {
    var proxy = this.get(name);
    if (proxy) {
      return proxy.update(newComponent);
    }

    return false;
  },
};

module.exports = Proxies;
