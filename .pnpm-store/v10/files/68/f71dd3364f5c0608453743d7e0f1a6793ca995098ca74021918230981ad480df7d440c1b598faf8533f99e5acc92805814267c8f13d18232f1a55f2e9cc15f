import { __extends } from "tslib";
import { Plot } from '../../core/plot';
import { adaptor } from './adaptor';
import { DEFAULT_OPTIONS } from './constant';
/**
 *  弦图 Chord
 */
var Chord = /** @class */ (function (_super) {
    __extends(Chord, _super);
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
        return DEFAULT_OPTIONS;
    };
    Chord.prototype.getDefaultOptions = function () {
        return Chord.getDefaultOptions();
    };
    /**
     * 获取适配器
     */
    Chord.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Chord;
}(Plot));
export { Chord };
//# sourceMappingURL=index.js.map