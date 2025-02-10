"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.EDGE_COLOR_FIELD = exports.NODE_COLOR_FIELD = exports.Y_FIELD = exports.X_FIELD = void 0;
var util_1 = require("@antv/util");
exports.X_FIELD = 'x';
exports.Y_FIELD = 'y';
exports.NODE_COLOR_FIELD = 'name';
exports.EDGE_COLOR_FIELD = 'source';
exports.DEFAULT_OPTIONS = {
    nodeStyle: {
        opacity: 1,
        fillOpacity: 1,
        lineWidth: 1,
    },
    edgeStyle: {
        opacity: 0.5,
        lineWidth: 2,
    },
    label: {
        fields: ['x', 'name'],
        callback: function (x, name) {
            var centerX = (x[0] + x[1]) / 2;
            var offsetX = centerX > 0.5 ? -4 : 4;
            return {
                offsetX: offsetX,
                content: name,
            };
        },
        labelEmit: true,
        style: {
            fill: '#8c8c8c',
        },
    },
    tooltip: {
        showTitle: false,
        showMarkers: false,
        fields: ['source', 'target', 'value', 'isNode'],
        // 内置：node 不显示 tooltip (业务层自行处理)，edge 显示 tooltip
        showContent: function (items) {
            return !(0, util_1.get)(items, [0, 'data', 'isNode']);
        },
        formatter: function (datum) {
            var source = datum.source, target = datum.target, value = datum.value;
            return {
                name: "".concat(source, " -> ").concat(target),
                value: value,
            };
        },
    },
    interactions: [
        {
            type: 'element-active',
        },
    ],
    weight: true,
    nodePaddingRatio: 0.1,
    nodeWidthRatio: 0.05,
};
//# sourceMappingURL=constant.js.map