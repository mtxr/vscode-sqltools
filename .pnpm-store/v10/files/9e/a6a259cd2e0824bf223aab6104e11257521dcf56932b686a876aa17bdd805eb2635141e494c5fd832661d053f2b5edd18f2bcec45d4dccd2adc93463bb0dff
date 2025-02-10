import { __assign, __extends } from "tslib";
import { Action } from '@antv/g2';
import { each, filter, get, map } from '@antv/util';
import { conversionTag as basicConversionTag } from '../geometries/basic';
import { CONVERSION_TAG_NAME, transformData } from '../geometries/common';
import { compareConversionTag } from '../geometries/compare';
/**
 * Funnel 转化率跟随 legend 变化事件
 */
var ConversionTagAction = /** @class */ (function (_super) {
    __extends(ConversionTagAction, _super);
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
            var conversionTag_1 = compareField ? compareConversionTag : basicConversionTag;
            var view = this.context.view;
            // 兼容分面漏斗图
            var views = seriesField || compareField ? view.views : [view];
            map(views, function (v, index) {
                // 防止影响其他 annotations 被去除
                var annotationController = v.getController('annotation');
                var annotations = filter(get(annotationController, ['option'], []), function (_a) {
                    var name = _a.name;
                    return name !== CONVERSION_TAG_NAME;
                });
                annotationController.clear(true);
                each(annotations, function (annotation) {
                    if (typeof annotation === 'object') {
                        v.annotation()[annotation.type](annotation);
                    }
                });
                var data = get(v, ['filteredData'], v.getOptions().data);
                conversionTag_1({
                    chart: v,
                    index: index,
                    options: __assign(__assign({}, options), { 
                        // @ts-ignore
                        filteredData: transformData(data, data, options) }),
                });
                v.filterData(data);
                _this.rendering = true;
                v.render(true);
            });
        }
        this.rendering = false;
    };
    return ConversionTagAction;
}(Action));
export { ConversionTagAction };
//# sourceMappingURL=funnel-conversion-tag.js.map