import { __assign, __extends } from "tslib";
import { get } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import Theme from '../util/theme';
import { pointsToBBox } from '../util/util';
import { renderTag } from '../util/graphic';
var DataRegionAnnotation = /** @class */ (function (_super) {
    __extends(DataRegionAnnotation, _super);
    function DataRegionAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    DataRegionAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'dataRegion', locationType: 'points', points: [], lineLength: 0, region: {}, text: {}, defaultCfg: {
                region: {
                    style: {
                        lineWidth: 0,
                        fill: Theme.regionColor,
                        opacity: 0.4,
                    },
                },
                text: {
                    content: '',
                    style: {
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        fontSize: 12,
                        fill: Theme.textColor,
                        fontFamily: Theme.fontFamily,
                    },
                },
            } });
    };
    DataRegionAnnotation.prototype.renderInner = function (group) {
        var regionStyle = get(this.get('region'), 'style', {});
        var textStyle = get(this.get('text'), 'style', {});
        var lineLength = this.get('lineLength') || 0;
        var points = this.get('points');
        if (!points.length) {
            return;
        }
        var bbox = pointsToBBox(points);
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
            attrs: __assign({ path: path }, regionStyle),
        });
        // render text
        var textCfg = __assign({ id: this.getElementId('text'), name: 'annotation-text', x: (bbox.minX + bbox.maxX) / 2, y: bbox.minY - lineLength }, this.get('text'));
        renderTag(group, textCfg);
    };
    return DataRegionAnnotation;
}(GroupComponent));
export default DataRegionAnnotation;
//# sourceMappingURL=data-region.js.map