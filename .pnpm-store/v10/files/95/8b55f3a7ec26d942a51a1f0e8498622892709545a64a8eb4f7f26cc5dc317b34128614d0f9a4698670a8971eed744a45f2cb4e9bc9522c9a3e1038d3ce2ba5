import { __extends } from "tslib";
import { Action, registerAction, registerInteraction } from '@antv/g2';
import { each, get, isArray, map } from '@antv/util';
import { getAllElements, getSiblingViews, getViews } from '../../../utils';
import { clearHighlight, getElementValue } from './utils';
/**
 * 存在多个 view 时，view 之间的联动交互
 *
 * 提供四个反馈 action，均接受参数：linkField 关联字段，dim 维度
 * 1. showTooltip
 * 2. active
 * 3. highlight
 * 4. selected
 *
 * 附加，两个结束反馈 action：
 * 1. hidetooltip
 * 2. reset 清除激活和高亮状态
 */
var Association = /** @class */ (function (_super) {
    __extends(Association, _super);
    function Association() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取关联的 elements
     *
     * - 如果 dim 参数存在，根据 dim 获取相应的 field。与 linkField 不匹配则 return
     * - 否则 dim 参数不存在，且 linkField 存在，则作为关联字段
     * - 否则若 linkField 不存在，则获取第一个分类字段
     * @returns EventItem[]
     */
    Association.prototype.getAssociationItems = function (views, params) {
        var _a;
        var event = this.context.event;
        var _b = params || {}, linkField = _b.linkField, dim = _b.dim;
        var items = [];
        if ((_a = event.data) === null || _a === void 0 ? void 0 : _a.data) {
            var data_1 = event.data.data;
            each(views, function (v) {
                var _a, _b;
                var field = linkField;
                if (dim === 'x') {
                    field = v.getXScale().field;
                }
                else if (dim === 'y') {
                    field = (_a = v.getYScales().find(function (s) { return s.field === field; })) === null || _a === void 0 ? void 0 : _a.field;
                }
                else if (!field) {
                    field = (_b = v.getGroupScales()[0]) === null || _b === void 0 ? void 0 : _b.field;
                }
                if (!field) {
                    return;
                }
                var elements = map(getAllElements(v), function (ele) {
                    var active = false;
                    var inactive = false;
                    var dataValue = isArray(data_1) ? get(data_1[0], field) : get(data_1, field);
                    if (getElementValue(ele, field) === dataValue) {
                        active = true;
                    }
                    else {
                        inactive = true;
                    }
                    return { element: ele, view: v, active: active, inactive: inactive };
                });
                items.push.apply(items, elements);
            });
        }
        return items;
    };
    /**
     * 所有同一层级的 tooltip 显示
     */
    Association.prototype.showTooltip = function (params) {
        var siblings = getSiblingViews(this.context.view);
        var elements = this.getAssociationItems(siblings, params);
        each(elements, function (ele) {
            if (ele.active) {
                var box = ele.element.shape.getCanvasBBox();
                ele.view.showTooltip({ x: box.minX + box.width / 2, y: box.minY + box.height / 2 });
            }
        });
    };
    /**
     * 隐藏同一层级的 tooltip
     */
    Association.prototype.hideTooltip = function () {
        var siblings = getSiblingViews(this.context.view);
        each(siblings, function (sibling) {
            sibling.hideTooltip();
        });
    };
    /**
     * 设置 active 状态
     */
    Association.prototype.active = function (params) {
        var views = getViews(this.context.view);
        var items = this.getAssociationItems(views, params);
        each(items, function (item) {
            var active = item.active, element = item.element;
            if (active) {
                element.setState('active', true);
            }
        });
    };
    /**
     * 设置 selected 状态
     */
    Association.prototype.selected = function (params) {
        var views = getViews(this.context.view);
        var items = this.getAssociationItems(views, params);
        each(items, function (item) {
            var active = item.active, element = item.element;
            if (active) {
                element.setState('selected', true);
            }
        });
    };
    /**
     * 进行高亮 => 设置 inactive 状态
     */
    Association.prototype.highlight = function (params) {
        var views = getViews(this.context.view);
        var items = this.getAssociationItems(views, params);
        each(items, function (item) {
            var inactive = item.inactive, element = item.element;
            if (inactive) {
                element.setState('inactive', true);
            }
        });
    };
    Association.prototype.reset = function () {
        var views = getViews(this.context.view);
        each(views, function (v) {
            clearHighlight(v);
        });
    };
    return Association;
}(Action));
registerAction('association', Association);
/**
 * 相邻 view 的 active 联动（相同维值的 tooltip 联动）
 */
registerInteraction('association-active', {
    start: [{ trigger: 'element:mouseenter', action: 'association:active' }],
    end: [{ trigger: 'element:mouseleave', action: 'association:reset' }],
});
/**
 * 相邻 view 的 active 联动（相同维值的 tooltip 联动）
 */
registerInteraction('association-selected', {
    start: [{ trigger: 'element:mouseenter', action: 'association:selected' }],
    end: [{ trigger: 'element:mouseleave', action: 'association:reset' }],
});
/**
 * 相邻 view 的 highlight 联动, 突出当前 element
 */
registerInteraction('association-highlight', {
    start: [{ trigger: 'element:mouseenter', action: 'association:highlight' }],
    end: [{ trigger: 'element:mouseleave', action: 'association:reset' }],
});
/**
 * 相邻 view 的 tooltip 联动，根据 groupField 进行关联（相同维值的 tooltip 联动）
 */
registerInteraction('association-tooltip', {
    start: [{ trigger: 'element:mousemove', action: 'association:showTooltip' }],
    end: [{ trigger: 'element:mouseleave', action: 'association:hideTooltip' }],
});
//# sourceMappingURL=association.js.map