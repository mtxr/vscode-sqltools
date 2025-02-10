import { __assign, __extends } from "tslib";
import Action from '../base';
import { getCurrentElement, getElementValue, getElementsByField } from '../util';
import { deepMix, each, isFunction } from '@antv/util';
/**
 * Link Elements by color
 *
 * public 方法是对外可用的反馈交互。使用方式，如：element-link-by-color:link, element-link-by-color:unlink, element-link-by-color:clear
 */
var LinkByColor = /** @class */ (function (_super) {
    __extends(LinkByColor, _super);
    function LinkByColor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cache = {};
        return _this;
    }
    // 获取颜色对应的 scale
    LinkByColor.prototype.getColorScale = function (view, element) {
        var colorAttr = element.geometry.getAttribute('color');
        if (!colorAttr) {
            return null;
        }
        var scale = view.getScaleByField(colorAttr.getFields()[0]);
        return scale;
    };
    // 获取连接的 path
    LinkByColor.prototype.getLinkPath = function (element, nextElement) {
        var view = this.context.view;
        var isTransposed = view.getCoordinate().isTransposed;
        var bbox = element.shape.getCanvasBBox();
        var nextBBox = nextElement.shape.getCanvasBBox();
        var path = isTransposed
            ? [
                ['M', bbox.minX, bbox.minY],
                ['L', nextBBox.minX, nextBBox.maxY],
                ['L', nextBBox.maxX, nextBBox.maxY],
                ['L', bbox.maxX, bbox.minY],
                ['Z'],
            ]
            : [
                ['M', bbox.maxX, bbox.minY],
                ['L', nextBBox.minX, nextBBox.minY],
                ['L', nextBBox.minX, nextBBox.maxY],
                ['L', bbox.maxX, bbox.maxY],
                ['Z'],
            ];
        return path;
    };
    // 添加连接的图形
    LinkByColor.prototype.addLinkShape = function (group, element, nextElement, activeStyle) {
        var style = {
            opacity: 0.4,
            fill: element.shape.attr('fill'),
        };
        group.addShape({
            type: 'path',
            attrs: __assign(__assign({}, deepMix({}, style, isFunction(activeStyle) ? activeStyle(style, element) : activeStyle)), { path: this.getLinkPath(element, nextElement) }),
        });
    };
    // 使用图形连接
    LinkByColor.prototype.linkByElement = function (element, activeStyle) {
        var _this = this;
        var view = this.context.view;
        var scale = this.getColorScale(view, element);
        if (!scale) {
            return;
        }
        var value = getElementValue(element, scale.field);
        if (!this.cache[value]) {
            var elements_1 = getElementsByField(view, scale.field, value);
            var linkGroup = this.linkGroup;
            var group_1 = linkGroup.addGroup();
            this.cache[value] = group_1; // 缓存
            var count_1 = elements_1.length;
            each(elements_1, function (el, index) {
                if (index < count_1 - 1) {
                    var nextEl = elements_1[index + 1];
                    _this.addLinkShape(group_1, el, nextEl, activeStyle);
                }
            });
        }
    };
    // 移除连接
    LinkByColor.prototype.removeLink = function (element) {
        var scale = this.getColorScale(this.context.view, element);
        if (!scale) {
            return;
        }
        var value = getElementValue(element, scale.field);
        if (this.cache[value]) {
            this.cache[value].remove();
            this.cache[value] = null;
        }
    };
    /**
     * 连接 elements
     *
     * @usage
     * registerInteraction('xxx', {
     *   start: [
     *    {
     *      trigger: 'interval:mouseenter',
     *      action: 'element-link-by-color:link',
     *      arg: {
     *        // style: { fill: 'red' }
     *        style: (style, element) => ({ fill: 'red' })
     *     },
     *   },
     *  ],
     * });
     */
    LinkByColor.prototype.link = function (args) {
        var context = this.context;
        if (!this.linkGroup) {
            // 不允许被拾取
            this.linkGroup = context.view.foregroundGroup.addGroup({
                id: 'link-by-color-group',
                capture: false,
            });
        }
        var element = getCurrentElement(context);
        if (element) {
            this.linkByElement(element, args === null || args === void 0 ? void 0 : args.style);
        }
    };
    /**
     * 取消连接 elements
     */
    LinkByColor.prototype.unlink = function () {
        var element = getCurrentElement(this.context);
        if (element) {
            this.removeLink(element);
        }
    };
    /**
     * 清除所有连接
     */
    LinkByColor.prototype.clear = function () {
        if (this.linkGroup) {
            this.linkGroup.clear();
        }
        this.cache = {};
    };
    /**
     * 销毁
     */
    LinkByColor.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.linkGroup) {
            this.linkGroup.remove();
        }
    };
    return LinkByColor;
}(Action));
export default LinkByColor;
//# sourceMappingURL=link-by-color.js.map