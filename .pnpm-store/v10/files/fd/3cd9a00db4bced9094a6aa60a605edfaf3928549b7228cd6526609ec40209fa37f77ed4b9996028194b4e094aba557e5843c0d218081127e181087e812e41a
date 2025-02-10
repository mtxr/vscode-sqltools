"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var matrix_1 = require("../util/matrix");
var theme_1 = require("../util/theme");
var util_2 = require("../util/util");
var CrosshairBase = /** @class */ (function (_super) {
    tslib_1.__extends(CrosshairBase, _super);
    function CrosshairBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CrosshairBase.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'crosshair', type: 'base', line: {}, text: null, textBackground: {}, capture: false, defaultCfg: {
                line: {
                    style: {
                        lineWidth: 1,
                        stroke: theme_1.default.lineColor,
                    },
                },
                text: {
                    position: 'start',
                    offset: 10,
                    autoRotate: false,
                    content: null,
                    style: {
                        fill: theme_1.default.textColor,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontFamily: theme_1.default.fontFamily,
                    },
                },
                textBackground: {
                    padding: 5,
                    style: {
                        stroke: theme_1.default.lineColor,
                    },
                },
            } });
    };
    CrosshairBase.prototype.renderInner = function (group) {
        if (this.get('line')) {
            this.renderLine(group);
        }
        if (this.get('text')) {
            this.renderText(group);
            this.renderBackground(group);
        }
    };
    CrosshairBase.prototype.renderText = function (group) {
        var text = this.get('text');
        var style = text.style, autoRotate = text.autoRotate, content = text.content;
        if (!util_1.isNil(content)) {
            var textPoint = this.getTextPoint();
            var matrix = null;
            if (autoRotate) {
                var angle = this.getRotateAngle();
                matrix = matrix_1.getMatrixByAngle(textPoint, angle);
            }
            this.addShape(group, {
                type: 'text',
                name: 'crosshair-text',
                id: this.getElementId('text'),
                attrs: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, textPoint), { text: content, matrix: matrix }), style),
            });
        }
    };
    CrosshairBase.prototype.renderLine = function (group) {
        var path = this.getLinePath();
        var line = this.get('line');
        var style = line.style;
        this.addShape(group, {
            type: 'path',
            name: 'crosshair-line',
            id: this.getElementId('line'),
            attrs: tslib_1.__assign({ path: path }, style),
        });
    };
    // 绘制文本的背景
    CrosshairBase.prototype.renderBackground = function (group) {
        var textId = this.getElementId('text');
        var textShape = group.findById(textId); // 查找文本
        var textBackground = this.get('textBackground');
        if (textBackground && textShape) {
            var textBBox = textShape.getBBox();
            var padding = util_2.formatPadding(textBackground.padding); // 用户传入的 padding 格式不定
            var style = textBackground.style;
            var backgroundShape = this.addShape(group, {
                type: 'rect',
                name: 'crosshair-text-background',
                id: this.getElementId('text-background'),
                attrs: tslib_1.__assign({ x: textBBox.x - padding[3], y: textBBox.y - padding[0], width: textBBox.width + padding[1] + padding[3], height: textBBox.height + padding[0] + padding[2], matrix: textShape.attr('matrix') }, style),
            });
            backgroundShape.toBack();
        }
    };
    return CrosshairBase;
}(group_component_1.default));
exports.default = CrosshairBase;
//# sourceMappingURL=base.js.map