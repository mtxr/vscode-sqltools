import { __assign, __extends } from "tslib";
import GroupComponent from '../abstract/group-component';
import { renderTag } from '../util/graphic';
import { applyRotate, applyTranslate } from '../util/matrix';
import Theme from '../util/theme';
var TextAnnotation = /** @class */ (function (_super) {
    __extends(TextAnnotation, _super);
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
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'text', locationType: 'point', x: 0, y: 0, content: '', rotate: null, style: {}, background: null, maxLength: null, autoEllipsis: true, isVertical: false, ellipsisPosition: 'tail', defaultCfg: {
                style: {
                    fill: Theme.textColor,
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontFamily: Theme.fontFamily,
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
        renderTag(group, cfg);
    };
    TextAnnotation.prototype.resetLocation = function () {
        var textGroup = this.getElementByLocalId('text-group');
        if (textGroup) {
            var _a = this.getLocation(), x = _a.x, y = _a.y;
            var rotate = this.get('rotate');
            applyTranslate(textGroup, x, y);
            applyRotate(textGroup, rotate, x, y);
        }
    };
    return TextAnnotation;
}(GroupComponent));
export default TextAnnotation;
//# sourceMappingURL=text.js.map