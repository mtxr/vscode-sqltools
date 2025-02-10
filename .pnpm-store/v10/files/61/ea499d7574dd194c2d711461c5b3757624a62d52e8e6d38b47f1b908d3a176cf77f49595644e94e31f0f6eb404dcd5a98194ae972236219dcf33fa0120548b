"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Create By Bruce Too
 * On 2020-02-10
 */
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var facet_1 = require("../util/facet");
var facet_2 = require("./facet");
/**
 * @ignore
 * Tree Facet
 */
var Tree = /** @class */ (function (_super) {
    tslib_1.__extends(Tree, _super);
    function Tree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.afterChartRender = function () {
            if (_this.facets && _this.cfg.line) {
                _this.container.clear();
                _this.drawLines(_this.facets);
            }
        };
        return _this;
    }
    Tree.prototype.afterEachView = function (view, facet) {
        this.processAxis(view, facet);
    };
    Tree.prototype.beforeEachView = function (view, facet) { };
    Tree.prototype.init = function () {
        _super.prototype.init.call(this);
        this.view.on(constant_1.VIEW_LIFE_CIRCLE.AFTER_RENDER, this.afterChartRender);
    };
    Tree.prototype.getDefaultCfg = function () {
        return (0, util_1.deepMix)({}, _super.prototype.getDefaultCfg.call(this), {
            type: 'tree',
            line: {
                style: {
                    lineWidth: 1,
                    stroke: '#ddd',
                },
                smooth: false,
            },
            showTitle: true,
            title: _super.prototype.getDefaultTitleCfg.call(this),
        });
    };
    Tree.prototype.generateFacets = function (data) {
        var fields = this.cfg.fields;
        if (!fields.length) {
            throw new Error('Please specify for the fields for rootFacet!');
        }
        var rst = [];
        var rootFacet = {
            type: this.cfg.type,
            data: data,
            region: null,
            rowValuesLength: this.getRows(),
            columnValuesLength: 1,
            rowIndex: 0,
            columnIndex: 0,
            rowField: '',
            columnField: '',
            rowValue: '',
            columnValue: '',
        };
        rst.push(rootFacet);
        rootFacet.children = this.getChildFacets(data, 1, rst);
        this.setRegion(rst);
        return rst;
    };
    Tree.prototype.setRegion = function (facets) {
        var _this = this;
        this.forceColIndex(facets);
        facets.forEach(function (facet) {
            // @ts-ignore 允许调整
            facet.region = _this.getRegion(facet.rowValuesLength, facet.columnValuesLength, facet.columnIndex, facet.rowIndex);
        });
    };
    Tree.prototype.getRegion = function (rows, cols, xIndex, yIndex) {
        var xWidth = 1 / cols; // x轴方向的每个分面的偏移
        var yWidth = 1 / rows; // y轴方向的每个分面的偏移
        var start = {
            x: xWidth * xIndex,
            y: yWidth * yIndex,
        };
        var end = {
            x: start.x + xWidth,
            y: start.y + (yWidth * 2) / 3, // 预留1/3的空隙，方便添加连接线
        };
        return {
            start: start,
            end: end,
        };
    };
    Tree.prototype.forceColIndex = function (facets) {
        var e_1, _a;
        var _this = this;
        var leafs = [];
        var index = 0;
        facets.forEach(function (facet) {
            if (_this.isLeaf(facet)) {
                leafs.push(facet);
                // @ts-ignore 允许调整
                facet.columnIndex = index;
                index++;
            }
        });
        leafs.forEach(function (facet) {
            // @ts-ignore
            facet.columnValuesLength = leafs.length;
        });
        var maxLevel = this.cfg.fields.length;
        for (var i = maxLevel - 1; i >= 0; i--) {
            var levelFacets = this.getFacetsByLevel(facets, i);
            try {
                // var yIndex = maxLevel - i;
                for (var levelFacets_1 = (e_1 = void 0, tslib_1.__values(levelFacets)), levelFacets_1_1 = levelFacets_1.next(); !levelFacets_1_1.done; levelFacets_1_1 = levelFacets_1.next()) {
                    var facet = levelFacets_1_1.value;
                    if (!this.isLeaf(facet)) {
                        facet.originColIndex = facet.columnIndex;
                        // @ts-ignore
                        facet.columnIndex = this.getRegionIndex(facet.children);
                        // @ts-ignore
                        facet.columnValuesLength = leafs.length;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (levelFacets_1_1 && !levelFacets_1_1.done && (_a = levelFacets_1.return)) _a.call(levelFacets_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    // get facet use level
    Tree.prototype.getFacetsByLevel = function (facets, level) {
        var rst = [];
        facets.forEach(function (facet) {
            if (facet.rowIndex === level) {
                rst.push(facet);
            }
        });
        return rst;
    };
    // if the facet has children , make it's column index in the middle of it's children
    Tree.prototype.getRegionIndex = function (children) {
        var first = children[0];
        var last = children[children.length - 1];
        return (last.columnIndex - first.columnIndex) / 2 + first.columnIndex;
    };
    // is  a leaf without children
    Tree.prototype.isLeaf = function (facet) {
        return !facet.children || !facet.children.length;
    };
    Tree.prototype.getRows = function () {
        return this.cfg.fields.length + 1;
    };
    // get child
    Tree.prototype.getChildFacets = function (data, level, arr) {
        var _this = this;
        // [ 'grade', 'class' ]
        var fields = this.cfg.fields;
        var length = fields.length;
        if (length < level) {
            return;
        }
        var rst = [];
        // get fist level except root node
        var field = fields[level - 1];
        // get field value
        var values = this.getFieldValues(data, field);
        values.forEach(function (value, index) {
            var conditions = [{ field: field, value: value, values: values }];
            var subData = data.filter(_this.getFacetDataFilter(conditions));
            if (subData.length) {
                var facet = {
                    type: _this.cfg.type,
                    data: subData,
                    region: null,
                    columnValue: value,
                    rowValue: '',
                    columnField: field,
                    rowField: '',
                    columnIndex: index,
                    rowValuesLength: _this.getRows(),
                    columnValuesLength: 1,
                    rowIndex: level,
                    children: _this.getChildFacets(subData, level + 1, arr),
                };
                rst.push(facet);
                arr.push(facet);
            }
        });
        return rst;
    };
    Tree.prototype.render = function () {
        _super.prototype.render.call(this);
        if (this.cfg.showTitle) {
            this.renderTitle();
        }
    };
    Tree.prototype.renderTitle = function () {
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
    Tree.prototype.drawLines = function (facets) {
        var _this = this;
        facets.forEach(function (facet) {
            if (!_this.isLeaf(facet)) {
                var children = facet.children;
                _this.addFacetLines(facet, children);
            }
        });
    };
    // add lines with it's children
    Tree.prototype.addFacetLines = function (facet, children) {
        var _this = this;
        var view = facet.view;
        var region = view.coordinateBBox;
        // top, right, bottom, left
        var start = {
            x: region.x + region.width / 2,
            y: region.y + region.height,
        };
        children.forEach(function (subFacet) {
            var subRegion = subFacet.view.coordinateBBox;
            var end = {
                x: subRegion.bl.x + (subRegion.tr.x - subRegion.bl.x) / 2,
                y: subRegion.tr.y,
            };
            var middle1 = {
                x: start.x,
                y: start.y + (end.y - start.y) / 2,
            };
            var middle2 = {
                x: end.x,
                y: middle1.y,
            };
            _this.drawLine([start, middle1, middle2, end]);
        });
    };
    Tree.prototype.getPath = function (points) {
        var path = [];
        var smooth = this.cfg.line.smooth;
        if (smooth) {
            path.push(['M', points[0].x, points[0].y]);
            path.push(['C', points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y]);
        }
        else {
            points.forEach(function (point, index) {
                if (index === 0) {
                    path.push(['M', point.x, point.y]);
                }
                else {
                    path.push(['L', point.x, point.y]);
                }
            });
        }
        return path;
    };
    // draw line width points
    Tree.prototype.drawLine = function (points) {
        var path = this.getPath(points);
        var line = this.cfg.line.style;
        this.container.addShape('path', {
            attrs: (0, util_1.assign)({
                // @ts-ignore
                path: path,
            }, line),
        });
    };
    Tree.prototype.getXAxisOption = function (x, axes, option, facet) {
        if (facet.rowIndex !== facet.rowValuesLength - 1) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null, label: null });
        }
        return option;
    };
    Tree.prototype.getYAxisOption = function (y, axes, option, facet) {
        if (facet.originColIndex !== 0 && facet.columnIndex !== 0) {
            return tslib_1.__assign(tslib_1.__assign({}, option), { title: null, label: null });
        }
        return option;
    };
    return Tree;
}(facet_2.Facet));
exports.default = Tree;
//# sourceMappingURL=tree.js.map