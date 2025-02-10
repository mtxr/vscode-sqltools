"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var event_emitter_1 = tslib_1.__importDefault(require("@antv/event-emitter"));
/**
 * G2 Chart、View、Geometry 以及 Element 等的基类，提供事件以及一些通用的方法。
 */
var Base = /** @class */ (function (_super) {
    tslib_1.__extends(Base, _super);
    function Base(cfg) {
        var _this = _super.call(this) || this;
        /** 标识对象是否已销毁 */
        _this.destroyed = false;
        var _a = cfg.visible, visible = _a === void 0 ? true : _a;
        _this.visible = visible;
        return _this;
    }
    /**
     * 显示。
     */
    Base.prototype.show = function () {
        var visible = this.visible;
        if (!visible) {
            this.changeVisible(true);
        }
    };
    /**
     * 隐藏。
     */
    Base.prototype.hide = function () {
        var visible = this.visible;
        if (visible) {
            this.changeVisible(false);
        }
    };
    /**
     * 销毁。
     */
    Base.prototype.destroy = function () {
        this.off();
        this.destroyed = true;
    };
    /**
     * 显示或者隐藏。
     * @param visible
     * @returns
     */
    Base.prototype.changeVisible = function (visible) {
        if (this.visible === visible) {
            return;
        }
        this.visible = visible;
    };
    return Base;
}(event_emitter_1.default));
exports.default = Base;
//# sourceMappingURL=base.js.map