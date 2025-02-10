import { __assign, __extends } from "tslib";
import GroupComponent from '../abstract/group-component';
import { createBBox, formatPadding } from '../util/util';
var LegendBase = /** @class */ (function (_super) {
    __extends(LegendBase, _super);
    function LegendBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LegendBase.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'legend', 
            /**
             * 布局方式： horizontal，vertical
             * @type {String}
             */
            layout: 'horizontal', locationType: 'point', x: 0, y: 0, offsetX: 0, offsetY: 0, title: null, background: null });
    };
    LegendBase.prototype.getLayoutBBox = function () {
        var bbox = _super.prototype.getLayoutBBox.call(this);
        var maxWidth = this.get('maxWidth');
        var maxHeight = this.get('maxHeight');
        var width = bbox.width, height = bbox.height;
        if (maxWidth) {
            width = Math.min(width, maxWidth);
        }
        if (maxHeight) {
            height = Math.min(height, maxHeight);
        }
        return createBBox(bbox.minX, bbox.minY, width, height);
    };
    LegendBase.prototype.setLocation = function (cfg) {
        this.set('x', cfg.x);
        this.set('y', cfg.y);
        this.resetLocation();
    };
    LegendBase.prototype.resetLocation = function () {
        var x = this.get('x');
        var y = this.get('y');
        var offsetX = this.get('offsetX');
        var offsetY = this.get('offsetY');
        this.moveElementTo(this.get('group'), {
            x: x + offsetX,
            y: y + offsetY,
        });
    };
    LegendBase.prototype.applyOffset = function () {
        this.resetLocation();
    };
    // 获取当前绘制的点
    LegendBase.prototype.getDrawPoint = function () {
        return this.get('currentPoint');
    };
    LegendBase.prototype.setDrawPoint = function (point) {
        return this.set('currentPoint', point);
    };
    // 复写父类定义的绘制方法
    LegendBase.prototype.renderInner = function (group) {
        this.resetDraw();
        if (this.get('title')) {
            this.drawTitle(group);
        }
        this.drawLegendContent(group);
        if (this.get('background')) {
            this.drawBackground(group);
        }
        // this.resetLocation(); // 在顶层已经在处理偏移时一起处理了
    };
    // 绘制背景
    LegendBase.prototype.drawBackground = function (group) {
        var background = this.get('background');
        var bbox = group.getBBox();
        var padding = formatPadding(background.padding);
        var attrs = __assign({ 
            // 背景从 (0,0) 开始绘制
            x: 0, y: 0, width: bbox.width + padding[1] + padding[3], height: bbox.height + padding[0] + padding[2] }, background.style);
        var backgroundShape = this.addShape(group, {
            type: 'rect',
            id: this.getElementId('background'),
            name: 'legend-background',
            attrs: attrs,
        });
        backgroundShape.toBack();
    };
    // 绘制标题，标题在图例项的上面
    LegendBase.prototype.drawTitle = function (group) {
        var currentPoint = this.get('currentPoint');
        var titleCfg = this.get('title');
        var spacing = titleCfg.spacing, style = titleCfg.style, text = titleCfg.text;
        var shape = this.addShape(group, {
            type: 'text',
            id: this.getElementId('title'),
            name: 'legend-title',
            attrs: __assign({ text: text, x: currentPoint.x, y: currentPoint.y }, style),
        });
        var bbox = shape.getBBox();
        // 标题单独在一行
        this.set('currentPoint', { x: currentPoint.x, y: bbox.maxY + spacing });
    };
    // 重置绘制时开始的位置，如果绘制边框，考虑边框的 padding
    LegendBase.prototype.resetDraw = function () {
        var background = this.get('background');
        var currentPoint = { x: 0, y: 0 };
        if (background) {
            var padding = formatPadding(background.padding);
            currentPoint.x = padding[3]; // 左边 padding
            currentPoint.y = padding[0]; // 上面 padding
        }
        this.set('currentPoint', currentPoint); // 设置绘制的初始位置
    };
    return LegendBase;
}(GroupComponent));
export default LegendBase;
//# sourceMappingURL=base.js.map