"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = tslib_1.__importDefault(require("./base"));
/** 回调函数构建的 Action */
var CallbackAction = /** @class */ (function (_super) {
    tslib_1.__extends(CallbackAction, _super);
    function CallbackAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 执行
     */
    CallbackAction.prototype.execute = function () {
        if (this.callback) {
            this.callback(this.context);
        }
    };
    /**
     * 销毁
     */
    CallbackAction.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.callback = null;
    };
    return CallbackAction;
}(base_1.default));
exports.default = CallbackAction;
//# sourceMappingURL=callback.js.map