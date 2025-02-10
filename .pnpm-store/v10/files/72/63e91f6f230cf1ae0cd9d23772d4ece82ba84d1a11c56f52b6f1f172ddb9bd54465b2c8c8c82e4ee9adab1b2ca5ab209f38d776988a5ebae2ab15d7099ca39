"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var event_emitter_1 = require("@antv/event-emitter");
var util_1 = require("../util/util");
var Base = /** @class */ (function (_super) {
    tslib_1.__extends(Base, _super);
    function Base(cfg) {
        var _this = _super.call(this) || this;
        /**
         * 是否被销毁
         * @type {boolean}
         */
        _this.destroyed = false;
        var defaultCfg = _this.getDefaultCfg();
        _this.cfg = util_1.mix(defaultCfg, cfg);
        return _this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    Base.prototype.getDefaultCfg = function () {
        return {};
    };
    // 实现接口的方法
    Base.prototype.get = function (name) {
        return this.cfg[name];
    };
    // 实现接口的方法
    Base.prototype.set = function (name, value) {
        this.cfg[name] = value;
    };
    // 实现接口的方法
    Base.prototype.destroy = function () {
        this.cfg = {
            destroyed: true,
        };
        this.off();
        this.destroyed = true;
    };
    return Base;
}(event_emitter_1.default));
exports.default = Base;
//# sourceMappingURL=base.js.map