import { __assign } from "tslib";
import { each } from '@antv/util';
import { geometry as geometryAdaptor } from '../../adaptor/geometries/base';
import { AXIS_META_CONFIG_KEYS } from '../../constant';
import { addViewAnimation, deepAssign, pick } from '../../utils';
/**
 *
 * @param params 分面图 参数
 * @returns facet eachView 的回调设置每个 view 的展示
 */
export function execViewAdaptor(viewOfG2, options) {
    var data = options.data, coordinate = options.coordinate, interactions = options.interactions, annotations = options.annotations, animation = options.animation, tooltip = options.tooltip, axes = options.axes, meta = options.meta, geometries = options.geometries;
    // 1. data, optional
    if (data) {
        viewOfG2.data(data);
    }
    // 2. meta 配置
    var scales = {};
    if (axes) {
        each(axes, function (axis, field) {
            scales[field] = pick(axis, AXIS_META_CONFIG_KEYS);
        });
    }
    scales = deepAssign({}, meta, scales);
    viewOfG2.scale(scales);
    // 3. coordinate 配置 (默认由顶层决定)
    if (coordinate) {
        viewOfG2.coordinate(coordinate);
    }
    // 4. axis 轴配置 (默认由顶层决定，但可以通过 false 强制关闭)
    if (axes === false) {
        viewOfG2.axis(false);
    }
    else {
        each(axes, function (axis, field) {
            viewOfG2.axis(field, axis);
        });
    }
    each(geometries, function (geometry) {
        // Geometry
        var ext = geometryAdaptor({
            chart: viewOfG2,
            options: geometry,
        }).ext;
        // Geometry adjust
        var adjust = geometry.adjust;
        if (adjust) {
            ext.geometry.adjust(adjust);
        }
    });
    // 5. interactions
    each(interactions, function (interaction) {
        if (interaction.enable === false) {
            viewOfG2.removeInteraction(interaction.type);
        }
        else {
            viewOfG2.interaction(interaction.type, interaction.cfg);
        }
    });
    // 6. annotations
    each(annotations, function (annotation) {
        viewOfG2.annotation()[annotation.type](__assign({}, annotation));
    });
    // 7. animation (先做动画)
    addViewAnimation(viewOfG2, animation);
    if (tooltip) {
        // 8. tooltip
        viewOfG2.interaction('tooltip');
        viewOfG2.tooltip(tooltip);
    }
    else if (tooltip === false) {
        viewOfG2.removeInteraction('tooltip');
    }
}
//# sourceMappingURL=utils.js.map