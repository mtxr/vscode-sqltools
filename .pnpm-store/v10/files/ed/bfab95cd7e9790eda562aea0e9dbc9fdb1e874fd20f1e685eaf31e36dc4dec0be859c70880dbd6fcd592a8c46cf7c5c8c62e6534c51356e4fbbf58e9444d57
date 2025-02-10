import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constants';
import { getProgressData } from './utils';
var Progress = /** @class */ (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'process';
        return _this;
    }
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    Progress.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    /**
     * 更新数据
     * @param percent
     */
    Progress.prototype.changeData = function (percent) {
        this.updateOption({ percent: percent });
        this.chart.changeData(getProgressData(percent));
    };
    Progress.prototype.getDefaultOptions = function () {
        return Progress.getDefaultOptions();
    };
    /**
     * 获取 进度图 的适配器
     */
    Progress.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Progress;
}(Plot));
export { Progress };
//# sourceMappingURL=index.js.map