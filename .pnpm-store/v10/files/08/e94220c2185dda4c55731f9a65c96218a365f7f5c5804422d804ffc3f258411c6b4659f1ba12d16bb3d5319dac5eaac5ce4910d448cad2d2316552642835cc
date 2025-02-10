"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var graphic_1 = require("../util/graphic");
var theme_1 = require("../util/theme");
var util_2 = require("../util/util");
var LineAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(LineAnnotation, _super);
    function LineAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    LineAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'line', locationType: 'region', start: null, end: null, style: {}, text: null, defaultCfg: {
                style: {
                    fill: theme_1.default.textColor,
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    fontFamily: theme_1.default.fontFamily,
                },
                text: {
                    position: 'center',
                    autoRotate: true,
                    content: null,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        stroke: theme_1.default.lineColor,
                        lineWidth: 1,
                    },
                },
            } });
    };
    LineAnnotation.prototype.renderInner = function (group) {
        this.renderLine(group);
        if (this.get('text')) {
            this.renderLabel(group);
        }
    };
    // 绘制线
    LineAnnotation.prototype.renderLine = function (group) {
        var start = this.get('start');
        var end = this.get('end');
        var style = this.get('style');
        this.addShape(group, {
            type: 'line',
            id: this.getElementId('line'),
            name: 'annotation-line',
            attrs: tslib_1.__assign({ x1: start.x, y1: start.y, x2: end.x, y2: end.y }, style),
        });
    };
    // 获取 label 的位置
    LineAnnotation.prototype.getLabelPoint = function (start, end, position) {
        var percent;
        if (position === 'start') {
            percent = 0;
        }
        else if (position === 'center') {
            percent = 0.5;
        }
        else if (util_1.isString(position) && position.indexOf('%') !== -1) {
            percent = parseInt(position, 10) / 100;
        }
        else if (util_1.isNumber(position)) {
            percent = position;
        }
        else {
            percent = 1;
        }
        if (percent > 1 || percent < 0) {
            percent = 1;
        }
        return {
            x: util_2.getValueByPercent(start.x, end.x, percent),
            y: util_2.getValueByPercent(start.y, end.y, percent),
        };
    };
    // 绘制 label
    LineAnnotation.prototype.renderLabel = function (group) {
        var text = this.get('text');
        var start = this.get('start');
        var end = this.get('end');
        var position = text.position, content = text.content, style = text.style, offsetX = text.offsetX, offsetY = text.offsetY, autoRotate = text.autoRotate, maxLength = text.maxLength, autoEllipsis = text.autoEllipsis, ellipsisPosition = text.ellipsisPosition, background = text.background, _a = text.isVertical, isVertical = _a === void 0 ? false : _a;
        var point = this.getLabelPoint(start, end, position);
        var x = point.x + offsetX;
        var y = point.y + offsetY;
        var cfg = {
            id: this.getElementId('line-text'),
            name: 'annotation-line-text',
            x: x,
            y: y,
            content: content,
            style: style,
            maxLength: maxLength,
            autoEllipsis: autoEllipsis,
            ellipsisPosition: ellipsisPosition,
            background: background,
            isVertical: isVertical,
        };
        // 如果自动旋转
        if (autoRotate) {
            var vector = [end.x - start.x, end.y - start.y];
            cfg.rotate = Math.atan2(vector[1], vector[0]);
        }
        graphic_1.renderTag(group, cfg);
    };
    return LineAnnotation;
}(group_component_1.default));
exports.default = LineAnnotation;
//# sourceMappingURL=line.js.map