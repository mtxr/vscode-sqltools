import { each } from '@antv/util';
import { MarkerSymbols } from '../../../util/marker';
import { registerShape, registerShapeFactory } from '../base';
import { splitPoints } from '../util/split-points';
import { drawPoints, SHAPES } from './util';
var PointShapeFactory = registerShapeFactory('point', {
    defaultShapeType: 'hollow-circle',
    getDefaultPoints: function (pointInfo) {
        return splitPoints(pointInfo);
    },
});
each(SHAPES, function (shapeName) {
    // 添加该 shape 对应的 hollow-shape
    registerShape('point', "hollow-".concat(shapeName), {
        draw: function (cfg, container) {
            return drawPoints(this, cfg, container, shapeName, true);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: MarkerSymbols[shapeName] || shapeName,
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        },
    });
});
export default PointShapeFactory;
//# sourceMappingURL=index.js.map