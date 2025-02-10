import { __extends } from "tslib";
import { Action } from '..';
var DIM_X = 'x';
var DIM_Y = 'y';
/**
 * Scale translate
 * @ignore
 */
var ScaleTranslate = /** @class */ (function (_super) {
    __extends(ScaleTranslate, _super);
    function ScaleTranslate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dims = [DIM_X, DIM_Y];
        _this.cfgFields = ['dims'];
        _this.cacheScaleDefs = {};
        return _this;
    }
    // 是否支持对应字段的平移
    ScaleTranslate.prototype.hasDim = function (dim) {
        return this.dims.includes(dim);
    };
    ScaleTranslate.prototype.getScale = function (dim) {
        var view = this.context.view;
        if (dim === 'x') {
            return view.getXScale();
        }
        else {
            return view.getYScales()[0];
        }
    };
    ScaleTranslate.prototype.resetDim = function (dim) {
        var view = this.context.view;
        if (this.hasDim(dim) && this.cacheScaleDefs[dim]) {
            var scale = this.getScale(dim);
            view.scale(scale.field, this.cacheScaleDefs[dim]);
            this.cacheScaleDefs[dim] = null;
        }
    };
    /**
     * 回滚
     */
    ScaleTranslate.prototype.reset = function () {
        this.resetDim(DIM_X);
        this.resetDim(DIM_Y);
        var view = this.context.view;
        view.render(true);
    };
    return ScaleTranslate;
}(Action));
export default ScaleTranslate;
//# sourceMappingURL=scale-transform.js.map