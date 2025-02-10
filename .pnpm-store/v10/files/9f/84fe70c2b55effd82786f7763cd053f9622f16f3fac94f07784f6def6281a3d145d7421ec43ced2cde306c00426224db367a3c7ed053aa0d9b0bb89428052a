import { __assign, __extends } from "tslib";
import colorUtil from '@antv/color-util';
import { createDom, modifyCSS } from '@antv/dom-util';
import { each, hasKey, isElement, substitute } from '@antv/util';
import HtmlComponent from '../abstract/html-component';
import { clearDom, regionToBBox, toPx } from '../util/util';
import * as CssConst from './css-const';
import TooltipTheme from './html-theme';
import { getAlignPoint } from '../util/align';
function hasOneKey(obj, keys) {
    var result = false;
    each(keys, function (key) {
        if (hasKey(obj, key)) {
            result = true;
            return false;
        }
    });
    return result;
}
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'tooltip', type: 'html', x: 0, y: 0, items: [], customContent: null, containerTpl: "<div class=\"" + CssConst.CONTAINER_CLASS + "\"><div class=\"" + CssConst.TITLE_CLASS + "\"></div><ul class=\"" + CssConst.LIST_CLASS + "\"></ul></div>", itemTpl: "<li class=\"" + CssConst.LIST_ITEM_CLASS + "\" data-index={index}>\n          <span class=\"" + CssConst.MARKER_CLASS + "\" style=\"background:{color}\"></span>\n          <span class=\"" + CssConst.NAME_CLASS + "\">{name}</span>:\n          <span class=\"" + CssConst.VALUE_CLASS + "\">{value}</span>\n        </li>", xCrosshairTpl: "<div class=\"" + CssConst.CROSSHAIR_X + "\"></div>", yCrosshairTpl: "<div class=\"" + CssConst.CROSSHAIR_Y + "\"></div>", title: null, showTitle: true, 
            /**
             * tooltip 限制的区域
             * @type {Region}
             */
            region: null, 
            // crosshair 的限制区域
            crosshairsRegion: null, containerClassName: CssConst.CONTAINER_CLASS, 
            // x, y, xy
            crosshairs: null, offset: 10, position: 'right', domStyles: null, defaultStyles: TooltipTheme });
    };
    // tooltip 渲染时，渲染 title，items 和 corosshairs
    Tooltip.prototype.render = function () {
        if (this.get('customContent')) {
            this.renderCustomContent();
        }
        else {
            this.resetTitle();
            this.renderItems();
        }
        // 绘制完成后，再定位
        this.resetPosition();
    };
    // 复写清空函数，因为有模板的存在，所以默认的写法不合适
    Tooltip.prototype.clear = function () {
        // 由于 crosshair 没有在 container 内，所以需要单独清理
        this.clearCrosshairs();
        this.setTitle(''); // 清空标题
        this.clearItemDoms();
    };
    Tooltip.prototype.show = function () {
        var container = this.getContainer();
        if (!container || this.destroyed) {
            // 防止容器不存在或者被销毁时报错
            return;
        }
        this.set('visible', true);
        modifyCSS(container, {
            visibility: 'visible',
        });
        this.setCrossHairsVisible(true);
    };
    Tooltip.prototype.hide = function () {
        var container = this.getContainer();
        // relative: https://github.com/antvis/g2/issues/1221
        if (!container || this.destroyed) {
            return;
        }
        this.set('visible', false);
        modifyCSS(container, {
            visibility: 'hidden',
        });
        this.setCrossHairsVisible(false);
    };
    // 实现 IPointLocation 的接口
    Tooltip.prototype.getLocation = function () {
        return { x: this.get('x'), y: this.get('y') };
    };
    // 实现 IPointLocation 的接口
    Tooltip.prototype.setLocation = function (point) {
        this.set('x', point.x);
        this.set('y', point.y);
        this.resetPosition();
    };
    Tooltip.prototype.setCrossHairsVisible = function (visible) {
        var display = visible ? '' : 'none';
        var xCrosshairDom = this.get('xCrosshairDom');
        var yCrosshairDom = this.get('yCrosshairDom');
        xCrosshairDom &&
            modifyCSS(xCrosshairDom, {
                display: display,
            });
        yCrosshairDom &&
            modifyCSS(yCrosshairDom, {
                display: display,
            });
    };
    // 如有 customContent 则根据 customContent 设置 container
    Tooltip.prototype.initContainer = function () {
        _super.prototype.initContainer.call(this);
        if (this.get('customContent')) {
            if (this.get('container')) {
                this.get('container').remove();
            }
            var container = this.getHtmlContentNode();
            this.get('parent').appendChild(container);
            this.set('container', container);
            this.resetStyles();
            this.applyStyles();
        }
    };
    // 更新属性的同时，可能会引起 DOM 的变化，这里对可能引起 DOM 变化的场景做了处理
    Tooltip.prototype.updateInner = function (cfg) {
        if (this.get('customContent')) {
            this.renderCustomContent();
        }
        else {
            // 更新标题
            if (hasOneKey(cfg, ['title', 'showTitle'])) {
                this.resetTitle();
            }
            // 更新内容
            if (hasKey(cfg, 'items')) {
                this.renderItems();
            }
        }
        _super.prototype.updateInner.call(this, cfg);
    };
    Tooltip.prototype.initDom = function () {
        this.cacheDoms();
    };
    // 清理 DOM
    Tooltip.prototype.removeDom = function () {
        _super.prototype.removeDom.call(this);
        this.clearCrosshairs();
    };
    // 调整位置
    Tooltip.prototype.resetPosition = function () {
        var x = this.get('x');
        var y = this.get('y');
        var offset = this.get('offset');
        var _a = this.getOffset(), offsetX = _a.offsetX, offsetY = _a.offsetY;
        var position = this.get('position');
        var region = this.get('region');
        var container = this.getContainer();
        var bbox = this.getBBox();
        var width = bbox.width, height = bbox.height;
        var limitBox;
        if (region) {
            // 不限制位置
            limitBox = regionToBBox(region);
        }
        var point = getAlignPoint(x, y, offset, width, height, position, limitBox);
        modifyCSS(container, {
            left: toPx(point.x + offsetX),
            top: toPx(point.y + offsetY),
        });
        this.resetCrosshairs();
    };
    // 根据 customContent 渲染
    Tooltip.prototype.renderCustomContent = function () {
        var node = this.getHtmlContentNode();
        var parent = this.get('parent');
        var curContainer = this.get('container');
        if (curContainer && curContainer.parentNode === parent) {
            parent.replaceChild(node, curContainer);
        }
        else {
            parent.appendChild(node);
        }
        this.set('container', node);
        this.resetStyles();
        this.applyStyles();
    };
    Tooltip.prototype.getHtmlContentNode = function () {
        var node;
        var customContent = this.get('customContent');
        if (customContent) {
            var elem = customContent(this.get('title'), this.get('items'));
            if (isElement(elem)) {
                node = elem;
            }
            else {
                node = createDom(elem);
            }
        }
        return node;
    };
    // 缓存模板设置的各种 DOM
    Tooltip.prototype.cacheDoms = function () {
        var container = this.getContainer();
        var titleDom = container.getElementsByClassName(CssConst.TITLE_CLASS)[0];
        var listDom = container.getElementsByClassName(CssConst.LIST_CLASS)[0];
        this.set('titleDom', titleDom);
        this.set('listDom', listDom);
    };
    // 重置 title
    Tooltip.prototype.resetTitle = function () {
        var title = this.get('title');
        var showTitle = this.get('showTitle');
        if (showTitle && title) {
            this.setTitle(title);
        }
        else {
            this.setTitle('');
        }
    };
    // 设置 title 文本
    Tooltip.prototype.setTitle = function (text) {
        var titleDom = this.get('titleDom');
        if (titleDom) {
            titleDom.innerText = text;
        }
    };
    // 终止 crosshair
    Tooltip.prototype.resetCrosshairs = function () {
        var crosshairsRegion = this.get('crosshairsRegion');
        var crosshairs = this.get('crosshairs');
        if (!crosshairsRegion || !crosshairs) {
            // 不显示 crosshair，都移除，没有设定 region 也都移除掉
            this.clearCrosshairs();
        }
        else {
            var crosshairBox = regionToBBox(crosshairsRegion);
            var xCrosshairDom = this.get('xCrosshairDom');
            var yCrosshairDom = this.get('yCrosshairDom');
            if (crosshairs === 'x') {
                this.resetCrosshair('x', crosshairBox);
                // 仅显示 x 的 crosshair，y 移除
                if (yCrosshairDom) {
                    yCrosshairDom.remove();
                    this.set('yCrosshairDom', null);
                }
            }
            else if (crosshairs === 'y') {
                this.resetCrosshair('y', crosshairBox);
                // 仅显示 y 的 crosshair，x 移除
                if (xCrosshairDom) {
                    xCrosshairDom.remove();
                    this.set('xCrosshairDom', null);
                }
            }
            else {
                this.resetCrosshair('x', crosshairBox);
                this.resetCrosshair('y', crosshairBox);
            }
            this.setCrossHairsVisible(this.get('visible'));
        }
    };
    // 设定 crosshair 的位置，需要区分 x,y
    Tooltip.prototype.resetCrosshair = function (name, bbox) {
        var croshairDom = this.checkCrosshair(name);
        var value = this.get(name);
        if (name === 'x') {
            modifyCSS(croshairDom, {
                left: toPx(value),
                top: toPx(bbox.y),
                height: toPx(bbox.height),
            });
        }
        else {
            modifyCSS(croshairDom, {
                top: toPx(value),
                left: toPx(bbox.x),
                width: toPx(bbox.width),
            });
        }
    };
    // 如果 crosshair 对应的 dom 不存在，则创建
    Tooltip.prototype.checkCrosshair = function (name) {
        var domName = name + "CrosshairDom";
        var tplName = name + "CrosshairTpl";
        var constName = "CROSSHAIR_" + name.toUpperCase();
        var styleName = CssConst[constName];
        var croshairDom = this.get(domName);
        var parent = this.get('parent');
        if (!croshairDom) {
            croshairDom = createDom(this.get(tplName)); // 创建
            this.applyStyle(styleName, croshairDom); // 设置初始样式
            parent.appendChild(croshairDom); // 添加到跟 tooltip 同级的目录下
            this.set(domName, croshairDom);
        }
        return croshairDom;
    };
    Tooltip.prototype.renderItems = function () {
        this.clearItemDoms();
        var items = this.get('items');
        var itemTpl = this.get('itemTpl');
        var listDom = this.get('listDom');
        if (listDom) {
            each(items, function (item) {
                var color = colorUtil.toCSSGradient(item.color);
                var substituteObj = __assign(__assign({}, item), { color: color });
                var domStr = substitute(itemTpl, substituteObj);
                var itemDom = createDom(domStr);
                listDom.appendChild(itemDom);
            });
            this.applyChildrenStyles(listDom, this.get('domStyles'));
        }
    };
    Tooltip.prototype.clearItemDoms = function () {
        if (this.get('listDom')) {
            clearDom(this.get('listDom'));
        }
    };
    Tooltip.prototype.clearCrosshairs = function () {
        var xCrosshairDom = this.get('xCrosshairDom');
        var yCrosshairDom = this.get('yCrosshairDom');
        xCrosshairDom && xCrosshairDom.remove();
        yCrosshairDom && yCrosshairDom.remove();
        this.set('xCrosshairDom', null);
        this.set('yCrosshairDom', null);
    };
    return Tooltip;
}(HtmlComponent));
export default Tooltip;
//# sourceMappingURL=html.js.map