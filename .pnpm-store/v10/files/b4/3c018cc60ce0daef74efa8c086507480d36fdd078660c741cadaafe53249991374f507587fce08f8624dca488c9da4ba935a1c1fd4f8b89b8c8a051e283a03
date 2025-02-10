import { __assign } from "tslib";
import { get } from '@antv/util';
export var X_FIELD = 'x';
export var Y_FIELD = 'y';
export var DEFAULT_TOOLTIP_OPTIONS = {
    showTitle: false,
    shared: true,
    showMarkers: false,
    customContent: function (x, data) { return "".concat(get(data, [0, 'data', 'y'], 0)); },
    containerTpl: '<div class="g2-tooltip"><div class="g2-tooltip-list"></div></div>',
    itemTpl: '<span>{value}</span>',
    domStyles: {
        'g2-tooltip': {
            padding: '2px 4px',
            fontSize: '10px',
        },
    },
    showCrosshairs: true,
    crosshairs: {
        type: 'x',
    },
};
/**
 * 默认配置项
 */
export var DEFAULT_OPTIONS = {
    appendPadding: 2,
    tooltip: __assign({}, DEFAULT_TOOLTIP_OPTIONS),
    animation: {},
};
//# sourceMappingURL=constants.js.map