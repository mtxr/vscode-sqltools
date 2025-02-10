import { each } from '@antv/util';
import { MarkerSymbols } from '../../../util/marker';
import { registerShape } from '../base';
import { drawPoints, HOLLOW_SHAPES } from './util';
// 添加 hollowShape
each(HOLLOW_SHAPES, function (shapeName) {
    registerShape('point', shapeName, {
        draw: function (cfg, container) {
            return drawPoints(this, cfg, container, shapeName, true);
        },
        getMarker: function (markerCfg) {
            var color = markerCfg.color;
            return {
                symbol: MarkerSymbols[shapeName],
                style: {
                    r: 4.5,
                    stroke: color,
                    fill: null,
                },
            };
        },
    });
});
//# sourceMappingURL=hollow.js.map