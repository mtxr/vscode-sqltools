"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var container_1 = require("./container");
var AbstractGroup = /** @class */ (function (_super) {
    tslib_1.__extends(AbstractGroup, _super);
    function AbstractGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractGroup.prototype.isGroup = function () {
        return true;
    };
    AbstractGroup.prototype.isEntityGroup = function () {
        return false;
    };
    AbstractGroup.prototype.clone = function () {
        var clone = _super.prototype.clone.call(this);
        // 获取构造函数
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            clone.add(child.clone());
        }
        return clone;
    };
    return AbstractGroup;
}(container_1.default));
exports.default = AbstractGroup;
//# sourceMappingURL=group.js.map