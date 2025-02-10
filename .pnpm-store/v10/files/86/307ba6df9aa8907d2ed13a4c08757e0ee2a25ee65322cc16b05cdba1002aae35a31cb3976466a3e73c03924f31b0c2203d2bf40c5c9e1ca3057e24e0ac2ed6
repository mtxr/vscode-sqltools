export var trunc = function (v) {
    return v > 0 ? Math.floor(v) : Math.ceil(v);
};
export function formatNum(num, digits) {
    var pow = Math.pow(10, digits === undefined ? 6 : digits);
    return Math.round(num * pow) / pow;
}
export function wrapNum(x, range, includeMax) {
    var max = range[1];
    var min = range[0];
    var d = max - min;
    return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}
//# sourceMappingURL=index.js.map