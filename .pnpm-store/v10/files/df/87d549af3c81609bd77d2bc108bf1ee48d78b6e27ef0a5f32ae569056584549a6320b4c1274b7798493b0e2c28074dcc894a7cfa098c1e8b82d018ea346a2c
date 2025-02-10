import { __assign, __extends } from "tslib";
import { createDom, modifyCSS } from '@antv/dom-util';
import { substitute, hasKey } from '@antv/util';
import { toPx, getTextPoint } from '../util/util';
import HtmlComponent from '../abstract/html-component';
import * as CssConst from './css-const';
import HtmlTheme from './html-theme';
var HtmlCrosshair = /** @class */ (function (_super) {
    __extends(HtmlCrosshair, _super);
    function HtmlCrosshair() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlCrosshair.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'crosshair', type: 'html', locationType: 'region', start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, capture: false, text: null, containerTpl: "<div class=\"" + CssConst.CONTAINER_CLASS + "\"></div>", crosshairTpl: "<div class=\"" + CssConst.CROSSHAIR_LINE + "\"></div>", textTpl: "<span class=\"" + CssConst.CROSSHAIR_TEXT + "\">{content}</span>", domStyles: null, containerClassName: CssConst.CONTAINER_CLASS, defaultStyles: HtmlTheme, defaultCfg: {
                text: {
                    position: 'start',
                    content: null,
                    align: 'center',
                    offset: 10
                }
            } });
    };
    HtmlCrosshair.prototype.render = function () {
        this.resetText();
        this.resetPosition();
    };
    // 绘制 crosshair
    HtmlCrosshair.prototype.initCrossHair = function () {
        var container = this.getContainer();
        var crosshairTpl = this.get('crosshairTpl');
        var crosshairEl = createDom(crosshairTpl);
        container.appendChild(crosshairEl);
        this.applyStyle(CssConst.CROSSHAIR_LINE, crosshairEl);
        this.set('crosshairEl', crosshairEl);
    };
    // 获取文本的位置
    HtmlCrosshair.prototype.getTextPoint = function () {
        var _a = this.getLocation(), start = _a.start, end = _a.end;
        var _b = this.get('text'), position = _b.position, offset = _b.offset;
        return getTextPoint(start, end, position, offset);
    };
    // 设置 text
    HtmlCrosshair.prototype.resetText = function () {
        var text = this.get('text');
        var textEl = this.get('textEl');
        if (text) {
            var content = text.content;
            if (!textEl) {
                var container = this.getContainer();
                var textTpl = substitute(this.get('textTpl'), text);
                textEl = createDom(textTpl);
                container.appendChild(textEl);
                this.applyStyle(CssConst.CROSSHAIR_TEXT, textEl);
                this.set('textEl', textEl);
            }
            textEl.innerHTML = content;
        }
        else if (textEl) {
            textEl.remove();
        }
    };
    // 是否垂直
    HtmlCrosshair.prototype.isVertical = function (start, end) {
        return start.x === end.x;
    };
    // 重新调整位置
    HtmlCrosshair.prototype.resetPosition = function () {
        var crosshairEl = this.get('crosshairEl');
        if (!crosshairEl) {
            this.initCrossHair();
            crosshairEl = this.get('crosshairEl');
        }
        var start = this.get('start');
        var end = this.get('end');
        var minX = Math.min(start.x, end.x);
        var minY = Math.min(start.y, end.y);
        if (this.isVertical(start, end)) {
            modifyCSS(crosshairEl, {
                width: '1px',
                height: toPx(Math.abs(end.y - start.y))
            });
        }
        else {
            modifyCSS(crosshairEl, {
                height: '1px',
                width: toPx(Math.abs(end.x - start.x))
            });
        }
        modifyCSS(crosshairEl, {
            top: toPx(minY),
            left: toPx(minX)
        });
        this.alignText();
    };
    HtmlCrosshair.prototype.alignText = function () {
        // 重新设置 text 位置
        var textEl = this.get('textEl');
        if (textEl) {
            var align = this.get('text').align;
            var clientWidth = textEl.clientWidth;
            var point = this.getTextPoint();
            switch (align) {
                case 'center':
                    point.x = point.x - clientWidth / 2;
                    break;
                case 'right':
                    point.x = point.x - clientWidth;
                case 'left':
                    break;
            }
            modifyCSS(textEl, {
                top: toPx(point.y),
                left: toPx(point.x)
            });
        }
    };
    HtmlCrosshair.prototype.updateInner = function (cfg) {
        if (hasKey(cfg, 'text')) {
            this.resetText();
        }
        _super.prototype.updateInner.call(this, cfg);
    };
    return HtmlCrosshair;
}(HtmlComponent));
export default HtmlCrosshair;
//# sourceMappingURL=html.js.map