import { __assign } from "tslib";
import { registerShape, registerShapeFactory } from '../base';
import { getStyle } from '../util/get-style';
import { getLinePath } from '../util/path';
import { splitPoints } from '../util/split-points';
var EdgeShapeFactory = registerShapeFactory('edge', {
    defaultShapeType: 'line',
    getDefaultPoints: function (pointInfo) {
        return splitPoints(pointInfo);
    },
});
registerShape('edge', 'line', {
    draw: function (cfg, container) {
        var style = getStyle(cfg, true, false, 'lineWidth');
        var path = getLinePath(this.parsePoints(cfg.points), this.coordinate.isPolar);
        return container.addShape('path', {
            attrs: __assign(__assign({}, style), { path: path }),
        });
    },
    getMarker: function (markerCfg) {
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: markerCfg.color,
            },
        };
    },
});
export default EdgeShapeFactory;
//# sourceMappingURL=index.js.map