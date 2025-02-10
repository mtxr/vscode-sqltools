"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var group_component_1 = require("../abstract/group-component");
var graphic_1 = require("../util/graphic");
var matrix_1 = require("../util/matrix");
var theme_1 = require("../util/theme");
var TextAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(TextAnnotation, _super);
    function TextAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    TextAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'text', locationType: 'point', x: 0, y: 0, content: '', rotate: null, style: {}, background: null, maxLength: null, autoEllipsis: true, isVertical: false, ellipsisPosition: 'tail', defaultCfg: {
                style: {
                    fill: theme_1.default.textColor,
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontFamily: theme_1.default.fontFamily,
                },
            } });
    };
    // 复写 setLocation 方法，不需要重新创建 text
    TextAnnotation.prototype.setLocation = function (location) {
        this.set('x', location.x);
        this.set('y', location.y);
        this.resetLocation();
    };
    TextAnnotation.prototype.renderInner = function (group) {
        var _a = this.getLocation(), x = _a.x, y = _a.y;
        var content = this.get('content');
        var style = this.get('style');
        var id = this.getElementId('text');
        var name = this.get('name') + "-text";
        var maxLength = this.get('maxLength');
        var autoEllipsis = this.get('autoEllipsis');
        var isVertical = this.get('isVertical');
        var ellipsisPosition = this.get('ellipsisPosition');
        var background = this.get('background');
        var rotate = this.get('rotate');
        var cfg = {
            id: id,
            name: name,
            x: x,
            y: y,
            content: content,
            style: style,
            maxLength: maxLength,
            autoEllipsis: autoEllipsis,
            isVertical: isVertical,
            ellipsisPosition: ellipsisPosition,
            background: background,
            rotate: rotate,
        };
        graphic_1.renderTag(group, cfg);
    };
    TextAnnotation.prototype.resetLocation = function () {
        var textGroup = this.getElementByLocalId('text-group');
        if (textGroup) {
            var _a = this.getLocation(), x = _a.x, y = _a.y;
            var rotate = this.get('rotate');
            matrix_1.applyTranslate(textGroup, x, y);
            matrix_1.applyRotate(textGroup, rotate, x, y);
        }
    };
    return TextAnnotation;
}(group_component_1.default));
exports.default = TextAnnotation;
//# sourceMappingURL=text.js.map