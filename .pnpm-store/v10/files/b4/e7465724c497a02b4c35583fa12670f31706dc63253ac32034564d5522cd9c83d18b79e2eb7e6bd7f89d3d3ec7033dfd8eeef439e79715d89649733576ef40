import { __assign, __extends } from "tslib";
import { clone, each } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { regionToBBox } from '../util/util';
var RegionFilterAnnotation = /** @class */ (function (_super) {
    __extends(RegionFilterAnnotation, _super);
    function RegionFilterAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    RegionFilterAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'regionFilter', locationType: 'region', start: null, end: null, color: null, shape: [] });
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
        each(this.get('shapes'), function (shape, shapeIdx) {
            var type = shape.get('type');
            var attrs = clone(shape.attr());
            _this.adjustShapeAttrs(attrs);
            _this.addShape(layer, {
                id: _this.getElementId("shape-" + type + "-" + shapeIdx),
                capture: false,
                type: type,
                attrs: attrs,
            });
        });
        // 3. clip
        var clipBBox = regionToBBox({ start: start, end: end });
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
}(GroupComponent));
export default RegionFilterAnnotation;
//# sourceMappingURL=region-filter.js.map