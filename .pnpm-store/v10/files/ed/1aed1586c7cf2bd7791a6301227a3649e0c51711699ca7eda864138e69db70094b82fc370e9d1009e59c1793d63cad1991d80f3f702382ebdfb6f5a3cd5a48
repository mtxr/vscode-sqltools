import { __extends } from "tslib";
import Action from './base';
/** 回调函数构建的 Action */
var CallbackAction = /** @class */ (function (_super) {
    __extends(CallbackAction, _super);
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
}(Action));
export default CallbackAction;
//# sourceMappingURL=callback.js.map