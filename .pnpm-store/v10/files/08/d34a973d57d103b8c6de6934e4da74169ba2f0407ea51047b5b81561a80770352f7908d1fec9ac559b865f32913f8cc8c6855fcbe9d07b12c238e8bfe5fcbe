"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapNum = exports.formatNum = exports.trunc = void 0;
var trunc = function (v) {
    return v > 0 ? Math.floor(v) : Math.ceil(v);
};
exports.trunc = trunc;
function formatNum(num, digits) {
    var pow = Math.pow(10, digits === undefined ? 6 : digits);
    return Math.round(num * pow) / pow;
}
exports.formatNum = formatNum;
function wrapNum(x, range, includeMax) {
    var max = range[1];
    var min = range[0];
    var d = max - min;
    return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}
exports.wrapNum = wrapNum;
//# sourceMappingURL=index.js.map