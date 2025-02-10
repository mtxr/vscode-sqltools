var _a;
import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
export var BOX_RANGE = '$$range$$';
export var BOX_RANGE_ALIAS = 'low-q1-median-q3-high';
export var BOX_SYNC_NAME = '$$y_outliers$$';
export var OUTLIERS_VIEW_ID = 'outliers_view';
/**
 * 面积图默认配置项
 */
export var DEFAULT_OPTIONS = deepAssign({}, Plot.getDefaultOptions(), {
    meta: (_a = {},
        _a[BOX_RANGE] = { min: 0, alias: BOX_RANGE_ALIAS },
        _a),
    // 默认区域交互
    interactions: [{ type: 'active-region' }],
    // 默认 tooltips 共享，不显示 markers
    tooltip: {
        showMarkers: false,
        shared: true,
    },
    boxStyle: {
        lineWidth: 1,
    },
});
//# sourceMappingURL=constant.js.map