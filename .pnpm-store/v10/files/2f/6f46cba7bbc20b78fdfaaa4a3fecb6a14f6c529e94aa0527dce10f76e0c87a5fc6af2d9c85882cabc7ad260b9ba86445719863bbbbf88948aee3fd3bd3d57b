"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversionTagAction = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var basic_1 = require("../geometries/basic");
var common_1 = require("../geometries/common");
var compare_1 = require("../geometries/compare");
/**
 * Funnel 转化率跟随 legend 变化事件
 */
var ConversionTagAction = /** @class */ (function (_super) {
    tslib_1.__extends(ConversionTagAction, _super);
    function ConversionTagAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rendering = false;
        return _this;
    }
    ConversionTagAction.prototype.change = function (options) {
        var _this = this;
        // 防止多次重复渲染
        if (!this.rendering) {
            var seriesField = options.seriesField, compareField = options.compareField;
            var conversionTag_1 = compareField ? compare_1.compareConversionTag : basic_1.conversionTag;
            var view = this.context.view;
            // 兼容分面漏斗图
            var views = seriesField || compareField ? view.views : [view];
            (0, util_1.map)(views, function (v, index) {
                // 防止影响其他 annotations 被去除
                var annotationController = v.getController('annotation');
                var annotations = (0, util_1.filter)((0, util_1.get)(annotationController, ['option'], []), function (_a) {
                    var name = _a.name;
                    return name !== common_1.CONVERSION_TAG_NAME;
                });
                annotationController.clear(true);
                (0, util_1.each)(annotations, function (annotation) {
                    if (typeof annotation === 'object') {
                        v.annotation()[annotation.type](annotation);
                    }
                });
                var data = (0, util_1.get)(v, ['filteredData'], v.getOptions().data);
                conversionTag_1({
                    chart: v,
                    index: index,
                    options: tslib_1.__assign(tslib_1.__assign({}, options), { 
                        // @ts-ignore
                        filteredData: (0, common_1.transformData)(data, data, options) }),
                });
                v.filterData(data);
                _this.rendering = true;
                v.render(true);
            });
        }
        this.rendering = false;
    };
    return ConversionTagAction;
}(g2_1.Action));
exports.ConversionTagAction = ConversionTagAction;
//# sourceMappingURL=funnel-conversion-tag.js.map