import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import './interactions';
/**
 * 多图层图形，释放 G2 80% 的功能，可以用来做：
 * 1. 图层叠加的图：
 *   - 折线 + 置信度区间迭代
 *   - 嵌套饼图
 *   - ...
 * 2. 图层划分的图
 *   - 多维图
 *   - 柱饼组合图
 *   - ...
 */
var Mix = /** @class */ (function (_super) {
    __extends(Mix, _super);
    function Mix() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'mix';
        return _this;
    }
    /**
     * 获取适配器
     */
    Mix.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Mix;
}(Plot));
export { Mix };
//# sourceMappingURL=index.js.map