"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chord = void 0;
var tslib_1 = require("tslib");
var plot_1 = require("../../core/plot");
var adaptor_1 = require("./adaptor");
var constant_1 = require("./constant");
/**
 *  弦图 Chord
 */
var Chord = /** @class */ (function (_super) {
    tslib_1.__extends(Chord, _super);
    function Chord() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'chord';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    Chord.getDefaultOptions = function () {
        return constant_1.DEFAULT_OPTIONS;
    };
    Chord.prototype.getDefaultOptions = function () {
        return Chord.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    Chord.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Chord;
}(plot_1.Plot));
exports.Chord = Chord;
//# sourceMappingURL=index.js.map