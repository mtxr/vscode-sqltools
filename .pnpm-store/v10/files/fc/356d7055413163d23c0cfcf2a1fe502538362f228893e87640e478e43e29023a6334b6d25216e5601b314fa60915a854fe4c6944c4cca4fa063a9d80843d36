import { __assign, __extends, __read } from "tslib";
import { deepMix, each, filter, get } from '@antv/util';
import { DIRECTION } from '../constant';
import { getFactTitleConfig } from '../util/facet';
import { Facet } from './facet';
/**
 * @ignore
 * 镜像分面
 */
var Mirror = /** @class */ (function (_super) {
    __extends(Mirror, _super);
    function Mirror() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mirror.prototype.getDefaultCfg = function () {
        return deepMix({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'mirror',
            showTitle: true,
            title: _super.prototype.getDefaultTitleCfg.call(this),
            transpose: false,
        });
    };
    Mirror.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    Mirror.prototype.beforeEachView = function (view, facet) {
        // 做一下坐标系转化
        if (this.cfg.transpose) {
            if (facet.columnIndex % 2 === 0) {
                view.coordinate().transpose().reflect('x');
            }
            else {
                view.coordinate().transpose();
            }
        }
        else {
            if (facet.rowIndex % 2 !== 0) {
                view.coordinate().reflect('y');
            }
        }
    };
    Mirror.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    Mirror.prototype.generateFacets = function (data) {
        var _this = this;
        var _a = __read(this.cfg.fields, 1), f = _a[0];
        var rst = [];
        var columnValuesLength = 1;
        var rowValuesLength = 1;
        var columnValues = [''];
        var rowValues = [''];
        var columnField;
        var rowField;
        if (this.cfg.transpose) {
            columnField = f;
            columnValues = this.getFieldValues(data, columnField).slice(0, 2); // 镜像最多两个
            columnValuesLength = columnValues.length;
        }
        else {
            rowField = f;
            rowValues = this.getFieldValues(data, rowField).slice(0, 2); // 镜像最多两个
            rowValuesLength = rowValues.length;
        }
        // 获取每个维度对应的数据配置片段
        columnValues.forEach(function (xVal, xIndex) {
            rowValues.forEach(function (yVal, yIndex) {
                var conditions = [
                    { field: columnField, value: xVal, values: columnValues },
                    { field: rowField, value: yVal, values: rowValues },
                ];
                var facetData = filter(data, _this.getFacetDataFilter(conditions));
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
    /**
     * 设置 x 坐标轴的文本、title 是否显示
     * @param x
     * @param axes
     * @param option
     * @param facet
     */
    Mirror.prototype.getXAxisOption = function (x, axes, option, facet) {
        // 非最后一行
        // 当是最后一行或者下面没有 view 时文本不显示
        if (facet.columnIndex === 1 || facet.rowIndex === 1) {
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
    Mirror.prototype.getYAxisOption = function (y, axes, option, facet) {
        // do nothing
        return option;
    };
    Mirror.prototype.renderTitle = function () {
        var _this = this;
        each(this.facets, function (facet, facetIndex) {
            var columnValue = facet.columnValue, rowValue = facet.rowValue, view = facet.view;
            var formatter = get(_this.cfg.title, 'formatter');
            if (_this.cfg.transpose) {
                var config = deepMix({
                    position: ['50%', '0%'],
                    content: formatter ? formatter(columnValue) : columnValue,
                }, getFactTitleConfig(DIRECTION.TOP), _this.cfg.title);
                view.annotation().text(config);
            }
            else {
                var config = deepMix({
                    position: ['100%', '50%'],
                    content: formatter ? formatter(rowValue) : rowValue,
                }, getFactTitleConfig(DIRECTION.RIGHT), _this.cfg.title);
                view.annotation().text(config);
            }
        });
    };
    return Mirror;
}(Facet));
export default Mirror;
//# sourceMappingURL=mirror.js.map