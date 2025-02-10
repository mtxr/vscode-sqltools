import { __assign, __extends } from "tslib";
import { each, isNil, isFunction, isObject } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import AxisBase from './base';
import * as OverlapUtil from './overlap';
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { type: 'circle', locationType: 'circle', center: null, radius: null, startAngle: -Math.PI / 2, endAngle: (Math.PI * 3) / 2 });
    };
    Circle.prototype.getLinePath = function () {
        var center = this.get('center');
        var x = center.x;
        var y = center.y;
        var rx = this.get('radius');
        var ry = rx;
        var startAngle = this.get('startAngle');
        var endAngle = this.get('endAngle');
        var path = [];
        if (Math.abs(endAngle - startAngle) === Math.PI * 2) {
            path = [['M', x, y - ry], ['A', rx, ry, 0, 1, 1, x, y + ry], ['A', rx, ry, 0, 1, 1, x, y - ry], ['Z']];
        }
        else {
            var startPoint = this.getCirclePoint(startAngle);
            var endPoint = this.getCirclePoint(endAngle);
            var large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
            var sweep = startAngle > endAngle ? 0 : 1;
            path = [
                ['M', x, y],
                ['L', startPoint.x, startPoint.y],
                ['A', rx, ry, 0, large, sweep, endPoint.x, endPoint.y],
                ['L', x, y],
            ];
        }
        return path;
    };
    Circle.prototype.getTickPoint = function (tickValue) {
        var startAngle = this.get('startAngle');
        var endAngle = this.get('endAngle');
        var angle = startAngle + (endAngle - startAngle) * tickValue;
        return this.getCirclePoint(angle);
    };
    // 获取垂直于坐标轴的向量
    Circle.prototype.getSideVector = function (offset, point) {
        var center = this.get('center');
        var vector = [point.x - center.x, point.y - center.y];
        var factor = this.get('verticalFactor');
        var vecLen = vec2.length(vector);
        vec2.scale(vector, vector, (factor * offset) / vecLen);
        return vector;
    };
    // 获取沿坐标轴方向的向量
    Circle.prototype.getAxisVector = function (point) {
        var center = this.get('center');
        var vector = [point.x - center.x, point.y - center.y];
        return [vector[1], -1 * vector[0]]; // 获取顺时针方向的向量
    };
    // 根据圆心和半径获取点
    Circle.prototype.getCirclePoint = function (angle, radius) {
        var center = this.get('center');
        radius = radius || this.get('radius');
        return {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
        };
    };
    /**
     * 是否可以执行某一 overlap
     * @param name
     */
    Circle.prototype.canProcessOverlap = function (name) {
        var labelCfg = this.get('label');
        // 对 autoRotate，如果配置了旋转角度，直接进行固定角度旋转
        if (name === 'autoRotate') {
            return isNil(labelCfg.rotate);
        }
        // 默认所有 overlap 都可执行
        return true;
    };
    Circle.prototype.processOverlap = function (labelGroup) {
        var _this = this;
        var labelCfg = this.get('label');
        var titleCfg = this.get('title');
        var verticalLimitLength = this.get('verticalLimitLength');
        var labelOffset = labelCfg.offset;
        var limitLength = verticalLimitLength;
        var titleHeight = 0;
        var titleSpacing = 0;
        if (titleCfg) {
            titleHeight = titleCfg.style.fontSize;
            titleSpacing = titleCfg.spacing;
        }
        if (limitLength) {
            limitLength = limitLength - labelOffset - titleSpacing - titleHeight;
        }
        var overlapOrder = this.get('overlapOrder');
        each(overlapOrder, function (name) {
            if (labelCfg[name] && _this.canProcessOverlap(name)) {
                _this.autoProcessOverlap(name, labelCfg[name], labelGroup, limitLength);
            }
        });
        if (titleCfg) {
            if (isNil(titleCfg.offset)) {
                // 调整 title 的 offset
                var length_1 = labelGroup.getCanvasBBox().height;
                // 如果用户没有设置 offset，则自动计算
                titleCfg.offset = labelOffset + length_1 + titleSpacing + titleHeight / 2;
            }
        }
    };
    Circle.prototype.autoProcessOverlap = function (name, value, labelGroup, limitLength) {
        var _this = this;
        var hasAdjusted = false;
        var util = OverlapUtil[name];
        if (limitLength > 0) {
            if (value === true) {
                // true 形式的配置：使用 overlap 默认的的处理方法进行处理
                hasAdjusted = util.getDefault()(false, labelGroup, limitLength);
            }
            else if (isFunction(value)) {
                // 回调函数形式的配置： 用户可以传入回调函数
                hasAdjusted = value(false, labelGroup, limitLength);
            }
            else if (isObject(value)) {
                // object 形式的配置方式：包括 处理方法 type， 和可选参数配置 cfg
                var overlapCfg = value;
                if (util[overlapCfg.type]) {
                    hasAdjusted = util[overlapCfg.type](false, labelGroup, limitLength, overlapCfg.cfg);
                }
            }
            else if (util[value]) {
                // 字符串类型的配置：按照名称执行 overlap 处理方法
                hasAdjusted = util[value](false, labelGroup, limitLength);
            }
        }
        if (name === 'autoRotate') {
            // 文本旋转后，文本的对齐方式可能就不合适了
            if (hasAdjusted) {
                var labels = labelGroup.getChildren();
                var verticalFactor_1 = this.get('verticalFactor');
                each(labels, function (label) {
                    var textAlign = label.attr('textAlign');
                    if (textAlign === 'center') {
                        // 居中的文本需要调整旋转度
                        var newAlign = verticalFactor_1 > 0 ? 'end' : 'start';
                        label.attr('textAlign', newAlign);
                    }
                });
            }
        }
        else if (name === 'autoHide') {
            var children = labelGroup.getChildren().slice(0); // 复制数组，删除时不会出错
            each(children, function (label) {
                if (!label.get('visible')) {
                    if (_this.get('isRegister')) {
                        // 已经注册过了，则删除
                        _this.unregisterElement(label);
                    }
                    label.remove(); // 防止 label 数量太多，所以统一删除
                }
            });
        }
    };
    return Circle;
}(AxisBase));
export default Circle;
//# sourceMappingURL=circle.js.map