"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = tslib_1.__importDefault(require("../base"));
var util_2 = require("../util");
/**
 * Sibling filter
 * @ignore
 */
var SiblingFilter = /** @class */ (function (_super) {
    tslib_1.__extends(SiblingFilter, _super);
    function SiblingFilter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.byRecord = false;
        return _this;
    }
    /**
     * 过滤隐藏图形
     */
    SiblingFilter.prototype.filter = function () {
        // 仅考虑 mask 导致的过滤
        if ((0, util_2.isMask)(this.context)) {
            if (this.byRecord) {
                this.filterByRecord();
            }
            else {
                this.filterByBBox();
            }
        }
    };
    // 根据框选的记录来做过滤
    SiblingFilter.prototype.filterByRecord = function () {
        var view = this.context.view;
        var maskElements = (0, util_2.getMaskedElements)(this.context, 10);
        if (!maskElements) {
            return;
        }
        var xFiled = view.getXScale().field;
        var yField = view.getYScales()[0].field;
        var records = maskElements.map(function (el) {
            return el.getModel().data;
        });
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            var elements = (0, util_2.getElements)(sibling);
            (0, util_1.each)(elements, function (el) {
                var record = el.getModel().data;
                // records.includes(record) 不生效，应该是数据的引用被改了
                if ((0, util_2.isInRecords)(records, record, xFiled, yField)) {
                    el.show();
                }
                else {
                    el.hide();
                }
            });
        });
    };
    // 根据被框选的包围盒做过滤
    SiblingFilter.prototype.filterByBBox = function () {
        var _this = this;
        var view = this.context.view;
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            var maskElements = (0, util_2.getSiblingMaskElements)(_this.context, sibling, 10);
            var elements = (0, util_2.getElements)(sibling);
            if (maskElements) {
                // mask 过小时返回为 null，不能是空数组，否则同未框选到混淆
                (0, util_1.each)(elements, function (el) {
                    if (maskElements.includes(el)) {
                        el.show();
                    }
                    else {
                        el.hide();
                    }
                });
            }
        });
    };
    /**
     * 清理所有隐藏的图形
     */
    SiblingFilter.prototype.reset = function () {
        var siblings = (0, util_2.getSilbings)(this.context.view);
        (0, util_1.each)(siblings, function (sibling) {
            var elements = (0, util_2.getElements)(sibling);
            (0, util_1.each)(elements, function (el) {
                el.show();
            });
        });
    };
    return SiblingFilter;
}(base_1.default));
exports.default = SiblingFilter;
//# sourceMappingURL=sibling-filter.js.map