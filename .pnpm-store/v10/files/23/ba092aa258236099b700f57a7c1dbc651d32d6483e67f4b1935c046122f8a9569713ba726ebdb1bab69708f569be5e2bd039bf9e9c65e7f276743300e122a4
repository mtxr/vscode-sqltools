/**
 * @fileoverview 文本
 * @author dxq613@gmail.com
 */
import { __assign, __extends } from "tslib";
import ShapeBase from './base';
import { isNil, isString, each } from '../util/util';
import { getTextHeight, assembleFont } from '@antv/g-base';
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 默认文本属性
    Text.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { x: 0, y: 0, text: null, fontSize: 12, fontFamily: 'sans-serif', fontStyle: 'normal', fontWeight: 'normal', fontVariant: 'normal', textAlign: 'start', textBaseline: 'bottom' });
    };
    // 仅仅使用包围盒检测来进行拾取
    Text.prototype.isOnlyHitBox = function () {
        return true;
    };
    // 初始化时组合 font，同时判断 text 是否换行
    Text.prototype.initAttrs = function (attrs) {
        this._assembleFont();
        if (attrs.text) {
            this._setText(attrs.text);
        }
    };
    // 组装字体
    Text.prototype._assembleFont = function () {
        var attrs = this.attrs;
        attrs.font = assembleFont(attrs);
    };
    // 如果文本换行，则缓存数组
    Text.prototype._setText = function (text) {
        var textArr = null;
        if (isString(text) && text.indexOf('\n') !== -1) {
            textArr = text.split('\n');
        }
        this.set('textArr', textArr);
    };
    // 更新属性时，检测是否更改了 font、text
    Text.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        if (name.startsWith('font')) {
            this._assembleFont();
        }
        if (name === 'text') {
            this._setText(value);
        }
    };
    // 这个方法在 text 时没有可以做的事情，如果要支持文字背景时可以考虑
    // createPath(context) {
    // }
    // 如果文本多行，需要获取文本间距
    Text.prototype._getSpaceingY = function () {
        var attrs = this.attrs;
        var lineHeight = attrs.lineHeight;
        var fontSize = attrs.fontSize * 1;
        return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
    };
    // 绘制文本，考虑多行的场景
    Text.prototype._drawTextArr = function (context, textArr, isFill) {
        var attrs = this.attrs;
        var textBaseline = attrs.textBaseline;
        var x = attrs.x;
        var y = attrs.y;
        var fontSize = attrs.fontSize * 1;
        var spaceingY = this._getSpaceingY();
        var height = getTextHeight(attrs.text, attrs.fontSize, attrs.lineHeight);
        var subY;
        each(textArr, function (subText, index) {
            subY = y + index * (spaceingY + fontSize) - height + fontSize; // bottom;
            if (textBaseline === 'middle')
                subY += height - fontSize - (height - fontSize) / 2;
            if (textBaseline === 'top')
                subY += height - fontSize;
            if (!isNil(subText)) {
                if (isFill) {
                    context.fillText(subText, x, subY);
                }
                else {
                    context.strokeText(subText, x, subY);
                }
            }
        });
    };
    // 绘制文本，同时考虑填充和绘制边框
    Text.prototype._drawText = function (context, isFill) {
        var attrs = this.attr();
        var x = attrs.x;
        var y = attrs.y;
        var textArr = this.get('textArr');
        if (textArr) {
            this._drawTextArr(context, textArr, isFill);
        }
        else {
            var text = attrs.text;
            if (!isNil(text)) {
                if (isFill) {
                    context.fillText(text, x, y);
                }
                else {
                    context.strokeText(text, x, y);
                }
            }
        }
    };
    // 复写绘制和填充的逻辑：对于文本，应该先绘制边框，再进行填充
    Text.prototype.strokeAndFill = function (context) {
        var _a = this.attrs, lineWidth = _a.lineWidth, opacity = _a.opacity, strokeOpacity = _a.strokeOpacity, fillOpacity = _a.fillOpacity;
        if (this.isStroke()) {
            if (lineWidth > 0) {
                if (!isNil(strokeOpacity) && strokeOpacity !== 1) {
                    context.globalAlpha = opacity;
                }
                this.stroke(context);
            }
        }
        if (this.isFill()) {
            if (!isNil(fillOpacity) && fillOpacity !== 1) {
                context.globalAlpha = fillOpacity;
                this.fill(context);
                context.globalAlpha = opacity;
            }
            else {
                this.fill(context);
            }
        }
        this.afterDrawPath(context);
    };
    // 复写填充逻辑
    Text.prototype.fill = function (context) {
        this._drawText(context, true);
    };
    // 复写绘制边框的逻辑
    Text.prototype.stroke = function (context) {
        this._drawText(context, false);
    };
    return Text;
}(ShapeBase));
export default Text;
//# sourceMappingURL=text.js.map