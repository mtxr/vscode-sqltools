"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
var theme_1 = require("../util/theme");
var util_1 = require("../util/util");
var RegionAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(RegionAnnotation, _super);
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
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'region', locationType: 'region', start: null, end: null, style: {}, defaultCfg: {
                style: {
                    lineWidth: 0,
                    fill: theme_1.default.regionColor,
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
        var bbox = util_1.regionToBBox({ start: start, end: end });
        this.addShape(group, {
            type: 'rect',
            id: this.getElementId('region'),
            name: 'annotation-region',
            attrs: tslib_1.__assign({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height }, style),
        });
    };
    return RegionAnnotation;
}(group_component_1.default));
exports.default = RegionAnnotation;
//# sourceMappingURL=region.js.map