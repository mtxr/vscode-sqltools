import { __assign, __extends } from "tslib";
import { vec2 } from '@antv/matrix-util';
import { each, isFunction, isNil, isNumberEqual, isObject } from '@antv/util';
import AxisBase from './base';
import * as OverlapUtil from './overlap';
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { type: 'line', locationType: 'region', 
            /**
             * 起始点, x, y
             * @type {object}
             */
            start: null, 
            /**
             * 结束点, x, y
             * @type {object}
             */
            end: null });
    };
    // 获取坐标轴线的 path
    Line.prototype.getLinePath = function () {
        var start = this.get('start');
        var end = this.get('end');
        var path = [];
        path.push(['M', start.x, start.y]);
        path.push(['L', end.x, end.y]);
        return path;
    };
    // 重新计算 layout bbox，考虑到 line 不显示
    Line.prototype.getInnerLayoutBBox = function () {
        var start = this.get('start');
        var end = this.get('end');
        var bbox = _super.prototype.getInnerLayoutBBox.call(this);
        var minX = Math.min(start.x, end.x, bbox.x);
        var minY = Math.min(start.y, end.y, bbox.y);
        var maxX = Math.max(start.x, end.x, bbox.maxX);
        var maxY = Math.max(start.y, end.y, bbox.maxY);
        return {
            x: minX,
            y: minY,
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: maxX - minX,
            height: maxY - minY,
        };
    };
    Line.prototype.isVertical = function () {
        var start = this.get('start');
        var end = this.get('end');
        return isNumberEqual(start.x, end.x);
    };
    Line.prototype.isHorizontal = function () {
        var start = this.get('start');
        var end = this.get('end');
        return isNumberEqual(start.y, end.y);
    };
    Line.prototype.getTickPoint = function (tickValue) {
        var self = this;
        var start = self.get('start');
        var end = self.get('end');
        var regionX = end.x - start.x;
        var regionY = end.y - start.y;
        return {
            x: start.x + regionX * tickValue,
            y: start.y + regionY * tickValue,
        };
    };
    // 直线坐标轴下任一点的向量方向都相同
    Line.prototype.getSideVector = function (offset) {
        var axisVector = this.getAxisVector();
        var normal = vec2.normalize([0, 0], axisVector);
        var factor = this.get('verticalFactor');
        var verticalVector = [normal[1], normal[0] * -1]; // 垂直方向，逆时针方向
        return vec2.scale([0, 0], verticalVector, offset * factor);
    };
    // 获取坐标轴的向量
    Line.prototype.getAxisVector = function () {
        var start = this.get('start');
        var end = this.get('end');
        return [end.x - start.x, end.y - start.y];
    };
    Line.prototype.processOverlap = function (labelGroup) {
        var _this = this;
        var isVertical = this.isVertical();
        var isHorizontal = this.isHorizontal();
        // 非垂直，或者非水平时不处理遮挡问题
        if (!isVertical && !isHorizontal) {
            return;
        }
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
                var bbox = labelGroup.getCanvasBBox();
                var length_1 = isVertical ? bbox.width : bbox.height;
                // 如果用户没有设置 offset，则自动计算
                titleCfg.offset = labelOffset + length_1 + titleSpacing + titleHeight / 2;
            }
        }
    };
    /**
     * 是否可以执行某一 overlap
     * @param name
     */
    Line.prototype.canProcessOverlap = function (name) {
        var labelCfg = this.get('label');
        // 对 autoRotate，如果配置了旋转角度，直接进行固定角度旋转
        if (name === 'autoRotate') {
            return isNil(labelCfg.rotate);
        }
        // 默认所有 overlap 都可执行
        return true;
    };
    Line.prototype.autoProcessOverlap = function (name, value, labelGroup, limitLength) {
        var _this = this;
        var isVertical = this.isVertical();
        var hasAdjusted = false;
        var util = OverlapUtil[name];
        if (value === true) {
            var labelCfg = this.get('label');
            // true 形式的配置：使用 overlap 默认的的处理方法进行处理
            hasAdjusted = util.getDefault()(isVertical, labelGroup, limitLength);
        }
        else if (isFunction(value)) {
            // 回调函数形式的配置： 用户可以传入回调函数
            hasAdjusted = value(isVertical, labelGroup, limitLength);
        }
        else if (isObject(value)) {
            // object 形式的配置方式：包括 处理方法 type， 和可选参数配置 cfg
            var overlapCfg = value;
            if (util[overlapCfg.type]) {
                hasAdjusted = util[overlapCfg.type](isVertical, labelGroup, limitLength, overlapCfg.cfg);
            }
        }
        else if (util[value]) {
            // 字符串类型的配置：按照名称执行 overlap 处理方法
            hasAdjusted = util[value](isVertical, labelGroup, limitLength);
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
    return Line;
}(AxisBase));
export default Line;
//# sourceMappingURL=line.js.map