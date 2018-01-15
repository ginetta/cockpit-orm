'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
  function Collection(_ref) {
    var Entry = _ref.Entry,
        cockpit = _ref.cockpit,
        collectionName = _ref.collectionName,
        options = _objectWithoutProperties(_ref, ['Entry', 'cockpit', 'collectionName']);

    _classCallCheck(this, Collection);

    this.collectionName = '';
    this.cockpit = {};
    this.skip = 0;
    this.total = 0;
    this.lang = '';

    this._getEntries = function (x) {
      return function (_ref2) {
        var entries = _ref2.entries;
        return x(entries);
      };
    };

    this._getData = function (x) {
      return function (_ref3) {
        var data = _ref3.data;
        return x(data);
      };
    };

    this.options = Object.assign({
      limit: this.limit,
      lang: this.lang
    }, options);

    this.collectionName = collectionName;
    this.cockpit = cockpit;
    this.Entry = Entry;

    this.collection = cockpit.collection(this.collectionName, this.options);
  }

  _createClass(Collection, [{
    key: 'getFields',
    value: function getFields() {
      return this.cockpit.collectionSchema(this.collectionName).then(function (_ref4) {
        var fields = _ref4.fields;
        return fields;
      });
    }
  }, {
    key: 'getEntries',
    value: function getEntries(fields, extraOptions) {
      return this.cockpit.collectionGet(this.collectionName, this.getOptions(Object.assign({}, extraOptions, { fields: fields }))).then(function (_ref5) {
        var entries = _ref5.entries;

        console.log('entries: ', entries);
        return entries;
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(fields, extraOptions) {
      return this.cockpit.collection(this.collectionName, this.getOptions(Object.assign({}, extraOptions, { fields: fields })));
    }
  }, {
    key: 'getOneBySlug',
    value: function getOneBySlug(slug, filters) {
      return (0, _utils.entriesHead)(this.cockpit.collection(this.collectionName, Object.assign({}, this.options, {
        filters: Object.assign(_defineProperty({}, this.slugField, slug), filters)
      })));
    }
  }, {
    key: 'getOneByFieldSlug',
    value: function getOneByFieldSlug(field, slug, filters) {
      return (0, _utils.entriesHead)(this.cockpit.collection(this.collectionName, Object.assign({}, this.options, {
        filters: Object.assign(_defineProperty({}, this.slugField, slug), filters)
      })));
    }
  }, {
    key: 'getObject',
    value: function getObject(fields, extraOptions) {
      var _this = this;

      var fetch = this.fetch(fields, extraOptions);

      return {
        get: function get(x) {
          return fetch.get(_this._getEntries(x));
        },
        watch: function watch(x) {
          return fetch.watch(_this._getEntries(x));
        },
        on: function on(event, x) {
          return fetch.on(event, _this._getData(x));
        }
      };
    }
  }, {
    key: 'entities',
    value: function entities(fields, extraOptions) {
      var _this2 = this;

      var fetch = this.fetch(fields, extraOptions);

      return {
        get: function get(x) {
          return fetch.get(_this2.mapEntries(x));
        },
        watch: function watch(x) {
          return fetch.watch(_this2.mapEntries(x));
        },
        on: function on(event, x) {
          return fetch.on(event, _this2._getData(x));
        }
      };
    }
  }, {
    key: 'mapEntries',
    value: function mapEntries(x) {
      var _this3 = this;

      if (!this.Entry) {
        console.error('You must specify a Entry class for this Collection: ' + this.collectionName);
      }

      return function (_ref6) {
        var entries = _ref6.entries;
        return x(entries.map(function (e) {
          return new _this3.Entry(e);
        }));
      };
    }
  }, {
    key: 'getOptions',
    value: function getOptions(extraOptions) {
      return Object.assign({}, this.options, {
        limit: this.limit,
        lang: this.lang
      }, extraOptions);
    }
  }, {
    key: 'setLanguage',
    value: function setLanguage(lang) {
      this.lang = lang;
    }
  }, {
    key: 'getLanguage',
    value: function getLanguage() {
      return this.lang;
    }
  }]);

  return Collection;
}();

Collection.slugField = 'name_slug';
exports.default = Collection;
//# sourceMappingURL=Collection.js.map