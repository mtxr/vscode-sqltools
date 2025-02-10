"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
var util_1 = require("../util/util");
var ArcAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(ArcAnnotation, _super);
    function ArcAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    ArcAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'arc', locationType: 'circle', center: null, radius: 100, startAngle: -Math.PI / 2, endAngle: (Math.PI * 3) / 2, style: {
                stroke: '#999',
                lineWidth: 1,
            } });
    };
    ArcAnnotation.prototype.renderInner = function (group) {
        this.renderArc(group);
    };
    ArcAnnotation.prototype.getArcPath = function () {
        var _a = this.getLocation(), center = _a.center, radius = _a.radius, startAngle = _a.startAngle, endAngle = _a.endAngle;
        var startPoint = util_1.getCirclePoint(center, radius, startAngle);
        var endPoint = util_1.getCirclePoint(center, radius, endAngle);
        var largeFlag = endAngle - startAngle > Math.PI ? 1 : 0;
        var path = [['M', startPoint.x, startPoint.y]];
        if (endAngle - startAngle === Math.PI * 2) {
            // 整个圆是分割成两个圆
            var middlePoint = util_1.getCirclePoint(center, radius, startAngle + Math.PI);
            path.push(['A', radius, radius, 0, largeFlag, 1, middlePoint.x, middlePoint.y]);
            path.push(['A', radius, radius, 0, largeFlag, 1, endPoint.x, endPoint.y]);
        }
        else {
            path.push(['A', radius, radius, 0, largeFlag, 1, endPoint.x, endPoint.y]);
        }
        return path;
    };
    // 绘制 arc
    ArcAnnotation.prototype.renderArc = function (group) {
        // 也可以 通过 get('center') 类似的方式逐个获取
        var path = this.getArcPath();
        var style = this.get('style');
        this.addShape(group, {
            type: 'path',
            id: this.getElementId('arc'),
            name: 'annotation-arc',
            attrs: tslib_1.__assign({ path: path }, style),
        });
    };
    return ArcAnnotation;
}(group_component_1.default));
exports.default = ArcAnnotation;
//# sourceMappingURL=arc.js.map