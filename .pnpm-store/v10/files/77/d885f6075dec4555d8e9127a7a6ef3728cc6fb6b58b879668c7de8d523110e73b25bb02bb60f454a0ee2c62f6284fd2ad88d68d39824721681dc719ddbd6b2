"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../base"));
var util_2 = require("../util");
/**
 * 元素过滤的 Action，控制元素的显示隐藏
 * @ignore
 */
var ElementFilter = /** @class */ (function (_super) {
    tslib_1.__extends(ElementFilter, _super);
    function ElementFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 过滤
     */
    ElementFilter.prototype.filter = function () {
        var delegateObject = (0, util_2.getDelegationObject)(this.context);
        var view = this.context.view;
        var elements = (0, util_2.getElements)(view);
        if ((0, util_2.isMask)(this.context)) {
            var maskElements_1 = (0, util_2.getMaskedElements)(this.context, 10);
            if (maskElements_1) {
                (0, util_1.each)(elements, function (el) {
                    if (maskElements_1.includes(el)) {
                        el.show();
                    }
                    else {
                        el.hide();
                    }
                });
            }
        }
        else if (delegateObject) {
            var component = delegateObject.component;
            var field_1 = component.get('field');
            // 列表类的组件能够触发
            if ((0, util_2.isList)(delegateObject)) {
                if (field_1) {
                    var unCheckedItems = component.getItemsByState('unchecked');
                    var scale_1 = (0, util_2.getScaleByField)(view, field_1);
                    var names_1 = unCheckedItems.map(function (item) { return item.name; });
                    // 直接控制显示、隐藏
                    (0, util_1.each)(elements, function (el) {
                        var value = (0, util_2.getElementValue)(el, field_1);
                        var text = scale_1.getText(value);
                        if (names_1.indexOf(text) >= 0) {
                            el.hide();
                        }
                        else {
                            el.show();
                        }
                    });
                }
            }
            else if ((0, util_2.isSlider)(delegateObject)) {
                var range = component.getValue();
                var _a = tslib_1.__read(range, 2), min_1 = _a[0], max_1 = _a[1];
                (0, util_1.each)(elements, function (el) {
                    var value = (0, util_2.getElementValue)(el, field_1);
                    if (value >= min_1 && value <= max_1) {
                        el.show();
                    }
                    else {
                        el.hide();
                    }
                });
            }
        }
    };
    /**
     * 清除过滤
     */
    ElementFilter.prototype.clear = function () {
        var elements = (0, util_2.getElements)(this.context.view);
        (0, util_1.each)(elements, function (el) {
            el.show();
        });
    };
    /**
     * 恢复发生的过滤，保持同 data-filter 命名的一致
     */
    ElementFilter.prototype.reset = function () {
        this.clear();
    };
    return ElementFilter;
}(base_1.default));
exports.default = ElementFilter;
//# sourceMappingURL=filter.js.map