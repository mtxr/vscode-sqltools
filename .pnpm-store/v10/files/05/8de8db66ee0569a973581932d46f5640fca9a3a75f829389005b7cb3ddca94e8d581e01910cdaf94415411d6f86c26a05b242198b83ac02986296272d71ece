import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor, meta } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
import { transformData } from './utils';
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'bullet';
        return _this;
    }
    /**
     * 获取 子弹图 默认配置项
     * 供外部使用
     */
    Bullet.getDefaultOptions = function () {
        return DEFAULT_OPTIONS;
    };
    Bullet.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = transformData(this.options), min = _a.min, max = _a.max, ds = _a.ds;
        // 处理scale
        meta({ options: this.options, ext: { data: { min: min, max: max } }, chart: this.chart });
        this.chart.changeData(ds);
    };
    /**
     * 获取子弹图的适配器
     */
    Bullet.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /**
     * 获取 子弹图 默认配置
     */
    Bullet.prototype.getDefaultOptions = function () {
        return Bullet.getDefaultOptions();
    };
    return Bullet;
}(Plot));
export { Bullet };
//# sourceMappingURL=index.js.map