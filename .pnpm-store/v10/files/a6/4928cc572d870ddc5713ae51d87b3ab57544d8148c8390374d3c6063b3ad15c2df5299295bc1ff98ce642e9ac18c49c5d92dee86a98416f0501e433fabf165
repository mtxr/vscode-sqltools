import { __assign, __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
// 注册的shape
import './shapes/word-cloud';
import { processImageMask, transform } from './utils';
var WordCloud = /** @class */ (function (_super) {
    __extends(WordCloud, _super);
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
        return DEFAULT_OPTIONS;
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
            this.chart.changeData(transform({ chart: this.chart, options: this.options }));
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
                _this.options = __assign(__assign({}, _this.options), { imageMask: img || null });
                // 调用父类渲染函数
                _super.prototype.render.call(_this);
                res();
            };
            processImageMask(imageMask).then(handler).catch(handler);
        });
    };
    /**
     * 获取 词云图 的适配器
     */
    WordCloud.prototype.getSchemaAdaptor = function () {
        return adaptor;
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
}(Plot));
export { WordCloud };
//# sourceMappingURL=index.js.map