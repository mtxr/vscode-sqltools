"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execViewAdaptor = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../../adaptor/geometries/base");
var constant_1 = require("../../constant");
var utils_1 = require("../../utils");
/**
 *
 * @param params 分面图 参数
 * @returns facet eachView 的回调设置每个 view 的展示
 */
function execViewAdaptor(viewOfG2, options) {
    var data = options.data, coordinate = options.coordinate, interactions = options.interactions, annotations = options.annotations, animation = options.animation, tooltip = options.tooltip, axes = options.axes, meta = options.meta, geometries = options.geometries;
    // 1. data, optional
    if (data) {
        viewOfG2.data(data);
    }
    // 2. meta 配置
    var scales = {};
    if (axes) {
        (0, util_1.each)(axes, function (axis, field) {
            scales[field] = (0, utils_1.pick)(axis, constant_1.AXIS_META_CONFIG_KEYS);
        });
    }
    scales = (0, utils_1.deepAssign)({}, meta, scales);
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
        (0, util_1.each)(axes, function (axis, field) {
            viewOfG2.axis(field, axis);
        });
    }
    (0, util_1.each)(geometries, function (geometry) {
        // Geometry
        var ext = (0, base_1.geometry)({
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
    (0, util_1.each)(interactions, function (interaction) {
        if (interaction.enable === false) {
            viewOfG2.removeInteraction(interaction.type);
        }
        else {
            viewOfG2.interaction(interaction.type, interaction.cfg);
        }
    });
    // 6. annotations
    (0, util_1.each)(annotations, function (annotation) {
        viewOfG2.annotation()[annotation.type](tslib_1.__assign({}, annotation));
    });
    // 7. animation (先做动画)
    (0, utils_1.addViewAnimation)(viewOfG2, animation);
    if (tooltip) {
        // 8. tooltip
        viewOfG2.interaction('tooltip');
        viewOfG2.tooltip(tooltip);
    }
    else if (tooltip === false) {
        viewOfG2.removeInteraction('tooltip');
    }
}
exports.execViewAdaptor = execViewAdaptor;
//# sourceMappingURL=utils.js.map