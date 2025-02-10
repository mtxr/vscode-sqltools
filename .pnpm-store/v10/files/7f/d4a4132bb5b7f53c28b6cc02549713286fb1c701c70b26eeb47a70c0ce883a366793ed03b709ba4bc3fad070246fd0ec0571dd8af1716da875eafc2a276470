"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.DEFAULT_TOOLTIP_OPTIONS = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
exports.DEFAULT_TOOLTIP_OPTIONS = {
    showTitle: false,
    shared: true,
    showMarkers: false,
    customContent: function (x, data) { return "".concat((0, util_1.get)(data, [0, 'data', 'y'], 0)); },
    containerTpl: '<div class="g2-tooltip"><div class="g2-tooltip-list"></div></div>',
    itemTpl: '<span>{value}</span>',
    domStyles: {
        'g2-tooltip': {
            padding: '2px 4px',
            fontSize: '10px',
        },
    },
};
/**
 * 默认配置项
 */
exports.DEFAULT_OPTIONS = {
    appendPadding: 2,
    tooltip: tslib_1.__assign({}, exports.DEFAULT_TOOLTIP_OPTIONS),
    animation: {},
};
//# sourceMappingURL=constants.js.map