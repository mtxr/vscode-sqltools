"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaults = exports.getDefaults = void 0;
var _unescape = require("./unescape.js");
let defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: '',
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true,
  unescape: _unescape.unescape
};
const setDefaults = function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
exports.setDefaults = setDefaults;
const getDefaults = () => defaultOptions;
exports.getDefaults = getDefaults;