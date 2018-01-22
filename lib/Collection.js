'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
  function Collection(options) {
    _classCallCheck(this, Collection);

    this.cockpit = {};
    this.skip = 0;
    this.total = 0;
    this.lang = '';

    this._getEntries = function (x) {
      return function (_ref) {
        var entries = _ref.entries;
        return x(entries);
      };
    };

    this._getData = function (x) {
      return function (_ref2) {
        var data = _ref2.data;
        return x(data);
      };
    };

    this.options = Object.assign({
      limit: this.limit,
      lang: this.lang
    }, options);

    var collectionName = this.constructor.collectionName;


    if (!collectionName) return console.error('You must specify a static collectionName property on %s class', this.constructor.name);

    this.collection = this.constructor.cockpit.collection(collectionName, this.options);
  }

  _createClass(Collection, [{
    key: 'getFields',
    value: function getFields() {
      return this.constructor.cockpit.collectionSchema(this.constructor.collectionName).then(function (_ref3) {
        var fields = _ref3.fields;
        return fields;
      });
    }
  }, {
    key: 'getEntries',
    value: function getEntries(fields, extraOptions) {
      return this.constructor.cockpit.collectionGet(this.constructor.collectionName, this.getOptions(Object.assign({}, extraOptions, { fields: fields }))).then(function (_ref4) {
        var entries = _ref4.entries;
        return entries;
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(fields, extraOptions) {
      return this.constructor.cockpit.collection(this.constructor.collectionName,
      // TODO check fields vs filter.
      this.getOptions(Object.assign({}, extraOptions, { fields: fields })));
    }
  }, {
    key: 'getOneBySlug',
    value: function getOneBySlug(slug, fields, extraOptions) {
      var _this = this;

      var fetch = this.fetch(fields, extraOptions);

      return {
        promise: this.fetch(fields, Object.assign({
          filter: _defineProperty({}, this.constructor.slugField, slug)
        }, extraOptions)).promise.then(_utils.entriesHead),
        get: function get(x) {
          return fetch.get((0, _utils.arrayHead)(_this._getEntries(x)));
        },
        watch: function watch(x) {
          return fetch.watch((0, _utils.arrayHead)(_this._getEntries(x)));
        },
        on: function on(event, x) {
          return fetch.on(event, (0, _utils.arrayHead)(_this._getData(x)));
        }
      };
    }
  }, {
    key: 'getObject',
    value: function getObject(fields, extraOptions) {
      var _this2 = this;

      var fetch = this.fetch(fields, extraOptions);

      return {
        promise: fetch.promise.then(this._getEntries(function (x) {
          return x;
        })),
        get: function get(x) {
          return fetch.get(_this2._getEntries(x));
        },
        watch: function watch(x) {
          return fetch.watch(_this2._getEntries(x));
        },
        on: function on(event, x) {
          return fetch.on(event, _this2._getData(x));
        }
      };
    }
  }, {
    key: 'entities',
    value: function entities(fields, extraOptions) {
      var _this3 = this;

      var fetch = this.fetch(fields, extraOptions);

      return {
        promise: fetch.get(this.mapEntries(function (x) {
          return x;
        })),
        get: function get(x) {
          return fetch.get(_this3.mapEntries(x));
        },
        watch: function watch(x) {
          return fetch.watch(_this3.mapEntries(x));
        },
        on: function on(event, x) {
          return fetch.on(event, _this3._getData(x));
        }
      };
    }
  }, {
    key: 'mapEntries',
    value: function mapEntries(x) {
      var _this4 = this;

      if (!this.constructor.Entry) {
        console.error('You must specify a Entry class for this Collection: ' + this.constructor.collectionName);
      }

      return function (_ref5) {
        var entries = _ref5.entries;
        return x(entries.map(function (e) {
          return new _this4.constructor.Entry(e);
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

Collection.collectionName = '';
Collection.slugField = 'name_slug';
Collection.cockpit = null;
Collection.Entry = null;
exports.default = Collection;