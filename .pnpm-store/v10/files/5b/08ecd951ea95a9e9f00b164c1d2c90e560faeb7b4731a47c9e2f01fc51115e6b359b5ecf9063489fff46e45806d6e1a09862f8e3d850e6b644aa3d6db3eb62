import { __assign, __extends, __rest } from "tslib";
import { clamp, deepMix, each, filter, get, mix, isNumber, isFunction } from '@antv/util';
import { ellipsisLabel } from '../util/label';
import { getMatrixByAngle, getMatrixByTranslate } from '../util/matrix';
import { getStatesStyle } from '../util/state';
import Theme from '../util/theme';
import LegendBase from './base';
/**
 * 分页器 默认配置
 */
var DEFAULT_PAGE_NAVIGATOR = {
    marker: {
        style: {
            inactiveFill: '#000',
            inactiveOpacity: 0.45,
            fill: '#000',
            opacity: 1,
            size: 12,
        },
    },
    text: {
        style: {
            fill: '#ccc',
            fontSize: 12,
        },
    },
};
// 默认 文本style
var textStyle = {
    fill: Theme.textColor,
    fontSize: 12,
    textAlign: 'start',
    textBaseline: 'middle',
    fontFamily: Theme.fontFamily,
    fontWeight: 'normal',
    lineHeight: 12,
};
var RIGHT_ARROW_NAME = 'navigation-arrow-right';
var LEFT_ARROW_NAME = 'navigation-arrow-left';
var ROTATE_MAP = {
    right: (90 * Math.PI) / 180,
    left: ((360 - 90) * Math.PI) / 180,
    up: 0,
    down: (180 * Math.PI) / 180,
};
var Category = /** @class */ (function (_super) {
    __extends(Category, _super);
    function Category() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentPageIndex = 1;
        _this.totalPagesCnt = 1;
        _this.pageWidth = 0;
        _this.pageHeight = 0;
        _this.startX = 0;
        _this.startY = 0;
        _this.onNavigationBack = function () {
            var itemGroup = _this.getElementByLocalId('item-group');
            if (_this.currentPageIndex > 1) {
                _this.currentPageIndex -= 1;
                _this.updateNavigation();
                var matrix = _this.getCurrentNavigationMatrix();
                if (_this.get('animate')) {
                    itemGroup.animate({
                        matrix: matrix,
                    }, 100);
                }
                else {
                    itemGroup.attr({ matrix: matrix });
                }
            }
        };
        _this.onNavigationAfter = function () {
            var itemGroup = _this.getElementByLocalId('item-group');
            if (_this.currentPageIndex < _this.totalPagesCnt) {
                _this.currentPageIndex += 1;
                _this.updateNavigation();
                var matrix = _this.getCurrentNavigationMatrix();
                if (_this.get('animate')) {
                    itemGroup.animate({
                        matrix: matrix,
                    }, 100);
                }
                else {
                    itemGroup.attr({ matrix: matrix });
                }
            }
        };
        return _this;
    }
    Category.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { name: 'legend', type: 'category', itemSpacing: 24, itemMarginBottom: 8, maxItemWidth: null, itemWidth: null, itemHeight: null, itemName: {}, itemValue: null, maxWidth: null, maxHeight: null, marker: {}, radio: null, items: [], itemStates: {}, itemBackground: {}, pageNavigator: {}, defaultCfg: {
                title: {
                    spacing: 5,
                    style: {
                        fill: Theme.textColor,
                        fontSize: 12,
                        textAlign: 'start',
                        textBaseline: 'top',
                    },
                },
                background: {
                    padding: 5,
                    style: {
                        stroke: Theme.lineColor,
                    },
                },
                itemBackground: {
                    style: {
                        opacity: 0,
                        fill: '#fff',
                    },
                },
                pageNavigator: DEFAULT_PAGE_NAVIGATOR,
                itemName: {
                    spacing: 16,
                    style: textStyle,
                },
                marker: {
                    spacing: 8,
                    style: {
                        r: 6,
                        symbol: 'circle',
                    },
                },
                itemValue: {
                    alignRight: false,
                    formatter: null,
                    style: textStyle,
                    spacing: 6,
                },
                itemStates: {
                    active: {
                        nameStyle: {
                            opacity: 0.8,
                        },
                    },
                    unchecked: {
                        nameStyle: {
                            fill: Theme.uncheckedColor,
                        },
                        markerStyle: {
                            fill: Theme.uncheckedColor,
                            stroke: Theme.uncheckedColor,
                        },
                    },
                    inactive: {
                        nameStyle: {
                            fill: Theme.uncheckedColor,
                        },
                        markerStyle: {
                            opacity: 0.2,
                        },
                    },
                },
            } });
    };
    // 实现 IList 接口
    Category.prototype.isList = function () {
        return true;
    };
    /**
     * 获取图例项
     * @return {ListItem[]} 列表项集合
     */
    Category.prototype.getItems = function () {
        return this.get('items');
    };
    /**
     * 设置列表项
     * @param {ListItem[]} items 列表项集合
     */
    Category.prototype.setItems = function (items) {
        this.update({
            items: items,
        });
    };
    /**
     * 更新列表项
     * @param {ListItem} item 列表项
     * @param {object}   cfg  列表项
     */
    Category.prototype.updateItem = function (item, cfg) {
        mix(item, cfg);
        this.clear(); // 由于单个图例项变化，会引起全局变化，所以全部更新
        this.render();
    };
    /**
     * 清空列表
     */
    Category.prototype.clearItems = function () {
        var itemGroup = this.getElementByLocalId('item-group');
        itemGroup && itemGroup.clear();
    };
    /**
     * 设置列表项的状态
     * @param {ListItem} item  列表项
     * @param {string}   state 状态名
     * @param {boolean}  value 状态值, true, false
     */
    Category.prototype.setItemState = function (item, state, value) {
        item[state] = value;
        var itemElement = this.getElementByLocalId("item-" + item.id);
        if (itemElement) {
            var items = this.getItems();
            var index = items.indexOf(item);
            var offsetGroup = this.createOffScreenGroup(); // 离屏的 group
            var newElement = this.drawItem(item, index, this.getItemHeight(), offsetGroup);
            this.updateElements(newElement, itemElement); // 更新整个分组
            this.clearUpdateStatus(itemElement); // 清理更新状态，防止出现 bug
        }
    };
    /**
     * 是否存在指定的状态
     * @param {ListItem} item  列表项
     * @param {boolean} state 状态名
     */
    Category.prototype.hasState = function (item, state) {
        return !!item[state];
    };
    Category.prototype.getItemStates = function (item) {
        var itemStates = this.get('itemStates');
        var rst = [];
        each(itemStates, function (v, k) {
            if (item[k]) {
                // item.selected
                rst.push(k);
            }
        });
        return rst;
    };
    /**
     * 清楚所有列表项的状态
     * @param {string} state 状态值
     */
    Category.prototype.clearItemsState = function (state) {
        var _this = this;
        var items = this.getItemsByState(state);
        each(items, function (item) {
            _this.setItemState(item, state, false);
        });
    };
    /**
     * 根据状态获取图例项
     * @param  {string}     state [description]
     * @return {ListItem[]}       [description]
     */
    Category.prototype.getItemsByState = function (state) {
        var _this = this;
        var items = this.getItems();
        return filter(items, function (item) {
            return _this.hasState(item, state);
        });
    };
    // 绘制 legend 的选项
    Category.prototype.drawLegendContent = function (group) {
        this.processItems();
        this.drawItems(group);
    };
    // 防止未设置 id
    Category.prototype.processItems = function () {
        var items = this.get('items');
        each(items, function (item) {
            if (!item.id) {
                // 如果没有设置 id，默认使用 name
                item.id = item.name;
            }
        });
    };
    // 绘制所有的图例选项
    Category.prototype.drawItems = function (group) {
        var _this = this;
        var itemContainerGroup = this.addGroup(group, {
            id: this.getElementId('item-container-group'),
            name: 'legend-item-container-group',
        });
        var itemGroup = this.addGroup(itemContainerGroup, {
            id: this.getElementId('item-group'),
            name: 'legend-item-group',
        });
        var itemHeight = this.getItemHeight();
        var itemWidth = this.get('itemWidth');
        var itemSpacing = this.get('itemSpacing');
        var itemMarginBottom = this.get('itemMarginBottom');
        var currentPoint = this.get('currentPoint');
        var startX = currentPoint.x;
        var startY = currentPoint.y;
        var layout = this.get('layout');
        var items = this.get('items');
        var wrapped = false;
        var pageWidth = 0;
        var maxWidth = this.get('maxWidth'); // 最大宽度，会导致 layout : 'horizontal' 时自动换行
        var maxHeight = this.get('maxHeight'); // 最大高度，会导致出现分页
        // 暂时不考虑分页
        each(items, function (item, index) {
            var subGroup = _this.drawItem(item, index, itemHeight, itemGroup);
            var bbox = subGroup.getBBox();
            var width = itemWidth || bbox.width;
            if (width > pageWidth) {
                pageWidth = width;
            }
            if (layout === 'horizontal') {
                // 如果水平布局
                if (maxWidth && maxWidth < currentPoint.x + width - startX) {
                    // 检测是否换行
                    wrapped = true;
                    currentPoint.x = startX;
                    currentPoint.y += itemHeight + itemMarginBottom;
                }
                _this.moveElementTo(subGroup, currentPoint);
                currentPoint.x += width + itemSpacing;
            }
            else {
                // 如果垂直布局
                if (maxHeight && maxHeight < currentPoint.y + itemHeight + itemMarginBottom - startY) {
                    // 换行
                    wrapped = true;
                    currentPoint.x += pageWidth + itemSpacing;
                    currentPoint.y = startY;
                    pageWidth = 0;
                }
                _this.moveElementTo(subGroup, currentPoint);
                currentPoint.y += itemHeight + itemMarginBottom; // itemSpacing 仅影响水平间距
            }
        });
        if (wrapped && this.get('flipPage')) {
            this.pageHeight = 0;
            this.pageWidth = 0;
            this.totalPagesCnt = 1;
            this.startX = startX;
            this.startY = startY;
            this.adjustNavigation(group, itemGroup);
        }
    };
    // 获取图例项的高度，如果未定义，则按照 name 的高度计算
    Category.prototype.getItemHeight = function () {
        var itemHeight = this.get('itemHeight');
        if (!itemHeight) {
            var style_1 = (this.get('itemName') || {}).style;
            if (isFunction(style_1)) {
                var items_1 = this.getItems();
                items_1.forEach(function (item, index) {
                    var fontSize = __assign(__assign({}, textStyle), style_1(item, index, items_1)).fontSize;
                    if (itemHeight < fontSize) {
                        itemHeight = fontSize;
                    }
                });
            }
            else if (style_1) {
                itemHeight = style_1.fontSize;
            }
        }
        return itemHeight;
    };
    // 绘制 marker
    Category.prototype.drawMarker = function (container, markerCfg, item, itemHeight) {
        var markerAttrs = __assign(__assign(__assign({ x: 0, y: itemHeight / 2 }, markerCfg.style), { symbol: get(item.marker, 'symbol', 'circle') }), get(item.marker, 'style', {}));
        var shape = this.addShape(container, {
            type: 'marker',
            id: this.getElementId("item-" + item.id + "-marker"),
            name: 'legend-item-marker',
            attrs: markerAttrs,
        });
        var bbox = shape.getBBox();
        shape.attr('x', bbox.width / 2); // marker 需要左对齐，所以不能占用左侧的空间
        var _a = shape.attr(), stroke = _a.stroke, fill = _a.fill;
        if (stroke) {
            shape.set('isStroke', true);
        }
        if (fill) {
            shape.set('isFill', true);
        }
        return shape;
    };
    // 绘制文本
    Category.prototype.drawItemText = function (container, textName, cfg, item, itemHeight, xPosition, index) {
        var formatter = cfg.formatter;
        var style = cfg.style;
        var attrs = __assign(__assign({ x: xPosition, y: itemHeight / 2, text: formatter ? formatter(item[textName], item, index) : item[textName] }, textStyle), (isFunction(style) ? style(item, index, this.getItems()) : style));
        return this.addShape(container, {
            type: 'text',
            id: this.getElementId("item-" + item.id + "-" + textName),
            name: "legend-item-" + textName,
            attrs: attrs,
        });
    };
    Category.prototype.drawRadio = function (container, radioCfg, item, itemHeight, x) {
        var _a, _b;
        var style = radioCfg.style || {};
        // 以用户设置的 r 为主
        var r = (_a = style.r) !== null && _a !== void 0 ? _a : itemHeight / 2;
        var lineWidth = (r * 3.6) / 8;
        var _c = [x + r, itemHeight / 2 - r], x0 = _c[0], y0 = _c[1];
        var _d = [x0 + r, y0 + r], x1 = _d[0], y1 = _d[1];
        var _e = [x0, y1 + r], x2 = _e[0], y2 = _e[1];
        var _f = [x, y0 + r], x3 = _f[0], y3 = _f[1];
        var showRadio = item.showRadio;
        var attrs = __assign(__assign({ path: [
                ['M', x0, y0],
                ['A', r, r, 0, 0, 1, x1, y1],
                ['L', x1 - lineWidth, y1],
                ['L', x1, y1],
                ['A', r, r, 0, 0, 1, x2, y2],
                ['L', x2, y2 - lineWidth],
                ['L', x2, y2],
                ['A', r, r, 0, 0, 1, x3, y3],
                ['L', x3 + lineWidth, y3],
                ['L', x3, y3],
                ['A', r, r, 0, 0, 1, x0, y0],
                ['L', x0, y0 + lineWidth],
            ], stroke: '#000000', fill: '#ffffff' }, style), { opacity: showRadio ? ((_b = style === null || style === void 0 ? void 0 : style.opacity) !== null && _b !== void 0 ? _b : 0.45) : 0 });
        var radioShape = this.addShape(container, {
            type: 'path',
            id: this.getElementId("item-" + item.id + "-radio"),
            name: 'legend-item-radio',
            attrs: attrs,
        });
        radioShape.set('tip', radioCfg.tip);
        return radioShape;
    };
    // 绘制图例项
    Category.prototype.drawItem = function (item, index, itemHeight, itemGroup) {
        var groupId = "item-" + item.id;
        // 设置单独的 Group 用于 setClip
        var subContainer = this.addGroup(itemGroup, {
            name: 'legend-item-container',
            id: this.getElementId("item-container-" + groupId),
            delegateObject: {
                item: item,
                index: index,
            },
        });
        var subGroup = this.addGroup(subContainer, {
            name: 'legend-item',
            id: this.getElementId(groupId),
            delegateObject: {
                item: item,
                index: index,
            },
        });
        var marker = this.get('marker');
        var itemName = this.get('itemName');
        var itemValue = this.get('itemValue');
        var itemBackground = this.get('itemBackground');
        var radio = this.get('radio');
        var itemWidth = this.getLimitItemWidth();
        var curX = 0; // 记录当前 x 的位置
        if (marker) {
            var markerShape = this.drawMarker(subGroup, marker, item, itemHeight);
            var spacing = marker.spacing;
            var itemMarkerSpacing = get(item, ['marker', 'spacing']);
            if (isNumber(itemMarkerSpacing)) {
                // 如果 item 有配置 marker.spacing，采用 item 的配置
                spacing = itemMarkerSpacing;
            }
            curX = markerShape.getBBox().maxX + spacing;
        }
        if (itemName) {
            var nameShape = this.drawItemText(subGroup, 'name', itemName, item, itemHeight, curX, index);
            if (itemWidth) {
                // 设置了 item 的最大宽度限制，并且超出了，进行省略处理
                ellipsisLabel(true, nameShape, clamp(itemWidth - curX, 0, itemWidth));
            }
            curX = nameShape.getBBox().maxX + itemName.spacing;
        }
        if (itemValue) {
            var valueShape = this.drawItemText(subGroup, 'value', itemValue, item, itemHeight, curX, index);
            if (itemWidth) {
                if (itemValue.alignRight) {
                    valueShape.attr({
                        textAlign: 'right',
                        x: itemWidth,
                    });
                    ellipsisLabel(true, valueShape, clamp(itemWidth - curX, 0, itemWidth), 'head');
                }
                else {
                    ellipsisLabel(true, valueShape, clamp(itemWidth - curX, 0, itemWidth));
                }
            }
            curX = valueShape.getBBox().maxX + itemValue.spacing;
        }
        if (radio) {
            this.drawRadio(subGroup, radio, item, itemHeight, curX);
        }
        // 添加透明的背景，便于拾取和包围盒计算
        if (itemBackground) {
            var bbox = subGroup.getBBox();
            var backShape = this.addShape(subGroup, {
                type: 'rect',
                name: 'legend-item-background',
                id: this.getElementId(groupId + "-background"),
                attrs: __assign({ x: 0, y: 0, width: bbox.width, height: itemHeight }, itemBackground.style),
            });
            backShape.toBack();
        }
        this.applyItemStates(item, subGroup);
        return subGroup;
    };
    // 加上分页器并重新排序 items
    Category.prototype.adjustNavigation = function (container, itemGroup) {
        var _this = this;
        var startX = this.startX;
        var startY = this.startY;
        var layout = this.get('layout');
        var subGroups = itemGroup.findAll(function (item) { return item.get('name') === 'legend-item'; });
        var maxWidth = this.get('maxWidth');
        var maxHeight = this.get('maxHeight');
        var itemWidth = this.get('itemWidth');
        var itemSpacing = this.get('itemSpacing');
        var itemHeight = this.getItemHeight();
        var pageNavigator = deepMix({}, DEFAULT_PAGE_NAVIGATOR, this.get('pageNavigator'));
        var navigation = this.drawNavigation(container, layout, '00/00', pageNavigator);
        var navigationBBox = navigation.getBBox();
        var currentPoint = { x: startX, y: startY };
        var pages = 1;
        var widthLimit = 0;
        var pageWidth = 0;
        var maxItemWidth = 0;
        var itemMarginBottom = this.get('itemMarginBottom');
        /**  判断当前 item 是否溢出当前页。是的话，需要换行 */
        function shouldWrap(item, currentPoint) {
            var bbox = item.getBBox();
            var width = itemWidth || bbox.width;
            var newItemXPos = currentPoint.x + width + itemSpacing + navigationBBox.width;
            return newItemXPos > maxWidth;
        }
        if (layout === 'horizontal') {
            var maxRow = this.get('maxRow') || 1;
            var maxRowHeight_1 = itemHeight + (maxRow === 1 ? 0 : itemMarginBottom);
            // 分页器一直靠右上角
            var navigationX_1 = maxWidth - itemSpacing - navigationBBox.width - navigationBBox.minX; // 理论上不需要减 navigationBBox.minX
            this.pageHeight = maxRowHeight_1 * maxRow;
            this.pageWidth = navigationX_1;
            each(subGroups, function (item) {
                var bbox = item.getBBox();
                var width = itemWidth || bbox.width;
                if ((widthLimit && widthLimit < currentPoint.x + width + itemSpacing) ||
                    shouldWrap(item, currentPoint)) {
                    if (pages === 1) {
                        widthLimit = currentPoint.x + itemSpacing;
                        _this.moveElementTo(navigation, {
                            x: navigationX_1,
                            y: currentPoint.y + itemHeight / 2 - navigationBBox.height / 2 - navigationBBox.minY,
                        });
                    }
                    pages += 1;
                    currentPoint.x = startX;
                    currentPoint.y += maxRowHeight_1;
                }
                _this.moveElementTo(item, currentPoint);
                item.getParent().setClip({
                    type: 'rect',
                    attrs: {
                        x: currentPoint.x,
                        y: currentPoint.y,
                        width: width + itemSpacing,
                        height: itemHeight,
                    },
                });
                currentPoint.x += width + itemSpacing;
            });
        }
        else {
            each(subGroups, function (item) {
                var bbox = item.getBBox();
                if (bbox.width > pageWidth) {
                    pageWidth = bbox.width;
                }
            });
            maxItemWidth = pageWidth;
            pageWidth += itemSpacing;
            if (maxWidth) {
                // maxWidth 限制加上
                pageWidth = Math.min(maxWidth, pageWidth);
                maxItemWidth = Math.min(maxWidth, maxItemWidth);
            }
            this.pageWidth = pageWidth;
            this.pageHeight = maxHeight - Math.max(navigationBBox.height, itemHeight + itemMarginBottom);
            var cntPerPage_1 = Math.floor(this.pageHeight / (itemHeight + itemMarginBottom));
            each(subGroups, function (item, index) {
                if (index !== 0 && index % cntPerPage_1 === 0) {
                    pages += 1;
                    currentPoint.x += pageWidth;
                    currentPoint.y = startY;
                }
                _this.moveElementTo(item, currentPoint);
                item.getParent().setClip({
                    type: 'rect',
                    attrs: {
                        x: currentPoint.x,
                        y: currentPoint.y,
                        width: pageWidth,
                        height: itemHeight,
                    },
                });
                currentPoint.y += itemHeight + itemMarginBottom;
            });
            this.totalPagesCnt = pages;
            this.moveElementTo(navigation, {
                x: startX + maxItemWidth / 2 - navigationBBox.width / 2 - navigationBBox.minX,
                y: maxHeight - navigationBBox.height - navigationBBox.minY,
            });
        }
        if (this.pageHeight && this.pageWidth) {
            // 为了使固定的 clip 生效，clip 设置在 itemContainerGroup 上，itemGroup 需要在翻页时会设置 matrix
            itemGroup.getParent().setClip({
                type: 'rect',
                attrs: {
                    x: this.startX,
                    y: this.startY,
                    width: this.pageWidth,
                    height: this.pageHeight,
                },
            });
        }
        // 重新计算 totalPagesCnt
        if (layout === 'horizontal' && this.get('maxRow')) {
            this.totalPagesCnt = Math.ceil(pages / this.get('maxRow'));
        }
        else {
            this.totalPagesCnt = pages;
        }
        if (this.currentPageIndex > this.totalPagesCnt) {
            this.currentPageIndex = 1;
        }
        this.updateNavigation(navigation);
        // update initial matrix
        itemGroup.attr('matrix', this.getCurrentNavigationMatrix());
    };
    /**
     * 绘制分页器
     */
    Category.prototype.drawNavigation = function (group, layout, text, styleCfg) {
        var currentPoint = { x: 0, y: 0 };
        var subGroup = this.addGroup(group, {
            id: this.getElementId('navigation-group'),
            name: 'legend-navigation',
        });
        var _a = get(styleCfg.marker, 'style', {}), _b = _a.size, size = _b === void 0 ? 12 : _b, arrowStyle = __rest(_a, ["size"]);
        var leftArrow = this.drawArrow(subGroup, currentPoint, LEFT_ARROW_NAME, layout === 'horizontal' ? 'up' : 'left', size, arrowStyle);
        leftArrow.on('click', this.onNavigationBack);
        var leftArrowBBox = leftArrow.getBBox();
        currentPoint.x += leftArrowBBox.width + 2;
        var textShape = this.addShape(subGroup, {
            type: 'text',
            id: this.getElementId('navigation-text'),
            name: 'navigation-text',
            attrs: __assign({ x: currentPoint.x, y: currentPoint.y + size / 2, text: text, textBaseline: 'middle' }, get(styleCfg.text, 'style')),
        });
        var textBBox = textShape.getBBox();
        currentPoint.x += textBBox.width + 2;
        var rightArrow = this.drawArrow(subGroup, currentPoint, RIGHT_ARROW_NAME, layout === 'horizontal' ? 'down' : 'right', size, arrowStyle);
        rightArrow.on('click', this.onNavigationAfter);
        return subGroup;
    };
    Category.prototype.updateNavigation = function (navigation) {
        var pageNavigator = deepMix({}, DEFAULT_PAGE_NAVIGATOR, this.get('pageNavigator'));
        var _a = pageNavigator.marker.style, fill = _a.fill, opacity = _a.opacity, inactiveFill = _a.inactiveFill, inactiveOpacity = _a.inactiveOpacity;
        var text = this.currentPageIndex + "/" + this.totalPagesCnt;
        var textShape = navigation ? navigation.getChildren()[1] : this.getElementByLocalId('navigation-text');
        var leftArrow = navigation
            ? navigation.findById(this.getElementId(LEFT_ARROW_NAME))
            : this.getElementByLocalId(LEFT_ARROW_NAME);
        var rightArrow = navigation
            ? navigation.findById(this.getElementId(RIGHT_ARROW_NAME))
            : this.getElementByLocalId(RIGHT_ARROW_NAME);
        textShape.attr('text', text);
        // 更新 left-arrow marker
        leftArrow.attr('opacity', this.currentPageIndex === 1 ? inactiveOpacity : opacity);
        leftArrow.attr('fill', this.currentPageIndex === 1 ? inactiveFill : fill);
        leftArrow.attr('cursor', this.currentPageIndex === 1 ? 'not-allowed' : 'pointer');
        // 更新 right-arrow marker
        rightArrow.attr('opacity', this.currentPageIndex === this.totalPagesCnt ? inactiveOpacity : opacity);
        rightArrow.attr('fill', this.currentPageIndex === this.totalPagesCnt ? inactiveFill : fill);
        rightArrow.attr('cursor', this.currentPageIndex === this.totalPagesCnt ? 'not-allowed' : 'pointer');
        // 更新位置
        var cursorX = leftArrow.getBBox().maxX + 2;
        textShape.attr('x', cursorX);
        cursorX += textShape.getBBox().width + 2;
        this.updateArrowPath(rightArrow, { x: cursorX, y: 0 });
    };
    Category.prototype.drawArrow = function (group, currentPoint, name, direction, size, style) {
        var x = currentPoint.x, y = currentPoint.y;
        var shape = this.addShape(group, {
            type: 'path',
            id: this.getElementId(name),
            name: name,
            attrs: __assign({ size: size,
                direction: direction, path: [['M', x + size / 2, y], ['L', x, y + size], ['L', x + size, y + size], ['Z']], cursor: 'pointer' }, style),
        });
        shape.attr('matrix', getMatrixByAngle({ x: x + size / 2, y: y + size / 2 }, ROTATE_MAP[direction]));
        return shape;
    };
    /**
     * 更新分页器 arrow 组件
     */
    Category.prototype.updateArrowPath = function (arrow, point) {
        var x = point.x, y = point.y;
        var _a = arrow.attr(), size = _a.size, direction = _a.direction;
        var matrix = getMatrixByAngle({ x: x + size / 2, y: y + size / 2 }, ROTATE_MAP[direction]);
        arrow.attr('path', [['M', x + size / 2, y], ['L', x, y + size], ['L', x + size, y + size], ['Z']]);
        arrow.attr('matrix', matrix);
    };
    Category.prototype.getCurrentNavigationMatrix = function () {
        var _a = this, currentPageIndex = _a.currentPageIndex, pageWidth = _a.pageWidth, pageHeight = _a.pageHeight;
        var layout = this.get('layout');
        var translate = layout === 'horizontal'
            ? {
                x: 0,
                y: pageHeight * (1 - currentPageIndex),
            }
            : {
                x: pageWidth * (1 - currentPageIndex),
                y: 0,
            };
        return getMatrixByTranslate(translate);
    };
    // 附加状态对应的样式
    Category.prototype.applyItemStates = function (item, subGroup) {
        var states = this.getItemStates(item);
        var hasStates = states.length > 0;
        if (hasStates) {
            var children = subGroup.getChildren();
            var itemStates_1 = this.get('itemStates');
            each(children, function (element) {
                var name = element.get('name');
                var elName = name.split('-')[2]; // marker, name, value
                var statesStyle = getStatesStyle(item, elName, itemStates_1);
                if (statesStyle) {
                    element.attr(statesStyle);
                    if (elName === 'marker' && !(element.get('isStroke') && element.get('isFill'))) {
                        // 如果 marker 是单填充或者单描边的话，就不要额外添加 stroke 或这 fill 属性，否则会影响 unchecked 后的显示
                        if (element.get('isStroke')) {
                            element.attr('fill', null);
                        }
                        if (element.get('isFill')) {
                            element.attr('stroke', null);
                        }
                    }
                }
            });
        }
    };
    // 获取 itemWidth 的最终设置
    Category.prototype.getLimitItemWidth = function () {
        var itemWidth = this.get('itemWidth');
        var maxItemWidth = this.get('maxItemWidth');
        if (maxItemWidth) {
            // 设置了最大宽度
            if (itemWidth) {
                maxItemWidth = itemWidth <= maxItemWidth ? itemWidth : maxItemWidth;
            }
        }
        else if (itemWidth) {
            maxItemWidth = itemWidth;
        }
        return maxItemWidth;
    };
    return Category;
}(LegendBase));
export default Category;
//# sourceMappingURL=category.js.map