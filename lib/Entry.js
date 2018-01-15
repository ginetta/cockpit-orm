'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _isEmpty = require('is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _has = function _has(x) {
  return !(0, _isEmpty2.default)(x);
};

var Entry = function () {
  function Entry(_ref) {
    var _this = this;

    var cockpit = _ref.cockpit,
        schema = _ref.schema,
        fields = _ref.fields;

    _classCallCheck(this, Entry);

    this.Map = new Map();
    this.defaultSchema = ['_by', '_created', '_id', '_mby', '_modified', '_order'];

    this.cockpit = cockpit;
    this.fields = fields;
    this.schema = schema;

    if (!this.fields) return console.error('Entry fields cannot be empty');
    if (!this.schema) return console.error('Entry schema cannot be empty');

    [].concat(_toConsumableArray(schema.fields), _toConsumableArray(this.defaultSchema.map(function (name) {
      return { name: name };
    }))).forEach(function (_ref2) {
      var name = _ref2.name;

      _this.Map.set(name, _this.fields[name]);
    });
  }

  _createClass(Entry, [{
    key: 'get',
    value: function get(field, path) {
      if (path) {
        return (0, _lodash2.default)(this.Map.get(field), path);
      }

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
    value: function set(field) {
      return this.Map.set(field);
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      return this.Map.forEach(fn);
    }
  }, {
    key: 'getImageField',
    value: function getImageField(field, options) {
      return this.cockpit.image(this.get(field, 'path'), options);
    }
  }, {
    key: 'save',
    value: function save() {}
  }]);

  return Entry;
}();

exports.default = Entry;
//# sourceMappingURL=Entry.js.map