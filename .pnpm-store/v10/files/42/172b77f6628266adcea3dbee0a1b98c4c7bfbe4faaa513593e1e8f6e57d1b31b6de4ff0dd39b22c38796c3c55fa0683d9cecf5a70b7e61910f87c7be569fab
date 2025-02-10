import { __assign, __extends } from "tslib";
import { createDom, getOuterHeight, getOuterWidth, modifyCSS } from '@antv/dom-util';
import { isElement, isFunction, isNumber, isString } from '@antv/util';
import HtmlComponent from '../abstract/html-component';
import { clearDom } from '../util/util';
var HtmlAnnotation = /** @class */ (function (_super) {
    __extends(HtmlAnnotation, _super);
    function HtmlAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'annotation', type: 'html', locationType: 'point', x: 0, y: 0, containerTpl: "<div class=\"g2-html-annotation\" style=\"position:absolute\"></div>", alignX: 'left', alignY: 'top', html: '', zIndex: 7 });
    };
    HtmlAnnotation.prototype.render = function () {
        var container = this.getContainer();
        var html = this.get('html');
        clearDom(container);
        var rst = isFunction(html) ? html(container) : html;
        if (isElement(rst)) {
            container.appendChild(rst);
        }
        else if (isString(rst) || isNumber(rst)) {
            var dom = createDom("" + rst);
            if (dom) {
                container.appendChild(dom);
            }
        }
        this.resetPosition();
    };
    HtmlAnnotation.prototype.resetPosition = function () {
        var container = this.getContainer();
        var _a = this.getLocation(), x = _a.x, y = _a.y;
        var alignX = this.get('alignX');
        var alignY = this.get('alignY');
        var offsetX = this.get('offsetX');
        var offsetY = this.get('offsetY');
        var domWidth = getOuterWidth(container);
        var domHeight = getOuterHeight(container);
        var position = {
            x: x,
            y: y,
        };
        if (alignX === 'middle') {
            position.x -= Math.round(domWidth / 2);
        }
        else if (alignX === 'right') {
            position.x -= Math.round(domWidth);
        }
        if (alignY === 'middle') {
            position.y -= Math.round(domHeight / 2);
        }
        else if (alignY === 'bottom') {
            position.y -= Math.round(domHeight);
        }
        if (offsetX) {
            position.x += offsetX;
        }
        if (offsetY) {
            position.y += offsetY;
        }
        modifyCSS(container, {
            position: 'absolute',
            left: position.x + "px",
            top: position.y + "px",
            zIndex: this.get('zIndex'),
        });
    };
    return HtmlAnnotation;
}(HtmlComponent));
export default HtmlAnnotation;
//# sourceMappingURL=html.js.map