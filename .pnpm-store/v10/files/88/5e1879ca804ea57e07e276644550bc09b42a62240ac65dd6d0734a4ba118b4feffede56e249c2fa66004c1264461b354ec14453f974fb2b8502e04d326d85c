"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var facet_1 = require("../util/facet");
var facet_2 = require("./facet");
/**
 * @ignore
 * 镜像分面
 */
var Circle = /** @class */ (function (_super) {
    tslib_1.__extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.getDefaultCfg = function () {
        return (0, util_1.deepMix)({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'circle',
            showTitle: true,
            title: _super.prototype.getDefaultTitleCfg.call(this),
        });
    };
    Circle.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    /**
     * 根据总数和当前索引，计算分面的 region
     * @param count
     * @param index
     */
    Circle.prototype.getRegion = function (count, index) {
        var r = 1 / 2; // 画布半径
        // 画布圆心
        var center = { x: 0.5, y: 0.5 };
        // 每隔分面间隔的弧度
        var avgAngle = (Math.PI * 2) / count;
        // 当前分面所在的弧度
        var angle = (-1 * Math.PI) / 2 + avgAngle * index;
        // TODO 没看懂
        var facetR = r / (1 + 1 / Math.sin(avgAngle / 2));
        // 分面的中心点
        var middle = (0, facet_1.getAnglePoint)(center, r - facetR, angle);
        var startAngle = (Math.PI * 5) / 4; // 右上角
        var endAngle = (Math.PI * 1) / 4; // 左下角
        return {
            start: (0, facet_1.getAnglePoint)(middle, facetR, startAngle),
            end: (0, facet_1.getAnglePoint)(middle, facetR, endAngle),
        };
    };
    Circle.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    Circle.prototype.beforeEachView = function (view, facet) { };
    Circle.prototype.generateFacets = function (data) {
        var _this = this;
        var _a = this.cfg, fields = _a.fields, type = _a.type;
        var _b = tslib_1.__read(fields, 1), field = _b[0];
        if (!field) {
            throw new Error('No `fields` specified!');
        }
        var values = this.getFieldValues(data, field);
        var count = values.length;
        var rst = [];
        values.forEach(function (value, index) {
            var conditions = [{ field: field, value: value, values: values }];
            var facetData = (0, util_1.filter)(data, _this.getFacetDataFilter(conditions));
            var facet = {
                type: type,
                data: facetData,
                region: _this.getRegion(count, index),
                columnValue: value,
                columnField: field,
                columnIndex: index,
                columnValuesLength: count,
                rowValue: null,
                rowField: null,
                rowIndex: 0,
                rowValuesLength: 1,
            };
            rst.push(facet);
        });
        return rst;
    };
    Circle.prototype.getXAxisOption = function (x, axes, option, facet) {
        // 不做任何处理
        return option;
    };
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    Circle.prototype.getYAxisOption = function (y, axes, option, facet) {
        // 不做任何处理
        return option;
    };
    /**
     * facet title
     */
    Circle.prototype.renderTitle = function () {
        var _this = this;
        (0, util_1.each)(this.facets, function (facet) {
            var columnValue = facet.columnValue, view = facet.view;
            var formatter = (0, util_1.get)(_this.cfg.title, 'formatter');
            var config = (0, util_1.deepMix)({
                position: ['50%', '0%'],
                content: formatter ? formatter(columnValue) : columnValue,
            }, (0, facet_1.getFactTitleConfig)(constant_1.DIRECTION.TOP), _this.cfg.title);
            view.annotation().text(config);
        });
    };
    return Circle;
}(facet_2.Facet));
exports.default = Circle;
//# sourceMappingURL=circle.js.map