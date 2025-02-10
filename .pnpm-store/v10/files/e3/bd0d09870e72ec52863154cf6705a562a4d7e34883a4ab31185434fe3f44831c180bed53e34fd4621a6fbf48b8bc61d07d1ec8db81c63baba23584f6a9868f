var LineSymbols = {
    line: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['L', x + r, y],
        ];
    },
    dot: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['L', x + r, y],
        ];
    },
    dash: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['L', x + r, y],
        ];
    },
    smooth: function (x, y, r) {
        return [
            ['M', x - r, y],
            ['A', r / 2, r / 2, 0, 1, 1, x, y],
            ['A', r / 2, r / 2, 0, 1, 0, x + r, y],
        ];
    },
    hv: function (x, y, r) {
        return [
            ['M', x - r - 1, y - 2.5],
            ['L', x, y - 2.5],
            ['L', x, y + 2.5],
            ['L', x + r + 1, y + 2.5],
        ];
    },
    vh: function (x, y, r) {
        return [
            ['M', x - r - 1, y + 2.5],
            ['L', x, y + 2.5],
            ['L', x, y - 2.5],
            ['L', x + r + 1, y - 2.5],
        ];
    },
    hvh: function (x, y, r) {
        return [
            ['M', x - (r + 1), y + 2.5],
            ['L', x - r / 2, y + 2.5],
            ['L', x - r / 2, y - 2.5],
            ['L', x + r / 2, y - 2.5],
            ['L', x + r / 2, y + 2.5],
            ['L', x + r + 1, y + 2.5],
        ];
    },
    vhv: function (x, y) {
        // 宽 13px，高 8px
        return [
            ['M', x - 5, y + 2.5],
            ['L', x - 5, y],
            ['L', x, y],
            ['L', x, y - 3],
            ['L', x, y + 3],
            ['L', x + 6.5, y + 3],
        ];
    },
};
/**
 * Gets line marker
 * @ignore
 * @param markerCfg
 * @param shapeType
 * @returns 返回 Line 的 marker 配置
 */
export function getLineMarker(markerCfg, shapeType) {
    var color = markerCfg.color;
    return {
        symbol: LineSymbols[shapeType],
        style: {
            lineWidth: 2,
            r: 6,
            stroke: color,
        },
    };
}
//# sourceMappingURL=util.js.map