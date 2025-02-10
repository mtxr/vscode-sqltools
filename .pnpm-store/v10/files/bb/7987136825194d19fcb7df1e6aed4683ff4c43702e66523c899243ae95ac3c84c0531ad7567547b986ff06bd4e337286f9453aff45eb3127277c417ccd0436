"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var ShapeAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(ShapeAnnotation, _super);
    function ShapeAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'shape', draw: util_1.noop });
    };
    ShapeAnnotation.prototype.renderInner = function (group) {
        var render = this.get('render');
        if (util_1.isFunction(render)) {
            render(group);
        }
    };
    return ShapeAnnotation;
}(group_component_1.default));
exports.default = ShapeAnnotation;
//# sourceMappingURL=shape.js.map