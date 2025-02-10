import { isArray } from '@antv/util';
import { registerShape, registerShapeFactory } from '../base';
import { getShapeAttrs } from './util';
var AreaShapeFactory = registerShapeFactory('area', {
    defaultShapeType: 'area',
    getDefaultPoints: function (pointInfo) {
        // area 基本标记的绘制需要获取上下两边的顶点
        var x = pointInfo.x, y0 = pointInfo.y0;
        var y = isArray(pointInfo.y) ? pointInfo.y : [y0, pointInfo.y];
        return y.map(function (yItem) {
            return {
                x: x,
                y: yItem,
            };
        });
    },
});
// Area 几何标记默认的 shape：填充的区域图
registerShape('area', 'area', {
    draw: function (cfg, container) {
        var attrs = getShapeAttrs(cfg, false, false, this);
        var shape = container.addShape({
            type: 'path',
            attrs: attrs,
            name: 'area',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                if (r === void 0) { r = 5.5; }
                return [['M', x - r, y - 4], ['L', x + r, y - 4], ['L', x + r, y + 4], ['L', x - r, y + 4], ['Z']];
            },
            style: {
                r: 5,
                fill: color,
                fillOpacity: 1,
            },
        };
    },
});
export default AreaShapeFactory;
//# sourceMappingURL=index.js.map