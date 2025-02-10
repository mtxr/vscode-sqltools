"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../base"));
var util_2 = require("../util");
/**
 * 数据过滤。
 * @ignore
 */
var DataFilter = /** @class */ (function (_super) {
    tslib_1.__extends(DataFilter, _super);
    function DataFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataFilter.prototype.filterView = function (view, field, filter) {
        var _this = this;
        // 只有存在这个 scale 时才生效
        if (view.getScaleByField(field)) {
            view.filter(field, filter);
        }
        if (view.views && view.views.length) {
            (0, util_1.each)(view.views, function (subView) {
                _this.filterView(subView, field, filter);
            });
        }
    };
    /**
     * 过滤数据
     */
    DataFilter.prototype.filter = function () {
        var delegateObject = (0, util_2.getDelegationObject)(this.context);
        if (delegateObject) {
            var view = this.context.view;
            var component = delegateObject.component;
            var field = component.get('field');
            // 列表类的组件能够触发
            if ((0, util_2.isList)(delegateObject)) {
                if (field) {
                    var unCheckedItems = component.getItemsByState('unchecked');
                    var scale_1 = (0, util_2.getScaleByField)(view, field);
                    var names_1 = unCheckedItems.map(function (item) { return item.name; });
                    if (names_1.length) {
                        this.filterView(view, field, function (value) {
                            var text = scale_1.getText(value);
                            return !names_1.includes(text);
                        });
                    }
                    else {
                        this.filterView(view, field, null);
                    }
                    view.render(true);
                }
            }
            else if ((0, util_2.isSlider)(delegateObject)) {
                var range = component.getValue();
                var _a = tslib_1.__read(range, 2), min_1 = _a[0], max_1 = _a[1];
                this.filterView(view, field, function (value) {
                    return value >= min_1 && value <= max_1;
                });
                view.render(true);
            }
        }
    };
    return DataFilter;
}(base_1.default));
exports.default = DataFilter;
//# sourceMappingURL=filter.js.map