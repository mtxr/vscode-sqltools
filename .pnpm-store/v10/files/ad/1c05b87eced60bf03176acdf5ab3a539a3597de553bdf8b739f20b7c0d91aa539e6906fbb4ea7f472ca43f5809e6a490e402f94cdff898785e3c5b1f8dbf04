import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
var Rose = /** @class */ (function (_super) {
    __extends(Rose, _super);
    function Rose() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 玫瑰图 */
        _this.type = 'rose';
        return _this;
    }
    /**
     * 获取 玫瑰图 默认配置项
     * 供外部使用
     */
    Rose.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    Rose.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        this.chart.changeData(data);
    };
    /**
     * 获取默认的 options 配置项
     */
    Rose.prototype.getDefaultOptions = function () {
        return Rose.getDefaultOptions();
    };
    /**
     * 获取 玫瑰图 的适配器
     */
    Rose.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Rose;
}(Plot));
export { Rose };
//# sourceMappingURL=index.js.map