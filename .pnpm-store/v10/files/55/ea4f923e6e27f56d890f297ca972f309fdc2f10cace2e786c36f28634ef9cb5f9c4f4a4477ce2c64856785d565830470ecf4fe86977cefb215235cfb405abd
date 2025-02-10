import { __assign, __extends } from "tslib";
import { createDom, modifyCSS } from '@antv/dom-util';
import { isNil, isString, deepMix, each, hasKey } from '@antv/util';
import { clearDom, createBBox, hasClass } from '../util/util';
import Component from './component';
var HtmlComponent = /** @class */ (function (_super) {
    __extends(HtmlComponent, _super);
    function HtmlComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HtmlComponent.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { container: null, containerTpl: '<div></div>', updateAutoRender: true, containerClassName: '', parent: null });
    };
    HtmlComponent.prototype.getContainer = function () {
        return this.get('container');
    };
    /**
     * 显示组件
     */
    HtmlComponent.prototype.show = function () {
        var container = this.get('container');
        container.style.display = '';
        this.set('visible', true);
    };
    /**
     * 隐藏组件
     */
    HtmlComponent.prototype.hide = function () {
        var container = this.get('container');
        container.style.display = 'none';
        this.set('visible', false);
    };
    /**
     * 是否允许捕捉事件
     * @param capture 事件捕捉
     */
    HtmlComponent.prototype.setCapture = function (capture) {
        var container = this.getContainer();
        var value = capture ? 'auto' : 'none';
        container.style.pointerEvents = value;
        this.set('capture', capture);
    };
    HtmlComponent.prototype.getBBox = function () {
        var container = this.getContainer();
        var x = parseFloat(container.style.left) || 0;
        var y = parseFloat(container.style.top) || 0;
        return createBBox(x, y, container.clientWidth, container.clientHeight);
    };
    HtmlComponent.prototype.clear = function () {
        var container = this.get('container');
        clearDom(container);
    };
    HtmlComponent.prototype.destroy = function () {
        this.removeEvent();
        this.removeDom();
        _super.prototype.destroy.call(this);
    };
    /**
     * 复写 init，主要是初始化 DOM 和事件
     */
    HtmlComponent.prototype.init = function () {
        _super.prototype.init.call(this);
        this.initContainer();
        this.initDom();
        this.resetStyles(); // 初始化样式
        this.applyStyles(); // 应用样式
        this.initEvent();
        this.initCapture();
        this.initVisible();
    };
    HtmlComponent.prototype.initCapture = function () {
        this.setCapture(this.get('capture'));
    };
    HtmlComponent.prototype.initVisible = function () {
        if (!this.get('visible')) {
            // 设置初始显示状态
            this.hide();
        }
        else {
            this.show();
        }
    };
    HtmlComponent.prototype.initDom = function () {
    };
    HtmlComponent.prototype.initContainer = function () {
        var container = this.get('container');
        if (isNil(container)) {
            // 未指定 container 则创建
            container = this.createDom();
            var parent_1 = this.get('parent');
            if (isString(parent_1)) {
                parent_1 = document.getElementById(parent_1);
                this.set('parent', parent_1);
            }
            parent_1.appendChild(container);
            if (this.get('containerId')) {
                container.setAttribute('id', this.get('containerId'));
            }
            this.set('container', container);
        }
        else if (isString(container)) {
            // 用户传入的 id, 作为 container
            container = document.getElementById(container);
            this.set('container', container);
        } // else container 是 DOM
        if (!this.get('parent')) {
            this.set('parent', container.parentNode);
        }
    };
    // 样式需要进行合并，不能单纯的替换，否则使用非常不方便
    HtmlComponent.prototype.resetStyles = function () {
        var style = this.get('domStyles');
        var defaultStyles = this.get('defaultStyles');
        if (!style) {
            style = defaultStyles;
        }
        else {
            style = deepMix({}, defaultStyles, style);
        }
        this.set('domStyles', style);
    };
    // 应用所有的样式
    HtmlComponent.prototype.applyStyles = function () {
        var domStyles = this.get('domStyles');
        if (!domStyles) {
            return;
        }
        var container = this.getContainer();
        this.applyChildrenStyles(container, domStyles);
        var containerClassName = this.get('containerClassName');
        if (containerClassName && hasClass(container, containerClassName)) {
            var containerCss = domStyles[containerClassName];
            modifyCSS(container, containerCss);
        }
    };
    HtmlComponent.prototype.applyChildrenStyles = function (element, styles) {
        each(styles, function (style, name) {
            var elements = element.getElementsByClassName(name);
            each(elements, function (el) {
                modifyCSS(el, style);
            });
        });
    };
    // 应用到单个 DOM
    HtmlComponent.prototype.applyStyle = function (cssName, dom) {
        var domStyles = this.get('domStyles');
        modifyCSS(dom, domStyles[cssName]);
    };
    /**
     * @protected
     */
    HtmlComponent.prototype.createDom = function () {
        var containerTpl = this.get('containerTpl');
        return createDom(containerTpl);
    };
    /**
     * @protected
     * 初始化事件
     */
    HtmlComponent.prototype.initEvent = function () { };
    /**
     * @protected
     * 清理 DOM
     */
    HtmlComponent.prototype.removeDom = function () {
        var container = this.get('container');
        // 节点不一定有parentNode
        container && container.parentNode && container.parentNode.removeChild(container);
    };
    /**
     * @protected
     * 清理事件
     */
    HtmlComponent.prototype.removeEvent = function () { };
    HtmlComponent.prototype.updateInner = function (cfg) {
        // 更新样式
        if (hasKey(cfg, 'domStyles')) {
            this.resetStyles();
            this.applyStyles();
        }
        // 只要属性发生变化，都调整一些位置
        this.resetPosition();
    };
    HtmlComponent.prototype.resetPosition = function () { };
    ;
    return HtmlComponent;
}(Component));
export default HtmlComponent;
//# sourceMappingURL=html-component.js.map