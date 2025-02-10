"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_util_1 = require("@antv/dom-util");
var util_1 = require("@antv/util");
var util_2 = require("../util/util");
var html_component_1 = require("../abstract/html-component");
var CssConst = require("./css-const");
var html_theme_1 = require("./html-theme");
var HtmlCrosshair = /** @class */ (function (_super) {
    tslib_1.__extends(HtmlCrosshair, _super);
    function HtmlCrosshair() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlCrosshair.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'crosshair', type: 'html', locationType: 'region', start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, capture: false, text: null, containerTpl: "<div class=\"" + CssConst.CONTAINER_CLASS + "\"></div>", crosshairTpl: "<div class=\"" + CssConst.CROSSHAIR_LINE + "\"></div>", textTpl: "<span class=\"" + CssConst.CROSSHAIR_TEXT + "\">{content}</span>", domStyles: null, containerClassName: CssConst.CONTAINER_CLASS, defaultStyles: html_theme_1.default, defaultCfg: {
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
        var crosshairEl = dom_util_1.createDom(crosshairTpl);
        container.appendChild(crosshairEl);
        this.applyStyle(CssConst.CROSSHAIR_LINE, crosshairEl);
        this.set('crosshairEl', crosshairEl);
    };
    // 获取文本的位置
    HtmlCrosshair.prototype.getTextPoint = function () {
        var _a = this.getLocation(), start = _a.start, end = _a.end;
        var _b = this.get('text'), position = _b.position, offset = _b.offset;
        return util_2.getTextPoint(start, end, position, offset);
    };
    // 设置 text
    HtmlCrosshair.prototype.resetText = function () {
        var text = this.get('text');
        var textEl = this.get('textEl');
        if (text) {
            var content = text.content;
            if (!textEl) {
                var container = this.getContainer();
                var textTpl = util_1.substitute(this.get('textTpl'), text);
                textEl = dom_util_1.createDom(textTpl);
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
            dom_util_1.modifyCSS(crosshairEl, {
                width: '1px',
                height: util_2.toPx(Math.abs(end.y - start.y))
            });
        }
        else {
            dom_util_1.modifyCSS(crosshairEl, {
                height: '1px',
                width: util_2.toPx(Math.abs(end.x - start.x))
            });
        }
        dom_util_1.modifyCSS(crosshairEl, {
            top: util_2.toPx(minY),
            left: util_2.toPx(minX)
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
            dom_util_1.modifyCSS(textEl, {
                top: util_2.toPx(point.y),
                left: util_2.toPx(point.x)
            });
        }
    };
    HtmlCrosshair.prototype.updateInner = function (cfg) {
        if (util_1.hasKey(cfg, 'text')) {
            this.resetText();
        }
        _super.prototype.updateInner.call(this, cfg);
    };
    return HtmlCrosshair;
}(html_component_1.default));
exports.default = HtmlCrosshair;
//# sourceMappingURL=html.js.map