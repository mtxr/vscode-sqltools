import { __assign } from "tslib";
import { registerShape, Util } from '@antv/g2';
import { parsePathString } from '@antv/path-util';
import { deepAssign } from '../../utils';
import { PATH_FIELD } from './constant';
/**
 * 获取填充属性
 * @param cfg 图形绘制数据
 */
function getFillAttrs(cfg) {
    // style.fill 优先级更高
    return deepAssign({}, cfg.defaultStyle, { fill: cfg.color }, cfg.style);
}
registerShape('schema', 'venn', {
    draw: function (cfg, container) {
        var data = cfg.data;
        var segments = parsePathString(data[PATH_FIELD]);
        var fillAttrs = getFillAttrs(cfg);
        var group = container.addGroup({ name: 'venn-shape' });
        group.addShape('path', {
            attrs: __assign(__assign({}, fillAttrs), { path: segments }),
            name: 'venn-path',
        });
        var _a = cfg.customInfo, offsetX = _a.offsetX, offsetY = _a.offsetY;
        var matrix = Util.transform(null, [['t', offsetX, offsetY]]);
        group.setMatrix(matrix);
        return group;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                lineWidth: 0,
                stroke: color,
                fill: color,
                r: 4,
            },
        };
    },
});
//# sourceMappingURL=shape.js.map