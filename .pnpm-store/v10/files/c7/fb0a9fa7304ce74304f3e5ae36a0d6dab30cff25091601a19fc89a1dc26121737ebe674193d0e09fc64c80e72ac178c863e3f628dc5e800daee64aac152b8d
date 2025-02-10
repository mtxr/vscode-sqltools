"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyCSS = exports.createDom = exports.removeDom = exports.getChartSize = void 0;
var constant_1 = require("../constant");
/**
 * get the element's bounding size
 * @param ele dom element
 * @returns the element width and height
 */
function getElementSize(ele) {
    var style = getComputedStyle(ele);
    return {
        width: (ele.clientWidth || parseInt(style.width, 10)) -
            parseInt(style.paddingLeft, 10) -
            parseInt(style.paddingRight, 10),
        height: (ele.clientHeight || parseInt(style.height, 10)) -
            parseInt(style.paddingTop, 10) -
            parseInt(style.paddingBottom, 10),
    };
}
/**
 * is value a valid number
 * @param v the input value
 * @returns whether it is a number
 */
function isNumber(v) {
    return typeof v === 'number' && !isNaN(v);
}
/**
 * @ignore
 * calculate the chart size
 * @param ele DOM element
 * @param autoFit should auto fit
 * @param width chart width which is set by user
 * @param height chart height which is set by user
 * @returns the chart width and height
 */
function getChartSize(ele, autoFit, width, height) {
    var w = width;
    var h = height;
    if (autoFit) {
        var size = getElementSize(ele);
        w = size.width ? size.width : w;
        h = size.height ? size.height : h;
    }
    return {
        width: Math.max(isNumber(w) ? w : constant_1.MIN_CHART_WIDTH, constant_1.MIN_CHART_WIDTH),
        height: Math.max(isNumber(h) ? h : constant_1.MIN_CHART_HEIGHT, constant_1.MIN_CHART_HEIGHT),
    };
}
exports.getChartSize = getChartSize;
/**
 * @ignore
 * remove html element from its parent
 * @param dom
 */
function removeDom(dom) {
    var parent = dom.parentNode;
    if (parent) {
        parent.removeChild(dom);
    }
}
exports.removeDom = removeDom;
/** @ignore */
var dom_util_1 = require("@antv/dom-util");
Object.defineProperty(exports, "createDom", { enumerable: true, get: function () { return dom_util_1.createDom; } });
Object.defineProperty(exports, "modifyCSS", { enumerable: true, get: function () { return dom_util_1.modifyCSS; } });
//# sourceMappingURL=dom.js.map