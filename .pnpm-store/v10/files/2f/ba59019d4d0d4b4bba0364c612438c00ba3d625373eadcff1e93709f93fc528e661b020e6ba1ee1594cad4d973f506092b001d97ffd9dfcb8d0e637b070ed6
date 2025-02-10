import { __assign, __extends } from "tslib";
import GroupComponent from '../abstract/group-component';
import Theme from '../util/theme';
import { regionToBBox } from '../util/util';
var RegionAnnotation = /** @class */ (function (_super) {
    __extends(RegionAnnotation, _super);
    function RegionAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    RegionAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'region', locationType: 'region', start: null, end: null, style: {}, defaultCfg: {
                style: {
                    lineWidth: 0,
                    fill: Theme.regionColor,
                    opacity: 0.4,
                },
            } });
    };
    RegionAnnotation.prototype.renderInner = function (group) {
        this.renderRegion(group);
    };
    RegionAnnotation.prototype.renderRegion = function (group) {
        var start = this.get('start');
        var end = this.get('end');
        var style = this.get('style');
        var bbox = regionToBBox({ start: start, end: end });
        this.addShape(group, {
            type: 'rect',
            id: this.getElementId('region'),
            name: 'annotation-region',
            attrs: __assign({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height }, style),
        });
    };
    return RegionAnnotation;
}(GroupComponent));
export default RegionAnnotation;
//# sourceMappingURL=region.js.map