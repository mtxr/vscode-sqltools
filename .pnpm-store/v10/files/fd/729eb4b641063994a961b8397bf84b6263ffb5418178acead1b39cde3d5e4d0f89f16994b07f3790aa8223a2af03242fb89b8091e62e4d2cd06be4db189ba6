"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var facet_1 = require("../util/facet");
var facet_2 = require("./facet");
/**
 * @ignore
 * 矩阵分面
 */
var Rect = /** @class */ (function (_super) {
    tslib_1.__extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    Rect.prototype.beforeEachView = function (view, facet) {
        // do nothing
    };
    Rect.prototype.getDefaultCfg = function () {
        return (0, util_1.deepMix)({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'rect',
            columnTitle: tslib_1.__assign({}, _super.prototype.getDefaultTitleCfg.call(this)),
            rowTitle: tslib_1.__assign({}, _super.prototype.getDefaultTitleCfg.call(this)),
        });
    };
    Rect.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    /**
     * 生成矩阵分面的分面数据
     * @param data
     */
    Rect.prototype.generateFacets = function (data) {
        var _this = this;
        var _a = tslib_1.__read(this.cfg.fields, 2), columnField = _a[0], rowField = _a[1];
        var rst = [];
        var columnValuesLength = 1;
        var rowValuesLength = 1;
        var columnValues = [''];
        var rowValues = [''];
        if (columnField) {
            columnValues = this.getFieldValues(data, columnField);
            columnValuesLength = columnValues.length;
        }
        if (rowField) {
            rowValues = this.getFieldValues(data, rowField);
            rowValuesLength = rowValues.length;
        }
        // 获取每个维度对应的数据配置片段
        columnValues.forEach(function (xVal, xIndex) {
            rowValues.forEach(function (yVal, yIndex) {
                var conditions = [
                    { field: columnField, value: xVal, values: columnValues },
                    { field: rowField, value: yVal, values: rowValues },
                ];
                var facetData = (0, util_1.filter)(data, _this.getFacetDataFilter(conditions));
                var facet = {
                    type: _this.cfg.type,
                    data: facetData,
                    region: _this.getRegion(rowValuesLength, columnValuesLength, xIndex, yIndex),
                    columnValue: xVal,
                    rowValue: yVal,
                    columnField: columnField,
                    rowField: rowField,
                    columnIndex: xIndex,
                    rowIndex: yIndex,
                    columnValuesLength: columnValuesLength,
                    rowValuesLength: rowValuesLength,
                };
                rst.push(facet);
            });
        });
        return rst;
    };
    Rect.prototype.renderTitle = function () {
        var _this = this;
        (0, util_1.each)(this.facets, function (facet, facetIndex) {
            var columnIndex = facet.columnIndex, rowIndex = facet.rowIndex, columnValuesLength = facet.columnValuesLength, columnValue = facet.columnValue, rowValue = facet.rowValue, view = facet.view;
            // top
            if (rowIndex === 0) {
                var formatter = (0, util_1.get)(_this.cfg.columnTitle, 'formatter');
                var config = (0, util_1.deepMix)({
                    position: ['50%', '0%'],
                    content: formatter ? formatter(columnValue) : columnValue,
                }, (0, facet_1.getFactTitleConfig)(constant_1.DIRECTION.TOP), _this.cfg.columnTitle);
                view.annotation().text(config);
            }
            // right
            if (columnIndex === columnValuesLength - 1) {
                var formatter = (0, util_1.get)(_this.cfg.rowTitle, 'formatter');
                var config = (0, util_1.deepMix)({
                    position: ['100%', '50%'],
                    content: formatter ? formatter(rowValue) : rowValue,
                }, (0, facet_1.getFactTitleConfig)(constant_1.DIRECTION.RIGHT), _this.cfg.rowTitle);
                view.annotation().text(config);
            }
        });
    };
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    Rect.prototype.getXAxisOption = function (x, axes, option, facet) {
        // 非最后一行
        if (facet.rowIndex !== facet.rowValuesLength - 1) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null, label: null });
        }
        else if (facet.columnIndex !== Math.floor((facet.columnValuesLength - 1) / 2)) {
            // 不是中间列
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null });
        }
        return option;
    };
    /**
     * 设置 y 坐标轴的文本、title 是否显示
     * @param y
     * @param axes
     * @param option
     * @param facet
     */
    Rect.prototype.getYAxisOption = function (y, axes, option, facet) {
        if (facet.columnIndex !== 0) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null, label: null });
        }
        else if (facet.rowIndex !== Math.floor((facet.rowValuesLength - 1) / 2)) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null });
        }
        return option;
    };
    return Rect;
}(facet_2.Facet));
exports.default = Rect;
//# sourceMappingURL=rect.js.map