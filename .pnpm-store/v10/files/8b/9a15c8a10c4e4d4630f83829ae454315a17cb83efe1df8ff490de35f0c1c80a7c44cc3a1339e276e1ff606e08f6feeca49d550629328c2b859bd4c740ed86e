"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.statistic = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var utils_1 = require("../../utils");
var adaptor_1 = require("../progress/adaptor");
/**
 * coordinate 配置
 * @param params
 */
function coordinate(params) {
    var chart = params.chart, options = params.options;
    var innerRadius = options.innerRadius, radius = options.radius;
    // coordinate
    chart.coordinate('theta', {
        innerRadius: innerRadius,
        radius: radius,
    });
    return params;
}
/**
 * statistic 配置
 * @param params
 */
function statistic(params, updated) {
    var chart = params.chart, options = params.options;
    var innerRadius = options.innerRadius, statistic = options.statistic, percent = options.percent, meta = options.meta;
    // 先清空标注，再重新渲染
    chart.getController('annotation').clear(true);
    /** 中心文本 指标卡 */
    if (innerRadius && statistic) {
        var metaFormatter = (0, util_1.get)(meta, ['percent', 'formatter']) || (function (v) { return "".concat((v * 100).toFixed(2), "%"); });
        var contentOpt = statistic.content;
        if (contentOpt) {
            contentOpt = (0, utils_1.deepAssign)({}, contentOpt, {
                content: !(0, util_1.isNil)(contentOpt.content) ? contentOpt.content : metaFormatter(percent),
            });
        }
        (0, utils_1.renderStatistic)(chart, { statistic: tslib_1.__assign(tslib_1.__assign({}, statistic), { content: contentOpt }), plotType: 'ring-progress' }, { percent: percent });
    }
    if (updated) {
        chart.render(true);
    }
    return params;
}
exports.statistic = statistic;
/**
 * 环形进度图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(adaptor_1.geometry, (0, common_1.scale)({}), coordinate, statistic, common_1.animation, common_1.theme, (0, common_1.annotation)())(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map