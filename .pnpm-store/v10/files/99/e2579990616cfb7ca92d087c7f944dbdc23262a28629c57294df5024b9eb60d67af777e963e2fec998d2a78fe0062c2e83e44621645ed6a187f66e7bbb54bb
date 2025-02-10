"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbols = {
    // 圆
    circle: function (x, y, r) {
        return [
            ['M', x, y],
            ['m', -r, 0],
            ['a', r, r, 0, 1, 0, r * 2, 0],
            ['a', r, r, 0, 1, 0, -r * 2, 0],
        ];
    },
    // 正方形
    square: function (x, y, r) {
        return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
    },
    // 菱形
    diamond: function (x, y, r) {
        return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
    },
    // 三角形
    triangle: function (x, y, r) {
        var diffY = r * Math.sin((1 / 3) * Math.PI);
        return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['z']];
    },
    // 倒三角形
    triangleDown: function (x, y, r) {
        var diffY = r * Math.sin((1 / 3) * Math.PI);
        return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
    },
};
exports.default = {
    get: function (type) {
        return Symbols[type];
    },
    register: function (type, func) {
        Symbols[type] = func;
    },
    remove: function (type) {
        delete Symbols[type];
    },
    getAll: function () {
        return Symbols;
    },
};
//# sourceMappingURL=symbols.js.map