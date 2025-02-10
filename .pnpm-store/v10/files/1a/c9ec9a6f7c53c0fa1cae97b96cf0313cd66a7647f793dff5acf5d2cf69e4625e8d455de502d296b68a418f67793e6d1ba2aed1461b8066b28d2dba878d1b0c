import { __assign, __extends, __values } from "tslib";
import { each, head, isEqual, last, get, flatten, isArray, uniq, isNil } from '@antv/util';
import { findItemsFromViewRecurisive } from '../../util/tooltip';
import { getAngle, getSectorPath } from '../../util/graphics';
import Action from './base';
var DEFAULT_REGION_PATH_STYLE = {
    fill: '#CCD6EC',
    opacity: 0.3,
};
export function getItemsOfView(view, point, tooltipCfg) {
    var e_1, _a, e_2, _b, e_3, _c;
    var items = findItemsFromViewRecurisive(view, point, tooltipCfg);
    if (items.length) {
        // 三层
        items = flatten(items);
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var itemArr = items_1_1.value;
                try {
                    for (var itemArr_1 = (e_2 = void 0, __values(itemArr)), itemArr_1_1 = itemArr_1.next(); !itemArr_1_1.done; itemArr_1_1 = itemArr_1.next()) {
                        var item = itemArr_1_1.value;
                        var _d = item.mappingData, x = _d.x, y = _d.y;
                        item.x = isArray(x) ? x[x.length - 1] : x;
                        item.y = isArray(y) ? y[y.length - 1] : y;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (itemArr_1_1 && !itemArr_1_1.done && (_b = itemArr_1.return)) _b.call(itemArr_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var shared = tooltipCfg.shared;
        // shared: false 代表只显示当前拾取到的 shape 的数据，但是一个 view 会有多个 Geometry，所以有可能会拾取到多个 shape
        if (shared === false && items.length > 1) {
            var snapItem = items[0];
            var min = Math.abs(point.y - snapItem[0].y);
            try {
                for (var items_2 = __values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                    var aItem = items_2_1.value;
                    var yDistance = Math.abs(point.y - aItem[0].y);
                    if (yDistance <= min) {
                        snapItem = aItem;
                        min = yDistance;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (items_2_1 && !items_2_1.done && (_c = items_2.return)) _c.call(items_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            items = [snapItem];
        }
        return uniq(flatten(items));
    }
    return [];
}
/**
 * 背景框的 Action. 只作用于 interval 和 schema geometry
 * @ignore
 */
var ActiveRegion = /** @class */ (function (_super) {
    __extends(ActiveRegion, _super);
    function ActiveRegion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 显示
     * @param {ShapeAttrs} style region-path 的样式
     * @param {number} appendRatio 适用于笛卡尔坐标系. 对于 x 轴非 linear 类型: 默认：0.25, x 轴 linear 类型: 默认 0
     * @param {number} appendWidth  适用于笛卡尔坐标系. 像素级别，优先级 > appendRatio
     */
    ActiveRegion.prototype.show = function (args) {
        var view = this.context.view;
        var ev = this.context.event;
        var tooltipCfg = view.getController('tooltip').getTooltipCfg();
        var tooltipItems = getItemsOfView(view, {
            x: ev.x,
            y: ev.y,
        }, tooltipCfg);
        if (isEqual(tooltipItems, this.items)) {
            // 如果拾取数据同上次相同，则不重复绘制
            return;
        }
        this.items = tooltipItems;
        if (tooltipItems.length) {
            var xField_1 = view.getXScale().field;
            var xValue_1 = tooltipItems[0].data[xField_1];
            // 根据 x 对应的值查找 elements
            var elements_1 = [];
            var geometries = view.geometries;
            each(geometries, function (geometry) {
                if (geometry.type === 'interval' || geometry.type === 'schema') {
                    var result = geometry.getElementsBy(function (ele) {
                        var eleData = ele.getData();
                        return eleData[xField_1] === xValue_1;
                    });
                    elements_1 = elements_1.concat(result);
                }
            });
            // 根据 bbox 计算背景框的面积区域
            if (elements_1.length) {
                var coordinate_1 = view.getCoordinate();
                var firstBBox_1 = elements_1[0].shape.getCanvasBBox();
                var lastBBox_1 = elements_1[0].shape.getCanvasBBox();
                var groupBBox_1 = firstBBox_1;
                each(elements_1, function (ele) {
                    var bbox = ele.shape.getCanvasBBox();
                    if (coordinate_1.isTransposed) {
                        if (bbox.minY < firstBBox_1.minY) {
                            firstBBox_1 = bbox;
                        }
                        if (bbox.maxY > lastBBox_1.maxY) {
                            lastBBox_1 = bbox;
                        }
                    }
                    else {
                        if (bbox.minX < firstBBox_1.minX) {
                            firstBBox_1 = bbox;
                        }
                        if (bbox.maxX > lastBBox_1.maxX) {
                            lastBBox_1 = bbox;
                        }
                    }
                    groupBBox_1.x = Math.min(bbox.minX, groupBBox_1.minX);
                    groupBBox_1.y = Math.min(bbox.minY, groupBBox_1.minY);
                    groupBBox_1.width = Math.max(bbox.maxX, groupBBox_1.maxX) - groupBBox_1.x;
                    groupBBox_1.height = Math.max(bbox.maxY, groupBBox_1.maxY) - groupBBox_1.y;
                });
                var backgroundGroup = view.backgroundGroup, coordinateBBox = view.coordinateBBox;
                var path = void 0;
                if (coordinate_1.isRect) {
                    var xScale = view.getXScale();
                    var _a = args || {}, appendRatio = _a.appendRatio, appendWidth = _a.appendWidth;
                    if (isNil(appendWidth)) {
                        appendRatio = isNil(appendRatio) ? (xScale.isLinear ? 0 : 0.25) : appendRatio; // 如果 x 轴是数值类型，如直方图，默认不需要加额外的宽度
                        appendWidth = coordinate_1.isTransposed ? appendRatio * lastBBox_1.height : appendRatio * firstBBox_1.width;
                    }
                    var minX = void 0;
                    var minY = void 0;
                    var width = void 0;
                    var height = void 0;
                    if (coordinate_1.isTransposed) {
                        minX = coordinateBBox.minX;
                        minY = Math.min(lastBBox_1.minY, firstBBox_1.minY) - appendWidth;
                        width = coordinateBBox.width;
                        height = groupBBox_1.height + appendWidth * 2;
                    }
                    else {
                        minX = Math.min(firstBBox_1.minX, lastBBox_1.minX) - appendWidth;
                        // 直角坐标系 非转置：最小值直接取 坐标系 minY
                        minY = coordinateBBox.minY;
                        width = groupBBox_1.width + appendWidth * 2;
                        height = coordinateBBox.height;
                    }
                    path = [
                        ['M', minX, minY],
                        ['L', minX + width, minY],
                        ['L', minX + width, minY + height],
                        ['L', minX, minY + height],
                        ['Z'],
                    ];
                }
                else {
                    var firstElement = head(elements_1);
                    var lastElement = last(elements_1);
                    var startAngle = getAngle(firstElement.getModel(), coordinate_1).startAngle;
                    var endAngle = getAngle(lastElement.getModel(), coordinate_1).endAngle;
                    var center = coordinate_1.getCenter();
                    var radius = coordinate_1.getRadius();
                    var innterRadius = coordinate_1.innerRadius * radius;
                    path = getSectorPath(center.x, center.y, radius, startAngle, endAngle, innterRadius);
                }
                if (this.regionPath) {
                    this.regionPath.attr('path', path);
                    this.regionPath.show();
                }
                else {
                    var style = get(args, 'style', DEFAULT_REGION_PATH_STYLE);
                    this.regionPath = backgroundGroup.addShape({
                        type: 'path',
                        name: 'active-region',
                        capture: false,
                        attrs: __assign(__assign({}, style), { path: path }),
                    });
                }
            }
        }
    };
    /**
     * 隐藏
     */
    ActiveRegion.prototype.hide = function () {
        if (this.regionPath) {
            this.regionPath.hide();
        }
        // this.regionPath = null;
        this.items = null;
    };
    /**
     * 销毁
     */
    ActiveRegion.prototype.destroy = function () {
        this.hide();
        if (this.regionPath) {
            this.regionPath.remove(true);
        }
        _super.prototype.destroy.call(this);
    };
    return ActiveRegion;
}(Action));
export default ActiveRegion;
//# sourceMappingURL=active-region.js.map