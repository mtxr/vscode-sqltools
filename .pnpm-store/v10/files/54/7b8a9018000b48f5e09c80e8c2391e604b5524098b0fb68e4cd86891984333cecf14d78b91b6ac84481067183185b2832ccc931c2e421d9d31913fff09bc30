import { each } from '@antv/util';
import { MarkerSymbols } from '../../../util/marker';
import { registerShape } from '../base';
import { drawPoints, SHAPES } from './util';
// 所有的 SHAPES 都注册一下
each(SHAPES, function (shapeName) {
    registerShape('point', shapeName, {
        draw: function (cfg, container) {
            return drawPoints(this, cfg, container, shapeName, false);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: MarkerSymbols[shapeName] || shapeName,
                style: {
                    r: 4.5,
                    fill: color,
                },
            };
        },
    });
});
//# sourceMappingURL=solid.js.map