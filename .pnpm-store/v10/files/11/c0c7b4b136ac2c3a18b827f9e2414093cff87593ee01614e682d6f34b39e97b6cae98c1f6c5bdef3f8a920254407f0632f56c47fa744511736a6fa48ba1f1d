"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var theme_1 = require("../util/theme");
var util_2 = require("../util/util");
var graphic_1 = require("../util/graphic");
var DataRegionAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(DataRegionAnnotation, _super);
    function DataRegionAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    DataRegionAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'dataRegion', locationType: 'points', points: [], lineLength: 0, region: {}, text: {}, defaultCfg: {
                region: {
                    style: {
                        lineWidth: 0,
                        fill: theme_1.default.regionColor,
                        opacity: 0.4,
                    },
                },
                text: {
                    content: '',
                    style: {
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        fontSize: 12,
                        fill: theme_1.default.textColor,
                        fontFamily: theme_1.default.fontFamily,
                    },
                },
            } });
    };
    DataRegionAnnotation.prototype.renderInner = function (group) {
        var regionStyle = util_1.get(this.get('region'), 'style', {});
        var textStyle = util_1.get(this.get('text'), 'style', {});
        var lineLength = this.get('lineLength') || 0;
        var points = this.get('points');
        if (!points.length) {
            return;
        }
        var bbox = util_2.pointsToBBox(points);
        // render region
        var path = [];
        path.push(['M', points[0].x, bbox.minY - lineLength]);
        points.forEach(function (point) {
            path.push(['L', point.x, point.y]);
        });
        path.push(['L', points[points.length - 1].x, points[points.length - 1].y - lineLength]);
        this.addShape(group, {
            type: 'path',
            id: this.getElementId('region'),
            name: 'annotation-region',
            attrs: tslib_1.__assign({ path: path }, regionStyle),
        });
        // render text
        var textCfg = tslib_1.__assign({ id: this.getElementId('text'), name: 'annotation-text', x: (bbox.minX + bbox.maxX) / 2, y: bbox.minY - lineLength }, this.get('text'));
        graphic_1.renderTag(group, textCfg);
    };
    return DataRegionAnnotation;
}(group_component_1.default));
exports.default = DataRegionAnnotation;
//# sourceMappingURL=data-region.js.map