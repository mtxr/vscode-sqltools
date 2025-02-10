"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var group_component_1 = require("../abstract/group-component");
var theme_1 = require("../util/theme");
var GridBase = /** @class */ (function (_super) {
    tslib_1.__extends(GridBase, _super);
    function GridBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridBase.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { name: 'grid', line: {}, alternateColor: null, capture: false, items: [], closed: false, defaultCfg: {
                line: {
                    type: 'line',
                    style: {
                        lineWidth: 1,
                        stroke: theme_1.default.lineColor,
                    },
                },
            } });
    };
    /**
     * 获取栅格线的类型
     * @return {string} 栅格线类型
     */
    GridBase.prototype.getLineType = function () {
        var line = this.get('line') || this.get('defaultCfg').line;
        return line.type;
    };
    GridBase.prototype.renderInner = function (group) {
        this.drawGrid(group);
    };
    GridBase.prototype.getAlternatePath = function (prePoints, points) {
        var regionPath = this.getGridPath(prePoints);
        var reversePoints = points.slice(0).reverse();
        var nextPath = this.getGridPath(reversePoints, true);
        var closed = this.get('closed');
        if (closed) {
            regionPath = regionPath.concat(nextPath);
        }
        else {
            nextPath[0][0] = 'L'; // 更新第一个节点
            regionPath = regionPath.concat(nextPath);
            regionPath.push(['Z']);
        }
        return regionPath;
    };
    // 获取路径的配置项
    GridBase.prototype.getPathStyle = function () {
        return this.get('line').style;
    };
    // 绘制栅格
    GridBase.prototype.drawGrid = function (group) {
        var _this = this;
        var line = this.get('line');
        var items = this.get('items');
        var alternateColor = this.get('alternateColor');
        var preItem = null;
        util_1.each(items, function (item, index) {
            var id = item.id || index;
            // 绘制栅格线
            if (line) {
                var style = _this.getPathStyle();
                style = util_1.isFunction(style) ? style(item, index, items) : style;
                var lineId = _this.getElementId("line-" + id);
                var gridPath = _this.getGridPath(item.points);
                _this.addShape(group, {
                    type: 'path',
                    name: 'grid-line',
                    id: lineId,
                    attrs: util_1.mix({
                        path: gridPath,
                    }, style),
                });
            }
            // 如果存在 alternateColor 则绘制矩形
            // 从第二个栅格线开始绘制
            if (alternateColor && index > 0) {
                var regionId = _this.getElementId("region-" + id);
                var isEven = index % 2 === 0;
                if (util_1.isString(alternateColor)) {
                    // 如果颜色是单值，则是仅绘制偶数时的区域
                    if (isEven) {
                        _this.drawAlternateRegion(regionId, group, preItem.points, item.points, alternateColor);
                    }
                }
                else {
                    var color = isEven ? alternateColor[1] : alternateColor[0];
                    _this.drawAlternateRegion(regionId, group, preItem.points, item.points, color);
                }
            }
            preItem = item;
        });
    };
    // 绘制栅格线间的间隔
    GridBase.prototype.drawAlternateRegion = function (id, group, prePoints, points, color) {
        var regionPath = this.getAlternatePath(prePoints, points);
        this.addShape(group, {
            type: 'path',
            id: id,
            name: 'grid-region',
            attrs: {
                path: regionPath,
                fill: color,
            },
        });
    };
    return GridBase;
}(group_component_1.default));
exports.default = GridBase;
//# sourceMappingURL=base.js.map