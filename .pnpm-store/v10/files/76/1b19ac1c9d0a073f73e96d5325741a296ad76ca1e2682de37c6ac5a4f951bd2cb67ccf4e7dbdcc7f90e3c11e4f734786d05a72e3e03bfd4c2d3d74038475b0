import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import { transformViolinData } from './utils';
var Violin = /** @class */ (function (_super) {
    __extends(Violin, _super);
    function Violin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'violin';
        return _this;
    }
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    Violin.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     */
    Violin.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        this.chart.changeData(transformViolinData(this.options));
    };
    /**
     * 获取 小提琴图 默认配置项
     */
    Violin.prototype.getDefaultOptions = function () {
        return Violin.getDefaultOptions();
    };
    /**
     * 获取 小提琴图 的适配器
     */
    Violin.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Violin;
}(Plot));
export { Violin };
//# sourceMappingURL=index.js.map