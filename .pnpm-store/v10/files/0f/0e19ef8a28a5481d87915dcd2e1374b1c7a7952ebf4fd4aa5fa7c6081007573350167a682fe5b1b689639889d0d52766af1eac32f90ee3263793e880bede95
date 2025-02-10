"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rose = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
var Rose = /** @class */ (function (_super) {
    tslib_1.__extends(Rose, _super);
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
        return constant_1.DEFAULT_OPTIONS;
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
        return adaptor_1.adaptor;
    };
    return Rose;
}(plot_1.Plot));
exports.Rose = Rose;
//# sourceMappingURL=index.js.map