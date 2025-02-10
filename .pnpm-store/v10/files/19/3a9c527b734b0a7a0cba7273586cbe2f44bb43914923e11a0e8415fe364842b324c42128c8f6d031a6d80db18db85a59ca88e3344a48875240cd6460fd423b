"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../core/plot");
var utils_1 = require("../utils");
/**
 * 给 G2Plot 提供非常简单的开放开发的机制。目的是能够让社区和业务上自己基于 G2Plot 开发自己的定制图表库。主要分成几类图表：
 * 1. 领域专业的图表，内部同学因为没有场景，不一定能做的完善。
 * 2. 定制业务的图表，不具备通用性
 * 3. 趣味性的可视化组件
 * 然后官方可以根据社区的情况，可以进行一些官方推荐和采纳。
 *
 * 如果使用？
 *
 * ```ts
 * import { P } from '@antv/g2plot';
 * import { GeoWorldMap, GeoWorldMapOptions } from 'g2plot-geo-world-map';
 *
 * const plot = new P('container', {
 *   geoJson: '',
 *   longitude: '',
 *   latitude: '',
 * }, GeoWorldMap, defaultOptions);
 *
 * plot.render();
 * ```
 */
var P = /** @class */ (function (_super) {
    tslib_1.__extends(P, _super);
    /**
     * 相比普通图表增加 adaptor 参数。
     * @param container
     * @param options
     * @param adaptor
     * @param defaultOptions
     */
    function P(container, options, adaptor, defaultOptions) {
        var _this = _super.call(this, container, (0, utils_1.deepAssign)({}, defaultOptions, options)) || this;
        /** 统一为 any plot */
        _this.type = 'g2-plot';
        _this.defaultOptions = defaultOptions;
        _this.adaptor = adaptor;
        return _this;
    }
    /**
     * 实现父类方法，直接使用传入的
     */
    P.prototype.getDefaultOptions = function () {
        return this.defaultOptions;
    };
    /**
     * 实现父类方法，直接使用传入的
     */
    P.prototype.getSchemaAdaptor = function () {
        return this.adaptor;
    };
    return P;
}(plot_1.Plot));
exports.P = P;
//# sourceMappingURL=index.js.map