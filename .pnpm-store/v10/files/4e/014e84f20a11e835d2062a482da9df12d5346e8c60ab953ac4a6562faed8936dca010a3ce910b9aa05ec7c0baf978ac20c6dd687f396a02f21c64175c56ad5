"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_base_1 = require("@antv/g-base");
var svg_1 = require("../util/svg");
var dom_1 = require("../util/dom");
var draw_1 = require("../util/draw");
var constant_1 = require("../constant");
var Shape = require("./index");
var group_1 = require("../group");
var g_base_2 = require("@antv/g-base");
var ShapeBase = /** @class */ (function (_super) {
    tslib_1.__extends(ShapeBase, _super);
    function ShapeBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'svg';
        _this.canFill = false;
        _this.canStroke = false;
        return _this;
    }
    ShapeBase.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        // 设置默认值
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { lineWidth: 1, lineAppendWidth: 0, strokeOpacity: 1, fillOpacity: 1 });
    };
    // 覆盖基类的 afterAttrsChange 方法
    ShapeBase.prototype.afterAttrsChange = function (targetAttrs) {
        _super.prototype.afterAttrsChange.call(this, targetAttrs);
        var canvas = this.get('canvas');
        // 只有挂载到画布下，才对元素进行实际渲染
        if (canvas && canvas.get('autoDraw')) {
            var context = canvas.get('context');
            this.draw(context, targetAttrs);
        }
    };
    ShapeBase.prototype.getShapeBase = function () {
        return Shape;
    };
    ShapeBase.prototype.getGroupBase = function () {
        return group_1.default;
    };
    /**
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    ShapeBase.prototype.onCanvasChange = function (changeType) {
        draw_1.refreshElement(this, changeType);
    };
    ShapeBase.prototype.calculateBBox = function () {
        var el = this.get('el');
        var bbox = null;
        // 包围盒计算依赖于绘制，如果还没有生成对应的 Dom 元素，则包围盒的长宽均为 0
        if (el) {
            bbox = el.getBBox();
        }
        else {
            var bboxMethod = g_base_2.getBBoxMethod(this.get('type'));
            if (bboxMethod) {
                bbox = bboxMethod(this);
            }
        }
        if (bbox) {
            var x = bbox.x, y = bbox.y, width = bbox.width, height = bbox.height;
            var lineWidth = this.getHitLineWidth();
            var halfWidth = lineWidth / 2;
            var minX = x - halfWidth;
            var minY = y - halfWidth;
            var maxX = x + width + halfWidth;
            var maxY = y + height + halfWidth;
            return {
                x: minX,
                y: minY,
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY,
                width: width + lineWidth,
                height: height + lineWidth,
            };
        }
        return {
            x: 0,
            y: 0,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            width: 0,
            height: 0,
        };
    };
    ShapeBase.prototype.isFill = function () {
        var _a = this.attr(), fill = _a.fill, fillStyle = _a.fillStyle;
        return (fill || fillStyle || this.isClipShape()) && this.canFill;
    };
    ShapeBase.prototype.isStroke = function () {
        var _a = this.attr(), stroke = _a.stroke, strokeStyle = _a.strokeStyle;
        return (stroke || strokeStyle) && this.canStroke;
    };
    ShapeBase.prototype.draw = function (context, targetAttrs) {
        var el = this.get('el');
        if (this.get('destroyed')) {
            if (el) {
                el.parentNode.removeChild(el);
            }
        }
        else {
            if (!el) {
                dom_1.createDom(this);
            }
            svg_1.setClip(this, context);
            this.createPath(context, targetAttrs);
            this.shadow(context, targetAttrs);
            this.strokeAndFill(context, targetAttrs);
            this.transform(targetAttrs);
        }
    };
    /**
     * @protected
     * 绘制图形的路径
     * @param {Defs} context 上下文
     * @param {ShapeAttrs} targetAttrs 渲染的目标属性
     */
    ShapeBase.prototype.createPath = function (context, targetAttrs) { };
    // stroke and fill
    ShapeBase.prototype.strokeAndFill = function (context, targetAttrs) {
        var attrs = targetAttrs || this.attr();
        var fill = attrs.fill, fillStyle = attrs.fillStyle, stroke = attrs.stroke, strokeStyle = attrs.strokeStyle, fillOpacity = attrs.fillOpacity, strokeOpacity = attrs.strokeOpacity, lineWidth = attrs.lineWidth;
        var el = this.get('el');
        if (this.canFill) {
            // 初次渲染和更新渲染的逻辑有所不同: 初次渲染值为空时，需要设置为 none，否则就会是黑色，而更新渲染则不需要
            if (!targetAttrs) {
                this._setColor(context, 'fill', fill || fillStyle);
            }
            else if ('fill' in attrs) {
                this._setColor(context, 'fill', fill);
            }
            else if ('fillStyle' in attrs) {
                // compatible with fillStyle
                this._setColor(context, 'fill', fillStyle);
            }
            if (fillOpacity) {
                el.setAttribute(constant_1.SVG_ATTR_MAP['fillOpacity'], fillOpacity);
            }
        }
        if (this.canStroke && lineWidth > 0) {
            if (!targetAttrs) {
                this._setColor(context, 'stroke', stroke || strokeStyle);
            }
            else if ('stroke' in attrs) {
                this._setColor(context, 'stroke', stroke);
            }
            else if ('strokeStyle' in attrs) {
                // compatible with strokeStyle
                this._setColor(context, 'stroke', strokeStyle);
            }
            if (strokeOpacity) {
                el.setAttribute(constant_1.SVG_ATTR_MAP['strokeOpacity'], strokeOpacity);
            }
            if (lineWidth) {
                el.setAttribute(constant_1.SVG_ATTR_MAP['lineWidth'], lineWidth);
            }
        }
    };
    ShapeBase.prototype._setColor = function (context, attr, value) {
        var el = this.get('el');
        if (!value) {
            // need to set `none` to avoid default value
            el.setAttribute(constant_1.SVG_ATTR_MAP[attr], 'none');
            return;
        }
        value = value.trim();
        if (/^[r,R,L,l]{1}[\s]*\(/.test(value)) {
            var id = context.find('gradient', value);
            if (!id) {
                id = context.addGradient(value);
            }
            el.setAttribute(constant_1.SVG_ATTR_MAP[attr], "url(#" + id + ")");
        }
        else if (/^[p,P]{1}[\s]*\(/.test(value)) {
            var id = context.find('pattern', value);
            if (!id) {
                id = context.addPattern(value);
            }
            el.setAttribute(constant_1.SVG_ATTR_MAP[attr], "url(#" + id + ")");
        }
        else {
            el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
        }
    };
    ShapeBase.prototype.shadow = function (context, targetAttrs) {
        var attrs = this.attr();
        var _a = targetAttrs || attrs, shadowOffsetX = _a.shadowOffsetX, shadowOffsetY = _a.shadowOffsetY, shadowBlur = _a.shadowBlur, shadowColor = _a.shadowColor;
        if (shadowOffsetX || shadowOffsetY || shadowBlur || shadowColor) {
            svg_1.setShadow(this, context);
        }
    };
    ShapeBase.prototype.transform = function (targetAttrs) {
        var attrs = this.attr();
        var matrix = (targetAttrs || attrs).matrix;
        if (matrix) {
            svg_1.setTransform(this);
        }
    };
    ShapeBase.prototype.isInShape = function (refX, refY) {
        return this.isPointInPath(refX, refY);
    };
    ShapeBase.prototype.isPointInPath = function (refX, refY) {
        var el = this.get('el');
        var canvas = this.get('canvas');
        var bbox = canvas.get('el').getBoundingClientRect();
        var clientX = refX + bbox.left;
        var clientY = refY + bbox.top;
        var element = document.elementFromPoint(clientX, clientY);
        if (element && element.isEqualNode(el)) {
            return true;
        }
        return false;
    };
    /**
     * 获取线拾取的宽度
     * @returns {number} 线的拾取宽度
     */
    ShapeBase.prototype.getHitLineWidth = function () {
        var _a = this.attrs, lineWidth = _a.lineWidth, lineAppendWidth = _a.lineAppendWidth;
        if (this.isStroke()) {
            return lineWidth + lineAppendWidth;
        }
        return 0;
    };
    return ShapeBase;
}(g_base_1.AbstractShape));
exports.default = ShapeBase;
//# sourceMappingURL=base.js.map