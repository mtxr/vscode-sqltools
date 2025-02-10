"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translation = void 0;
var _useTranslation = require("./useTranslation.js");
const Translation = _ref => {
  let {
    ns,
    children,
    ...options
  } = _ref;
  const [t, i18n, ready] = (0, _useTranslation.useTranslation)(ns, options);
  return children(t, {
    i18n,
    lng: i18n.language
  }, ready);
};
exports.Translation = Translation;