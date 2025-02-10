import { __extends } from "tslib";
import Container from './container';
var AbstractGroup = /** @class */ (function (_super) {
    __extends(AbstractGroup, _super);
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
}(Container));
export default AbstractGroup;
//# sourceMappingURL=group.js.map