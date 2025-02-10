"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordCloud = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
// 注册的shape
require("./shapes/word-cloud");
var utils_1 = require("./utils");
var WordCloud = /** @class */ (function (_super) {
    tslib_1.__extends(WordCloud, _super);
    function WordCloud() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 词云图 */
        _this.type = 'word-cloud';
        return _this;
    }
    /**
     * 获取 词云图 默认配置项
     * 供外部使用
     */
    WordCloud.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    /**
     * @override
     * @param data
     */
    WordCloud.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        if (this.options.imageMask) {
            this.render();
        }
        else {
            this.chart.changeData((0, utils_1.transform)({ chart: this.chart, options: this.options }));
        }
    };
    /**
     * 获取默认的 options 配置项
     */
    WordCloud.prototype.getDefaultOptions = function () {
        return WordCloud.getDefaultOptions();
    };
    /**
     * 覆写父类方法，词云图需要加载图片资源，所以需要异步渲染
     */
    WordCloud.prototype.render = function () {
        var _this = this;
        return new Promise(function (res) {
            var imageMask = _this.options.imageMask;
            if (!imageMask) {
                // 调用父类渲染函数
                _super.prototype.render.call(_this);
                res();
                return;
            }
            var handler = function (img) {
                _this.options = tslib_1.__assign(tslib_1.__assign({}, _this.options), { imageMask: img || null });
                // 调用父类渲染函数
                _super.prototype.render.call(_this);
                res();
            };
            (0, utils_1.processImageMask)(imageMask).then(handler).catch(handler);
        });
    };
    /**
     * 获取 词云图 的适配器
     */
    WordCloud.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    /**
     * 覆写父类的方法，因为词云图使用 单独的函数 进行布局，原理上有些不一样
     */
    WordCloud.prototype.triggerResize = function () {
        var _this = this;
        if (!this.chart.destroyed) {
            // 当整个词云图图表的宽高信息发生变化时，每个词语的坐标
            // 需要重新执行 adaptor，不然会出现布局错乱，
            // 如相邻词语重叠的情况。
            this.execAdaptor();
            // 延迟执行，有利于动画更流畅
            // TODO: 在多次更改画布尺寸时，动画会越来越卡顿，原因未知
            window.setTimeout(function () {
                // 执行父类的方法
                _super.prototype.triggerResize.call(_this);
            });
        }
    };
    return WordCloud;
}(plot_1.Plot));
exports.WordCloud = WordCloud;
//# sourceMappingURL=index.js.map