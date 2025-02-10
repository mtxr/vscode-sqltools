"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var range_filter_1 = tslib_1.__importDefault(require("./range-filter"));
var util_2 = require("../util");
/**
 * 数据范围过滤，但不在当前的 view 上生效，而在当前的 view 同一层级的其他 views 上生效，用于实现联动过滤。
 * @ignore
 */
var SiblingFilter = /** @class */ (function (_super) {
    tslib_1.__extends(SiblingFilter, _super);
    function SiblingFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 对 view 进行过滤
     * @param view
     * @param field
     * @param filter
     */
    SiblingFilter.prototype.filterView = function (view, field, filter) {
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            sibling.filter(field, filter);
        });
    };
    /**
     * 重新渲染
     * @param view
     */
    SiblingFilter.prototype.reRender = function (view) {
        var siblings = (0, util_2.getSilbings)(view);
        (0, util_1.each)(siblings, function (sibling) {
            sibling.render(true);
        });
    };
    return SiblingFilter;
}(range_filter_1.default));
exports.default = SiblingFilter;
//# sourceMappingURL=sibling-filter.js.map