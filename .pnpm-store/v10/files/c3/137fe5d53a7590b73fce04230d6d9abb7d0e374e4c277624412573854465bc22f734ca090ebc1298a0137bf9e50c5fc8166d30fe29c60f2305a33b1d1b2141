"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatesStyle = void 0;
var util_1 = require("@antv/util");
// 获取多个状态量的合并值
function getStatesStyle(item, elementName, stateStyles) {
    var styleName = elementName + "Style"; // activeStyle
    var styles = null;
    util_1.each(stateStyles, function (v, state) {
        if (item[state] && v[styleName]) {
            if (!styles) {
                styles = {};
            }
            util_1.mix(styles, v[styleName]); // 合并样式
        }
    });
    return styles;
}
exports.getStatesStyle = getStatesStyle;
//# sourceMappingURL=state.js.map