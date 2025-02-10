"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = exports.DEFAULT_HANDLER_STYLE = void 0;
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
exports.DEFAULT_HANDLER_STYLE = {
    fill: '#F7F7F7',
    stroke: '#BFBFBF',
    radius: 2,
    opacity: 1,
    cursor: 'ew-resize',
    // 高亮的颜色
    highLightFill: '#FFF',
};
var Handler = /** @class */ (function (_super) {
    tslib_1.__extends(Handler, _super);
    function Handler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Handler.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'handler', x: 0, y: 0, width: 10, height: 24, style: exports.DEFAULT_HANDLER_STYLE });
    };
    Handler.prototype.renderInner = function (group) {
        var _a = this.cfg, width = _a.width, height = _a.height, style = _a.style;
        var fill = style.fill, stroke = style.stroke, radius = style.radius, opacity = style.opacity, cursor = style.cursor;
        // 按钮框框
        this.addShape(group, {
            type: 'rect',
            id: this.getElementId('background'),
            attrs: {
                x: 0,
                y: 0,
                width: width,
                height: height,
                fill: fill,
                stroke: stroke,
                radius: radius,
                opacity: opacity,
                cursor: cursor,
            },
        });
        // 两根竖线
        var x1 = (1 / 3) * width;
        var x2 = (2 / 3) * width;
        var y1 = (1 / 4) * height;
        var y2 = (3 / 4) * height;
        this.addShape(group, {
            id: this.getElementId('line-left'),
            type: 'line',
            attrs: {
                x1: x1,
                y1: y1,
                x2: x1,
                y2: y2,
                stroke: stroke,
                cursor: cursor,
            },
        });
        this.addShape(group, {
            id: this.getElementId('line-right'),
            type: 'line',
            attrs: {
                x1: x2,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: stroke,
                cursor: cursor,
            },
        });
    };
    Handler.prototype.applyOffset = function () {
        this.moveElementTo(this.get('group'), {
            x: this.get('x'),
            y: this.get('y'),
        });
    };
    Handler.prototype.initEvent = function () {
        this.bindEvents();
    };
    Handler.prototype.bindEvents = function () {
        var _this = this;
        this.get('group').on('mouseenter', function () {
            var highLightFill = _this.get('style').highLightFill;
            _this.getElementByLocalId('background').attr('fill', highLightFill);
            _this.draw();
        });
        this.get('group').on('mouseleave', function () {
            var fill = _this.get('style').fill;
            _this.getElementByLocalId('background').attr('fill', fill);
            _this.draw();
        });
    };
    Handler.prototype.draw = function () {
        var canvas = this.get('container').get('canvas');
        if (canvas) {
            canvas.draw();
        }
    };
    return Handler;
}(group_component_1.default));
exports.Handler = Handler;
exports.default = Handler;
//# sourceMappingURL=handler.js.map