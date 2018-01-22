'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _isEmpty = require('is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _has = function _has(x) {
  return !(0, _isEmpty2.default)(x);
};

var Entry = function () {
  function Entry(fields) {
    var _this = this;

    _classCallCheck(this, Entry);

    this.Map = new Map();
    this.defaultSchema = ['_by', '_created', '_id', '_mby', '_modified', '_order'];

    this.fields = fields;

    var schema = this.constructor.schema;


    if (!this.fields) return;
    if (!schema && schema.fields) return;

    var slugFields = schema.fields.filter(function (_ref) {
      var options = _ref.options;
      return options && options.slug;
    }).map(function (_ref2) {
      var name = _ref2.name;
      return { name: name + '_slug' };
    });

    var possibleFields = [].concat(_toConsumableArray(schema.fields), _toConsumableArray(slugFields), _toConsumableArray(this.defaultSchema.map(function (name) {
      return { name: name };
    })));

    possibleFields.forEach(function (_ref3) {
      var name = _ref3.name;
      return _this.Map.set(name, _this.fields[name]);
    });
  }

  _createClass(Entry, [{
    key: 'get',
    value: function get(field, path) {
      if (path) return (0, _lodash2.default)(this.Map.get(field), path);

      return this.Map.get(field);
    }
  }, {
    key: 'has',
    value: function has(field, path) {
      if (path) {
        return _has(this.Map.get(field), path);
      }

      return _has(this.Map.get(field));
    }
  }, {
    key: 'set',
    value: function set(field, value, path) {
      if (path) {
        var sett = (0, _lodash4.default)(this.get(field), path, value);

        return this.Map.set(sett);
      }

      this.Map.set(field, value);

      return this;
    }
  }, {
    key: 'setSlug',
    value: function setSlug(slug) {
      var slugField = this.constructor.slugField;


      this.set(slugField, slug);

      return this;
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      return this.Map.forEach(fn);
    }
  }, {
    key: 'getImageField',
    value: function getImageField(field, options) {
      return this.constructor.cockpit.image(this.get(field, 'path'), options);
    }
  }, {
    key: 'sync',
    value: function sync() {
      var _this2 = this;

      var slugField = this.constructor.slugField;

      var filter = _defineProperty({}, slugField, this.get(slugField));

      var collection = this.constructor.cockpit.collection(this.constructor.schema.name, { filter: filter });

      return collection.promise.then(_utils.entriesHead).then(function (entry) {
        if (!entry) {
          console.warn('No content found for the following query:', _this2.constructor.schema.name, filter);
          return null;
        }

        _this2.Map = new _this2.constructor(entry).Map;

        return _this2;
      });
    }
  }, {
    key: 'getCollection',
    value: function getCollection() {
      var filter = {};
      var slugField = this.constructor.slugField;


      if (slugField) filter[slugField] = this.get(slugField);
      if (this.has('_id')) filter._id = this.get('_id');

      return this.constructor.cockpit.collection(this.constructor.schema.name, {
        filter: filter
      });
    }
  }, {
    key: 'watch',
    value: function watch(callback) {
      var _this3 = this;

      var collection = this.getCollection();

      collection.watch(function (entries) {
        _this3.Map = new _this3.constructor((0, _utils.entriesHead)(entries)).Map;

        callback(_this3);
      });

      return this;
    }
  }, {
    key: 'preview',
    value: function preview(callback) {
      var _this4 = this;

      var collection = this.getCollection();

      collection.on('preview', function (_ref4) {
        var data = _ref4.data;

        _this4.Map = new _this4.constructor(data).Map;

        callback(_this4);
      });
    }
  }, {
    key: 'save',
    value: function save() {
      var _this5 = this;

      return this.constructor.cockpit.collectionSave(this.constructor.schema.name, this.toObject()).then(function (entry) {
        if (!entry) {
          console.warn('No content found for the following query:', _this5.constructor.schema.name, _this5.Map);
          return null;
        }

        _this5.Map = new _this5.constructor(entry).Map;

        return _this5;
      });
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return [].concat(_toConsumableArray(this.Map)).reduce(function (prev, curr) {
        return Object.assign({}, prev, _defineProperty({}, curr[0], curr[1]));
      }, {});
    }
  }]);

  return Entry;
}();

Entry.slugField = 'name_slug';
Entry.cockpit = null;
Entry.schema = {};
exports.default = Entry;