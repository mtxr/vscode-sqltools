"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var util_2 = require("../util/util");
var RegionFilterAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(RegionFilterAnnotation, _super);
    function RegionFilterAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    RegionFilterAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'regionFilter', locationType: 'region', start: null, end: null, color: null, shape: [] });
    };
    RegionFilterAnnotation.prototype.renderInner = function (group) {
        var _this = this;
        var start = this.get('start');
        var end = this.get('end');
        // 1. add region layer
        var layer = this.addGroup(group, {
            id: this.getElementId('region-filter'),
            capture: false,
        });
        // 2. clone shape & color it
        util_1.each(this.get('shapes'), function (shape, shapeIdx) {
            var type = shape.get('type');
            var attrs = util_1.clone(shape.attr());
            _this.adjustShapeAttrs(attrs);
            _this.addShape(layer, {
                id: _this.getElementId("shape-" + type + "-" + shapeIdx),
                capture: false,
                type: type,
                attrs: attrs,
            });
        });
        // 3. clip
        var clipBBox = util_2.regionToBBox({ start: start, end: end });
        layer.setClip({
            type: 'rect',
            attrs: {
                x: clipBBox.minX,
                y: clipBBox.minY,
                width: clipBBox.width,
                height: clipBBox.height,
            },
        });
    };
    RegionFilterAnnotation.prototype.adjustShapeAttrs = function (attr) {
        var color = this.get('color');
        if (attr.fill) {
            attr.fill = attr.fillStyle = color;
        }
        attr.stroke = attr.strokeStyle = color;
    };
    return RegionFilterAnnotation;
}(group_component_1.default));
exports.default = RegionFilterAnnotation;
//# sourceMappingURL=region-filter.js.map