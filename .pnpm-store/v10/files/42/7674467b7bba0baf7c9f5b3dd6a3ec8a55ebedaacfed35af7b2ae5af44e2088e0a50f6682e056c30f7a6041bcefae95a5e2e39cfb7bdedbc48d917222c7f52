"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
var util_1 = require("@antv/util");
/**
 * 简单的模板引擎，使用方式如下（空格自动忽略）：
 * template('hello, {name}', { name: 'AntV' }); // hello, AntV
 * @param string
 * @param options
 */
function template(source, data) {
    if (!data) {
        return source;
    }
    return (0, util_1.reduce)(
    // @ts-ignore
    data, function (r, v, k) { return r.replace(new RegExp("{\\s*".concat(k, "\\s*}"), 'g'), v); }, source);
}
exports.template = template;
//# sourceMappingURL=template.js.map