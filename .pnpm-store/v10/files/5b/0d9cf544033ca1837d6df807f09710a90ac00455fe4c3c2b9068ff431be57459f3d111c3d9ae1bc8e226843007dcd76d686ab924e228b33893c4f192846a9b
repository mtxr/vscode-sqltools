"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_util_1 = require("@antv/dom-util");
var util_1 = require("@antv/util");
var html_component_1 = require("../abstract/html-component");
var util_2 = require("../util/util");
var HtmlAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(HtmlAnnotation, _super);
    function HtmlAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlAnnotation.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'annotation', type: 'html', locationType: 'point', x: 0, y: 0, containerTpl: "<div class=\"g2-html-annotation\" style=\"position:absolute\"></div>", alignX: 'left', alignY: 'top', html: '', zIndex: 7 });
    };
    HtmlAnnotation.prototype.render = function () {
        var container = this.getContainer();
        var html = this.get('html');
        util_2.clearDom(container);
        var rst = util_1.isFunction(html) ? html(container) : html;
        if (util_1.isElement(rst)) {
            container.appendChild(rst);
        }
        else if (util_1.isString(rst) || util_1.isNumber(rst)) {
            var dom = dom_util_1.createDom("" + rst);
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
        var domWidth = dom_util_1.getOuterWidth(container);
        var domHeight = dom_util_1.getOuterHeight(container);
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
        dom_util_1.modifyCSS(container, {
            position: 'absolute',
            left: position.x + "px",
            top: position.y + "px",
            zIndex: this.get('zIndex'),
        });
    };
    return HtmlAnnotation;
}(html_component_1.default));
exports.default = HtmlAnnotation;
//# sourceMappingURL=html.js.map