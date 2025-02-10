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
var Matrix = /** @class */ (function (_super) {
    tslib_1.__extends(Matrix, _super);
    function Matrix() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Matrix.prototype.getDefaultCfg = function () {
        return (0, util_1.deepMix)({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'matrix',
            showTitle: false,
            columnTitle: tslib_1.__assign({}, _super.prototype.getDefaultTitleCfg.call(this)),
            rowTitle: tslib_1.__assign({}, _super.prototype.getDefaultTitleCfg.call(this)),
        });
    };
    Matrix.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    Matrix.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    Matrix.prototype.beforeEachView = function (view, facet) { };
    Matrix.prototype.generateFacets = function (data) {
        var _a = this.cfg, fields = _a.fields, type = _a.type;
        // 矩阵中行列相等，等于指定的字段个数
        var rowValuesLength = fields.length;
        var columnValuesLength = rowValuesLength;
        var rst = [];
        for (var i = 0; i < columnValuesLength; i++) {
            var columnField = fields[i];
            for (var j = 0; j < rowValuesLength; j++) {
                var rowField = fields[j];
                var facet = {
                    type: type,
                    data: data,
                    region: this.getRegion(rowValuesLength, columnValuesLength, i, j),
                    columnValue: columnField,
                    rowValue: rowField,
                    columnField: columnField,
                    rowField: rowField,
                    columnIndex: i,
                    rowIndex: j,
                    columnValuesLength: columnValuesLength,
                    rowValuesLength: rowValuesLength,
                };
                rst.push(facet);
            }
        }
        return rst;
    };
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    Matrix.prototype.getXAxisOption = function (x, axes, option, facet) {
        // 最后一行显示
        if (facet.rowIndex !== facet.rowValuesLength - 1) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { label: null, title: null });
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
    Matrix.prototype.getYAxisOption = function (y, axes, option, facet) {
        // 第一列显示
        if (facet.columnIndex !== 0) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null, label: null });
        }
        return option;
    };
    /**
     * facet title
     */
    Matrix.prototype.renderTitle = function () {
        var _this = this;
        (0, util_1.each)(this.facets, function (facet, facetIndex) {
            var columnIndex = facet.columnIndex, rowIndex = facet.rowIndex, columnValuesLength = facet.columnValuesLength, rowValuesLength = facet.rowValuesLength, columnValue = facet.columnValue, rowValue = facet.rowValue, view = facet.view;
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
    return Matrix;
}(facet_2.Facet));
exports.default = Matrix;
//# sourceMappingURL=matrix.js.map