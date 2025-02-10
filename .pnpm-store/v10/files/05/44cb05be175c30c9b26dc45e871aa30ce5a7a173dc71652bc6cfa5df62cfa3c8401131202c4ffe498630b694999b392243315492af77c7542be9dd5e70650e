import { __assign, __extends, __read } from "tslib";
import { deepMix, each, filter, get } from '@antv/util';
import { DIRECTION } from '../constant';
import { getFactTitleConfig } from '../util/facet';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.getDefaultCfg = function () {
        return deepMix({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'list',
            cols: null,
            showTitle: true,
            title: _super.prototype.getDefaultTitleCfg.call(this),
        });
    };
    List.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    List.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    List.prototype.beforeEachView = function (view, facet) { };
    List.prototype.generateFacets = function (data) {
        var _this = this;
        var fields = this.cfg.fields;
        var cols = this.cfg.cols;
        var _a = __read(fields, 1), columnField = _a[0];
        if (!columnField) {
            throw new Error('No `fields` specified!');
        }
        var colValues = this.getFieldValues(data, columnField);
        var count = colValues.length;
        cols = cols || count; // 每行有几列数据
        // 总共有几行
        var rows = this.getPageCount(count, cols);
        var rst = [];
        colValues.forEach(function (val, index) {
            // 当前 index 在那个行列
            var _a = _this.getRowCol(index, cols), row = _a.row, col = _a.col;
            var conditions = [{ field: columnField, value: val, values: colValues }];
            var facetData = filter(data, _this.getFacetDataFilter(conditions));
            var facet = {
                type: _this.cfg.type,
                data: facetData,
                region: _this.getRegion(rows, cols, col, row),
                columnValue: val,
                rowValue: val,
                columnField: columnField,
                rowField: null,
                columnIndex: col,
                rowIndex: row,
                columnValuesLength: cols,
                rowValuesLength: rows,
                total: count,
            };
            rst.push(facet);
        });
        return rst;
    };
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    List.prototype.getXAxisOption = function (x, axes, option, facet) {
        // 当是最后一行或者下面没有 view 时文本不显示
        if (facet.rowIndex !== facet.rowValuesLength - 1 &&
            facet.columnValuesLength * facet.rowIndex + facet.columnIndex + 1 + facet.columnValuesLength <= facet.total) {
            return __assign(__assign({}, option), { label: null, title: null });
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
    List.prototype.getYAxisOption = function (y, axes, option, facet) {
        if (facet.columnIndex !== 0) {
            return __assign(__assign({}, option), { title: null, label: null });
        }
        return option;
    };
    /**
     * facet title
     */
    List.prototype.renderTitle = function () {
        var _this = this;
        each(this.facets, function (facet) {
            var columnValue = facet.columnValue, view = facet.view;
            var formatter = get(_this.cfg.title, 'formatter');
            var config = deepMix({
                position: ['50%', '0%'],
                content: formatter ? formatter(columnValue) : columnValue,
            }, getFactTitleConfig(DIRECTION.TOP), _this.cfg.title);
            view.annotation().text(config);
        });
    };
    /**
     * 计算分页数
     * @param total
     * @param pageSize
     */
    List.prototype.getPageCount = function (total, pageSize) {
        return Math.floor((total + pageSize - 1) / pageSize);
    };
    /**
     * 索引值在哪一页
     * @param index
     * @param pageSize
     */
    List.prototype.getRowCol = function (index, pageSize) {
        var row = Math.floor(index / pageSize);
        var col = index % pageSize;
        return { row: row, col: col };
    };
    return List;
}(Facet));
export default List;
//# sourceMappingURL=list.js.map