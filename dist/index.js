"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var matches = require("lodash").matches;
// TODO: remove this single dependency
var BehaveEvents = _interopRequire(require("behave-events"));

var guid = (function () {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  };

  return function () {
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };
})();

var each = function (collection, fn) {
  var idx = 0;
  for (var i = 0, len = collection.length; i < len; i++) {
    fn(collection[i], idx++, collection);
  }
};

var any = function (collection, fn) {
  var idx = 0;
  for (var i = 0, len = collection.length; i < len; i++) {
    if (fn(collection[i], idx++, collection)) return collection[i];
  }
};

var map = function (collection, fn) {
  var idx = 0,
      ret = [];
  for (var i = 0, len = collection.length; i < len; i++) {
    ret.push(fn(collection[i], idx++, collection));
  }
  return ret;
};

var filter = function (collection, fn) {
  var idx = 0,
      ret = [];
  for (var i = 0, len = collection.length; i < len; i++) {
    if (fn(collection[i], idx++, collection)) ret.push(collection[i]);
  }
  return ret;
};

var BehaveCollection = (function (BehaveEvents) {
  function BehaveCollection() {
    var models = arguments[0] === undefined ? [] : arguments[0];
    this._id = "bc-" + guid();
    this.models = models;
    return this;
  }

  _inherits(BehaveCollection, BehaveEvents);

  _prototypeProperties(BehaveCollection, null, {
    add: {
      value: function add(model) {
        var opts = arguments[1] === undefined ? {} : arguments[1];
        this.models.push(model);
        if (!opts.silent) this.emit("add", model);
        return model;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    batch: {
      value: function batch(models) {
        var _this = this;
        var opts = arguments[1] === undefined ? {} : arguments[1];
        each(models, function (m) {
          _this.add(m, opts);
        });
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    remove: {
      value: function remove(id) {
        var opts = arguments[1] === undefined ? {} : arguments[1];
        var idx, toRemove;
        for (var i = 0; i < this.models.length; i++) {
          if (this.models[i]._id === id) idx = i;
        }

        toRemove = this.models.splice(idx, 1);
        if (!toRemove.length) return;
        if (!opts.silent) this.emit("remove", toRemove[0]);
        return toRemove[0];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    purge: {
      value: function purge() {
        this.models.length = 0;
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    find: {
      value: function find(params) {
        var testDeepMatch = matches(params);
        return filter(this.models, function (m) {
          return testDeepMatch(m.toJS());
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    findWhere: {
      value: function findWhere(params) {
        var testDeepMatch = matches(params);
        return any(this.models, function (m) {
          return testDeepMatch(m.toJS());
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    each: {
      value: (function (_each) {
        var _eachWrapper = function each() {
          return _each.apply(this, arguments);
        };

        _eachWrapper.toString = function () {
          return _each.toString();
        };

        return _eachWrapper;
      })(function (fn) {
        each(this.models, fn);
        return this;
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    map: {
      value: (function (_map) {
        var _mapWrapper = function map() {
          return _map.apply(this, arguments);
        };

        _mapWrapper.toString = function () {
          return _map.toString();
        };

        return _mapWrapper;
      })(function (fn) {
        return map(this.models, fn);
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    filter: {
      value: (function (_filter) {
        var _filterWrapper = function filter() {
          return _filter.apply(this, arguments);
        };

        _filterWrapper.toString = function () {
          return _filter.toString();
        };

        return _filterWrapper;
      })(function (fn) {
        return filter(this.models, fn);
      }),
      writable: true,
      enumerable: true,
      configurable: true
    },
    toJS: {
      value: function toJS() {
        return map(this.models, function (m) {
          return m.toJS();
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toJSON: {
      value: function toJSON() {
        return JSON.stringify(map(this.models, function (m) {
          return m.toJS();
        }));
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return BehaveCollection;
})(BehaveEvents);

module.exports = BehaveCollection;