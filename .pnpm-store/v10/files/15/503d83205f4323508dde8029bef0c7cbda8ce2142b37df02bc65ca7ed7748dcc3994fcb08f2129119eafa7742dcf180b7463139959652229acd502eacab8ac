import { __assign } from "tslib";
import { isArray } from '@antv/util';
import { registerShape } from '../base';
import { getStyle } from '../util/get-style';
import { getRectPath } from './util';
import { omit } from '../../../util/helper';
// 根据数据点生成 Line 的两个关键点
function getLinePoints(pointInfo) {
    var x = pointInfo.x, y = pointInfo.y, y0 = pointInfo.y0;
    if (isArray(y)) {
        return y.map(function (yItem, idx) {
            return {
                x: isArray(x) ? x[idx] : x,
                y: yItem,
            };
        });
    }
    // 起始点从 y0 开始
    return [
        { x: x, y: y0 },
        { x: x, y: y },
    ];
}
registerShape('interval', 'line', {
    getPoints: function (shapePoint) {
        return getLinePoints(shapePoint);
    },
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false, 'lineWidth');
        var newStyle = omit(__assign({}, style), ['fill']);
        var path = this.parsePath(getRectPath(cfg.points, false));
        var shape = container.addShape('path', {
            attrs: __assign(__assign({}, newStyle), { path: path }),
            name: 'interval',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                return [
                    ['M', x, y - r],
                    ['L', x, y + r],
                ];
            },
            style: {
                r: 5,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=line.js.map