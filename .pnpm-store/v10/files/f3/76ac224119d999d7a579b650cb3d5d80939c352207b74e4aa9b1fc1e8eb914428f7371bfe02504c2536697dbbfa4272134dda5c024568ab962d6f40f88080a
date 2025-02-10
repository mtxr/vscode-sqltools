"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useForm;
var React = _interopRequireWildcard(require("react"));
var _rcFieldForm = require("rc-field-form");
var _findDOMNode = require("rc-util/lib/Dom/findDOMNode");
var _scrollIntoViewIfNeeded = _interopRequireDefault(require("scroll-into-view-if-needed"));
var _util = require("../util");
function toNamePathStr(name) {
  const namePath = (0, _util.toArray)(name);
  return namePath.join('_');
}
function getFieldDOMNode(name, wrapForm) {
  const field = wrapForm.getFieldInstance(name);
  const fieldDom = (0, _findDOMNode.getDOM)(field);
  if (fieldDom) {
    return fieldDom;
  }
  const fieldId = (0, _util.getFieldId)((0, _util.toArray)(name), wrapForm.__INTERNAL__.name);
  if (fieldId) {
    return document.getElementById(fieldId);
  }
}
function useForm(form) {
  const [rcForm] = (0, _rcFieldForm.useForm)();
  const itemsRef = React.useRef({});
  const wrapForm = React.useMemo(() => form !== null && form !== void 0 ? form : Object.assign(Object.assign({}, rcForm), {
    __INTERNAL__: {
      itemRef: name => node => {
        const namePathStr = toNamePathStr(name);
        if (node) {
          itemsRef.current[namePathStr] = node;
        } else {
          delete itemsRef.current[namePathStr];
        }
      }
    },
    scrollToField: function (name) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const node = getFieldDOMNode(name, wrapForm);
      if (node) {
        (0, _scrollIntoViewIfNeeded.default)(node, Object.assign({
          scrollMode: 'if-needed',
          block: 'nearest'
        }, options));
      }
    },
    focusField: name => {
      var _a;
      const node = getFieldDOMNode(name, wrapForm);
      if (node) {
        (_a = node.focus) === null || _a === void 0 ? void 0 : _a.call(node);
      }
    },
    getFieldInstance: name => {
      const namePathStr = toNamePathStr(name);
      return itemsRef.current[namePathStr];
    }
  }), [form, rcForm]);
  return [wrapForm];
}