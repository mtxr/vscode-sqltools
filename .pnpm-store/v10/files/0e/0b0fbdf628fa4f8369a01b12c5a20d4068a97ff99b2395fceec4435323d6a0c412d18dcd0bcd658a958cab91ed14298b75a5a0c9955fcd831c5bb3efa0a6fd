import * as React from 'react';
import { useForm as useRcForm } from 'rc-field-form';
import { getDOM } from "rc-util/es/Dom/findDOMNode";
import scrollIntoView from 'scroll-into-view-if-needed';
import { getFieldId, toArray } from '../util';
function toNamePathStr(name) {
  const namePath = toArray(name);
  return namePath.join('_');
}
function getFieldDOMNode(name, wrapForm) {
  const field = wrapForm.getFieldInstance(name);
  const fieldDom = getDOM(field);
  if (fieldDom) {
    return fieldDom;
  }
  const fieldId = getFieldId(toArray(name), wrapForm.__INTERNAL__.name);
  if (fieldId) {
    return document.getElementById(fieldId);
  }
}
export default function useForm(form) {
  const [rcForm] = useRcForm();
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
        scrollIntoView(node, Object.assign({
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