"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_style_1 = require("./get-style");
var get_width_1 = require("./get-width");
function getOuterWidth(el, defaultValue) {
    var width = (0, get_width_1.default)(el, defaultValue);
    var bLeft = parseFloat((0, get_style_1.default)(el, 'borderLeftWidth')) || 0;
    var pLeft = parseFloat((0, get_style_1.default)(el, 'paddingLeft')) || 0;
    var pRight = parseFloat((0, get_style_1.default)(el, 'paddingRight')) || 0;
    var bRight = parseFloat((0, get_style_1.default)(el, 'borderRightWidth')) || 0;
    var mRight = parseFloat((0, get_style_1.default)(el, 'marginRight')) || 0;
    var mLeft = parseFloat((0, get_style_1.default)(el, 'marginLeft')) || 0;
    return width + bLeft + bRight + pLeft + pRight + mLeft + mRight;
}
exports.default = getOuterWidth;
//# sourceMappingURL=get-outer-width.js.map