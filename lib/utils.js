'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var arrayHead = exports.arrayHead = function arrayHead(arr) {
  return arr.length ? arr[0] : null;
};
var entriesHead = exports.entriesHead = function entriesHead(_ref) {
  var entries = _ref.entries;
  return entries.length ? entries[0] : null;
};
var getField = exports.getField = function getField(field, lang) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return '' + field + (lang ? '_' + lang : '') + suffix;
};

exports.default = {
  getField: getField,
  arrayHead: arrayHead,
  entriesHead: entriesHead
};
//# sourceMappingURL=utils.js.map