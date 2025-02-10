"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var single_state_1 = tslib_1.__importDefault(require("./single-state"));
/**
 * @ignore
 * 仅允许单个 Element Active 的 Action
 */
var ElementSingleActive = /** @class */ (function (_super) {
    tslib_1.__extends(ElementSingleActive, _super);
    function ElementSingleActive() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stateName = 'active';
        return _this;
    }
    /**
     * 当前事件相关的 Element Active
     */
    ElementSingleActive.prototype.active = function () {
        this.setState();
    };
    return ElementSingleActive;
}(single_state_1.default));
exports.default = ElementSingleActive;
//# sourceMappingURL=single-active.js.map