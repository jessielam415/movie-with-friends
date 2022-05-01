// This code is copied from the react-select-search library https://github.com/tbleckert/react-select-search/,
// the only change is to the threshold to improve the accuracy of searches.

"use strict";

exports.__esModule = true;
exports["default"] = fuzzySearch;

var _fuse = _interopRequireDefault(require("fuse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line import/no-extraneous-dependencies
function fuzzySearch(options) {
  var fuse = new _fuse["default"](options, {
    keys: ['name', 'groupName'],
    threshold: 0.1
  });
  return function (value) {
    if (!value.length) {
      return options;
    }

    return fuse.search(value);
  };
}