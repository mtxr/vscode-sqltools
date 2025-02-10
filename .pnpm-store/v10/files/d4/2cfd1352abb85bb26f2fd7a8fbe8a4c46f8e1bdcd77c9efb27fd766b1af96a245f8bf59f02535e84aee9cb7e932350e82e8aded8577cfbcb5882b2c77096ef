import { __assign, __extends } from "tslib";
import { isFunction, noop } from '@antv/util';
import GroupComponent from '../abstract/group-component';
var ShapeAnnotation = /** @class */ (function (_super) {
    __extends(ShapeAnnotation, _super);
    function ShapeAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'shape', draw: noop });
    };
    ShapeAnnotation.prototype.renderInner = function (group) {
        var render = this.get('render');
        if (isFunction(render)) {
            render(group);
        }
    };
    return ShapeAnnotation;
}(GroupComponent));
export default ShapeAnnotation;
//# sourceMappingURL=shape.js.map