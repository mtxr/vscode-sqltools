import { __extends } from "tslib";
import { each } from '@antv/util';
import RangeFilter from './range-filter';
import { getSilbings } from '../util';
/**
 * 数据范围过滤，但不在当前的 view 上生效，而在当前的 view 同一层级的其他 views 上生效，用于实现联动过滤。
 * @ignore
 */
var SiblingFilter = /** @class */ (function (_super) {
    __extends(SiblingFilter, _super);
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
        var siblings = getSilbings(view);
        each(siblings, function (sibling) {
            sibling.filter(field, filter);
        });
    };
    /**
     * 重新渲染
     * @param view
     */
    SiblingFilter.prototype.reRender = function (view) {
        var siblings = getSilbings(view);
        each(siblings, function (sibling) {
            sibling.render(true);
        });
    };
    return SiblingFilter;
}(RangeFilter));
export default SiblingFilter;
//# sourceMappingURL=sibling-filter.js.map