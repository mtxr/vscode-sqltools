"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var Bullet = /** @class */ (function (_super) {
    tslib_1.__extends(Bullet, _super);
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
        return constant_1.DEFAULT_OPTIONS;
    };
    Bullet.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = (0, utils_1.transformData)(this.options), min = _a.min, max = _a.max, ds = _a.ds;
        // 处理scale
        (0, adaptor_1.meta)({ options: this.options, ext: { data: { min: min, max: max } }, chart: this.chart });
        this.chart.changeData(ds);
    };
    /**
     * 获取子弹图的适配器
     */
    Bullet.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 获取 子弹图 默认配置
     */
    Bullet.prototype.getDefaultOptions = function () {
        return Bullet.getDefaultOptions();
    };
    return Bullet;
}(plot_1.Plot));
exports.Bullet = Bullet;
//# sourceMappingURL=index.js.map