"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerSymbols = void 0;
/** @ignore */
exports.MarkerSymbols = {
    hexagon: function (x, y, r) {
        var diffX = (r / 2) * Math.sqrt(3);
        return [
            ['M', x, y - r],
            ['L', x + diffX, y - r / 2],
            ['L', x + diffX, y + r / 2],
            ['L', x, y + r],
            ['L', x - diffX, y + r / 2],
            ['L', x - diffX, y - r / 2],
            ['Z'],
        ];
    },
    bowtie: function (x, y, r) {
        var diffY = r - 1.5;
        return [['M', x - r, y - diffY], ['L', x + r, y + diffY], ['L', x + r, y - diffY], ['L', x - r, y + diffY], ['Z']];
    },
    cross: function (x, y, r) {
        return [
            ['M', x - r, y - r],
            ['L', x + r, y + r],
            ['M', x + r, y - r],
            ['L', x - r, y + r],
        ];
    },
    tick: function (x, y, r) {
        return [
            ['M', x - r / 2, y - r],
            ['L', x + r / 2, y - r],
            ['M', x, y - r],
            ['L', x, y + r],
            ['M', x - r / 2, y + r],
            ['L', x + r / 2, y + r],
        ];
    },
    plus: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['L', x + r, y],
            ['M', x, y - r],
            ['L', x, y + r],
        ];
    },
    hyphen: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['L', x + r, y],
        ];
    },
    line: function (x, y, r) {
        return [
            ['M', x, y - r],
            ['L', x, y + r],
        ];
    },
};
//# sourceMappingURL=marker.js.map