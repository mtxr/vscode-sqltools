"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var adjust_1 = require("@antv/adjust");
var attr_1 = require("@antv/attr");
var util_1 = require("@antv/util");
var animate_1 = require("../animate");
var base_1 = tslib_1.__importDefault(require("../base"));
var constant_1 = require("../constant");
var helper_1 = require("../util/helper");
var element_1 = tslib_1.__importDefault(require("./element"));
var label_1 = require("./label");
var base_2 = require("./shape/base");
var group_data_1 = require("./util/group-data");
var is_model_change_1 = require("./util/is-model-change");
var parse_fields_1 = require("./util/parse-fields");
var diff_1 = require("./util/diff");
var scale_1 = require("../util/scale");
var coordinate_1 = require("../util/coordinate");
/**
 * Geometry 几何标记基类，主要负责数据到图形属性的映射以及绘制逻辑。
 */
var Geometry = /** @class */ (function (_super) {
    tslib_1.__extends(Geometry, _super);
    /**
     * 创建 Geometry 实例。
     * @param cfg
     */
    function Geometry(cfg) {
        var _this = _super.call(this, cfg) || this;
        /** Geometry 几何标记类型。 */
        _this.type = 'base';
        // 内部产生的属性
        /** Attribute map  */
        _this.attributes = {};
        /** Element map */
        _this.elements = [];
        /** 使用 key-value 结构存储 Element，key 为每个 Element 实例对应的唯一 ID */
        _this.elementsMap = {};
        /** animate 配置项 */
        _this.animateOption = true;
        /** 图形属性映射配置 */
        _this.attributeOption = {};
        /** 存储上一次渲染时的 element 映射表，用于更新逻辑 */
        _this.lastElementsMap = {};
        /** 是否生成多个点来绘制图形。 */
        _this.generatePoints = false;
        /** 存储发生图形属性映射前的数据 */
        _this.beforeMappingData = null;
        _this.adjusts = {};
        _this.idFields = [];
        _this.hasSorted = false;
        _this.isCoordinateChanged = false;
        var container = cfg.container, labelsContainer = cfg.labelsContainer, coordinate = cfg.coordinate, data = cfg.data, _a = cfg.sortable, sortable = _a === void 0 ? false : _a, _b = cfg.visible, visible = _b === void 0 ? true : _b, theme = cfg.theme, _c = cfg.scales, scales = _c === void 0 ? {} : _c, _d = cfg.scaleDefs, scaleDefs = _d === void 0 ? {} : _d, 
        // 柱状图间隔与宽度相关配置
        intervalPadding = cfg.intervalPadding, dodgePadding = cfg.dodgePadding, maxColumnWidth = cfg.maxColumnWidth, minColumnWidth = cfg.minColumnWidth, columnWidthRatio = cfg.columnWidthRatio, roseWidthRatio = cfg.roseWidthRatio, multiplePieWidthRatio = cfg.multiplePieWidthRatio, zIndexReversed = cfg.zIndexReversed, sortZIndex = cfg.sortZIndex, useDeferredLabel = cfg.useDeferredLabel;
        _this.container = container;
        _this.labelsContainer = labelsContainer;
        _this.coordinate = coordinate;
        _this.data = data;
        _this.sortable = sortable;
        _this.visible = visible;
        _this.userTheme = theme;
        _this.scales = scales;
        _this.scaleDefs = scaleDefs;
        // 柱状图间隔与宽度相关配置
        _this.intervalPadding = intervalPadding;
        _this.dodgePadding = dodgePadding;
        _this.maxColumnWidth = maxColumnWidth;
        _this.minColumnWidth = minColumnWidth;
        _this.columnWidthRatio = columnWidthRatio;
        _this.roseWidthRatio = roseWidthRatio;
        _this.multiplePieWidthRatio = multiplePieWidthRatio;
        _this.zIndexReversed = zIndexReversed;
        _this.sortZIndex = sortZIndex;
        _this.useDeferredLabel = useDeferredLabel ? (typeof useDeferredLabel === 'number' ? useDeferredLabel : Infinity) : null;
        return _this;
    }
    /**
     * 配置 position 通道映射规则。
     *
     * @example
     * ```typescript
     * // 数据结构: [{ x: 'A', y: 10, color: 'red' }]
     * geometry.position('x*y');
     * geometry.position([ 'x', 'y' ]);
     * geometry.position({
     *   fields: [ 'x', 'y' ],
     * });
     * ```
     *
     * @param cfg 映射规则
     * @returns
     */
    Geometry.prototype.position = function (cfg) {
        var positionCfg = cfg;
        if (!(0, util_1.isPlainObject)(cfg)) {
            // 字符串字段或者数组字段
            positionCfg = {
                fields: (0, parse_fields_1.parseFields)(cfg),
            };
        }
        var fields = (0, util_1.get)(positionCfg, 'fields');
        if (fields.length === 1) {
            // 默认填充一维 1*xx
            fields.unshift('1');
            (0, util_1.set)(positionCfg, 'fields', fields);
        }
        (0, util_1.set)(this.attributeOption, 'position', positionCfg);
        return this;
    };
    Geometry.prototype.color = function (field, cfg) {
        this.createAttrOption('color', field, cfg);
        return this;
    };
    Geometry.prototype.shape = function (field, cfg) {
        this.createAttrOption('shape', field, cfg);
        return this;
    };
    Geometry.prototype.size = function (field, cfg) {
        this.createAttrOption('size', field, cfg);
        return this;
    };
    /**
     * 设置数据调整方式。G2 目前内置了四种类型：
     * 1. dodge
     * 2. stack
     * 3. symmetric
     * 4. jitter
     *
     *
     * **Tip**
     * + 对于 'dodge' 类型，可以额外进行如下属性的配置:
     * ```typescript
     * geometry.adjust('dodge', {
     *   marginRatio: 0, // 取 0 到 1 范围的值（相对于每个柱子宽度），用于控制一个分组中柱子之间的间距
     *   dodgeBy: 'x', // 该属性只对 'dodge' 类型生效，声明以哪个数据字段为分组依据
     * });
     * ```
     *
     * + 对于 'stack' 类型，可以额外进行如下属性的配置:
     * ```typescript
     * geometry.adjust('stack', {
     *   reverseOrder: false, // 用于控制是否对数据进行反序操作
     * });
     * ```
     *
     * @example
     * ```typescript
     * geometry.adjust('stack');
     *
     * geometry.adjust({
     *   type: 'stack',
     *   reverseOrder: false,
     * });
     *
     * // 组合使用 adjust
     * geometry.adjust([ 'stack', 'dodge' ]);
     *
     * geometry.adjust([
     *   { type: 'stack' },
     *   { type: 'dodge', dodgeBy: 'x' },
     * ]);
     * ```
     *
     * @param adjustCfg 数据调整配置
     * @returns
     */
    Geometry.prototype.adjust = function (adjustCfg) {
        var adjusts = adjustCfg;
        if ((0, util_1.isString)(adjustCfg) || (0, util_1.isPlainObject)(adjustCfg)) {
            adjusts = [adjustCfg];
        }
        (0, util_1.each)(adjusts, function (adjust, index) {
            if (!(0, util_1.isObject)(adjust)) {
                adjusts[index] = { type: adjust };
            }
        });
        this.adjustOption = adjusts;
        return this;
    };
    Geometry.prototype.style = function (field, styleFunc) {
        if ((0, util_1.isString)(field)) {
            var fields = (0, parse_fields_1.parseFields)(field);
            this.styleOption = {
                fields: fields,
                callback: styleFunc,
            };
        }
        else {
            var _a = field, fields = _a.fields, callback = _a.callback, cfg = _a.cfg;
            if (fields || callback || cfg) {
                this.styleOption = field;
            }
            else {
                this.styleOption = {
                    cfg: field,
                };
            }
        }
        return this;
    };
    Geometry.prototype.tooltip = function (field, cfg) {
        if ((0, util_1.isString)(field)) {
            var fields = (0, parse_fields_1.parseFields)(field);
            this.tooltipOption = {
                fields: fields,
                callback: cfg,
            };
        }
        else {
            this.tooltipOption = field;
        }
        return this;
    };
    /**
     * Geometry 动画配置。
     *
     * + `animate(false)` 关闭动画
     * + `animate(true)` 开启动画，默认开启。
     *
     * 我们将动画分为四个场景：
     * 1. appear: 图表第一次加载时的入场动画；
     * 2. enter: 图表绘制完成，发生更新后，产生的新图形的进场动画；
     * 3. update: 图表绘制完成，数据发生变更后，有状态变更的图形的更新动画；
     * 4. leave: 图表绘制完成，数据发生变更后，被销毁图形的销毁动画。
     *
     * @example
     * ```typescript
     * animate({
     *   enter: {
     *     duration: 1000, // enter 动画执行时间
     *   },
     *   leave: false, // 关闭 leave 销毁动画
     * });
     * ```
     *
     * @param cfg 动画配置
     * @returns
     */
    Geometry.prototype.animate = function (cfg) {
        this.animateOption = cfg;
        return this;
    };
    Geometry.prototype.label = function (field, secondParam, thirdParam) {
        if ((0, util_1.isString)(field)) {
            var labelOption = {};
            var fields = (0, parse_fields_1.parseFields)(field);
            labelOption.fields = fields;
            if ((0, util_1.isFunction)(secondParam)) {
                labelOption.callback = secondParam;
            }
            else if ((0, util_1.isPlainObject)(secondParam)) {
                labelOption.cfg = secondParam;
            }
            if (thirdParam) {
                labelOption.cfg = thirdParam;
            }
            this.labelOption = labelOption;
        }
        else {
            this.labelOption = field;
        }
        return this;
    };
    /**
     * 设置状态对应的样式。
     *
     * @example
     * ```ts
     * chart.interval().state({
     *   selected: {
     *     animate: { duration: 100, easing: 'easeLinear' },
     *     style: {
     *       lineWidth: 2,
     *       stroke: '#000',
     *     },
     *   },
     * });
     * ```
     *
     * 如果图形 shape 是由多个 shape 组成，即为一个 G.Group 对象，那么针对 group 中的每个 shape，我们需要使用下列方式进行状态样式设置：
     * 如果我们为 group 中的每个 shape 设置了 'name' 属性(shape.set('name', 'xx'))，则以 'name' 作为 key，否则默认以索引值（即 shape 的 添加顺序）为 key。
     *
     * ```ts
     * chart.interval().shape('groupShape').state({
     *   selected: {
     *     style: {
     *       0: { lineWidth: 2 },
     *       1: { fillOpacity: 1 },
     *     }
     *   }
     * });
     * ```
     *
     * @param cfg 状态样式
     */
    Geometry.prototype.state = function (cfg) {
        this.stateOption = cfg;
        return this;
    };
    /**
     * 用于向 shape 中传入自定义的数据。目前可能仅仅可能用于在自定义 shape 的时候，像自定义 shape 中传入自定义的数据，方便实现自定义 shape 的配置能力。
     *
     * @example
     * ```ts
     * chart.interval().customInfo({ yourData: 'hello, g2!' });
     * ```
     *
     * 然后在自定义 shape 的时候，可以拿到这个信息。
     *
     * ```ts
     * registerShape('interval', 'your-shape', {
     *   draw(shapeInfo, container) {
     *     const { customInfo } = shapeInfo;
     *     console.log(customInfo); // will log { yourData: 'hello, g2!' }.
     *   }
     * });
     * ```
     *
     * @param cfg
     */
    Geometry.prototype.customInfo = function (cfg) {
        this.customOption = cfg;
        return this;
    };
    /**
     * 初始化 Geomtry 实例：
     * 创建 [[Attribute]] and [[Scale]] 实例，进行数据处理，包括分组、数值化以及数据调整。
     */
    Geometry.prototype.init = function (cfg) {
        if (cfg === void 0) { cfg = {}; }
        this.setCfg(cfg);
        this.initAttributes(); // 创建图形属性
        // 数据加工：分组 -> 数字化 -> adjust
        this.processData(this.data);
        // 调整 scale
        this.adjustScale();
    };
    /**
     * Geometry 更新。
     * @param [cfg] 更新的配置
     */
    Geometry.prototype.update = function (cfg) {
        if (cfg === void 0) { cfg = {}; }
        var data = cfg.data, isDataChanged = cfg.isDataChanged, isCoordinateChanged = cfg.isCoordinateChanged;
        var _a = this, attributeOption = _a.attributeOption, lastAttributeOption = _a.lastAttributeOption;
        if (!(0, util_1.isEqual)(attributeOption, lastAttributeOption)) {
            // 映射发生改变，则重新创建图形属性
            this.init(cfg);
        }
        else if (data && (isDataChanged || !(0, util_1.isEqual)(data, this.data))) {
            // 数据发生变化
            this.setCfg(cfg);
            this.initAttributes(); // 创建图形属性
            this.processData(data); // 数据加工：分组 -> 数字化 -> adjust
        }
        else {
            // 有可能 coordinate 变化
            this.setCfg(cfg);
        }
        // 调整 scale
        this.adjustScale();
        this.isCoordinateChanged = isCoordinateChanged;
    };
    /**
     * 将原始数据映射至图形空间，同时创建图形对象。
     */
    Geometry.prototype.paint = function (isUpdate) {
        var _this = this;
        if (isUpdate === void 0) { isUpdate = false; }
        if (this.animateOption) {
            this.animateOption = (0, util_1.deepMix)({}, (0, animate_1.getDefaultAnimateCfg)(this.type, this.coordinate), this.animateOption);
        }
        this.defaultSize = undefined;
        this.elementsMap = {};
        this.elements = [];
        var offscreenGroup = this.getOffscreenGroup();
        offscreenGroup.clear();
        var beforeMappingData = this.beforeMappingData;
        var dataArray = this.beforeMapping(beforeMappingData);
        this.dataArray = new Array(dataArray.length);
        for (var i = 0; i < dataArray.length; i++) {
            var data = dataArray[i];
            this.dataArray[i] = this.mapping(data);
        }
        this.updateElements(this.dataArray, isUpdate);
        this.lastElementsMap = this.elementsMap;
        if (this.canDoGroupAnimation(isUpdate)) {
            // 如果用户没有配置 appear.animation，就默认走整体动画
            var container = this.container;
            var type = this.type;
            var coordinate = this.coordinate;
            var animateCfg = (0, util_1.get)(this.animateOption, 'appear');
            var yScale = this.getYScale();
            var yMinPoint = coordinate.convert({
                x: 0,
                y: yScale.scale(this.getYMinValue()),
            });
            (0, animate_1.doGroupAppearAnimate)(container, animateCfg, type, coordinate, yMinPoint);
        }
        // 添加 label
        if (this.labelOption) {
            var deferred = this.useDeferredLabel;
            var callback = (function () { return _this.renderLabels((0, util_1.flatten)(_this.dataArray), isUpdate); }).bind(this);
            if (typeof deferred === 'number') {
                // Use `requestIdleCallback` to render labels in idle time (like react fiber)
                var timeout = (typeof deferred === 'number' && deferred !== Infinity) ? deferred : 0;
                if (!window.requestIdleCallback) {
                    setTimeout(callback, timeout);
                }
                else {
                    var options = timeout && timeout !== Infinity ? { timeout: timeout } : undefined;
                    window.requestIdleCallback(callback, options);
                }
            }
            else {
                callback();
            }
        }
        // 缓存，用于更新
        this.lastAttributeOption = tslib_1.__assign({}, this.attributeOption);
        if (this.visible === false) {
            // 用户在初始化的时候声明 visible: false
            this.changeVisible(false);
        }
    };
    /**
     * 清空当前 Geometry，配置项仍保留，但是内部创建的对象全部清空。
     * @override
     */
    Geometry.prototype.clear = function () {
        var _a = this, container = _a.container, geometryLabel = _a.geometryLabel, offscreenGroup = _a.offscreenGroup;
        if (container) {
            container.clear();
        }
        if (geometryLabel) {
            geometryLabel.clear();
        }
        if (offscreenGroup) {
            offscreenGroup.clear();
        }
        // 属性恢复至出厂状态
        this.scaleDefs = undefined;
        this.attributes = {};
        this.scales = {};
        this.elementsMap = {};
        this.lastElementsMap = {};
        this.elements = [];
        this.adjusts = {};
        this.dataArray = null;
        this.beforeMappingData = null;
        this.lastAttributeOption = undefined;
        this.defaultSize = undefined;
        this.idFields = [];
        this.groupScales = undefined;
        this.hasSorted = false;
        this.isCoordinateChanged = false;
    };
    /**
     * 销毁 Geometry 实例。
     */
    Geometry.prototype.destroy = function () {
        this.clear();
        var container = this.container;
        container.remove(true);
        if (this.offscreenGroup) {
            this.offscreenGroup.remove(true);
            this.offscreenGroup = null;
        }
        if (this.geometryLabel) {
            this.geometryLabel.destroy();
            this.geometryLabel = null;
        }
        this.theme = undefined;
        this.shapeFactory = undefined;
        _super.prototype.destroy.call(this);
    };
    /**
     * 获取决定分组的图形属性对应的 scale 实例。
     * @returns
     */
    Geometry.prototype.getGroupScales = function () {
        return this.groupScales;
    };
    /**
     * 根据名字获取图形属性实例。
     */
    Geometry.prototype.getAttribute = function (name) {
        return this.attributes[name];
    };
    /** 获取 x 轴对应的 scale 实例。 */
    Geometry.prototype.getXScale = function () {
        return this.getAttribute('position').scales[0];
    };
    /** 获取 y 轴对应的 scale 实例。 */
    Geometry.prototype.getYScale = function () {
        return this.getAttribute('position').scales[1];
    };
    /**
     * 获取决定分组的图形属性实例。
     */
    Geometry.prototype.getGroupAttributes = function () {
        var rst = [];
        (0, util_1.each)(this.attributes, function (attr) {
            if (constant_1.GROUP_ATTRS.includes(attr.type)) {
                rst.push(attr);
            }
        });
        return rst;
    };
    /** 获取图形属性默认的映射值。 */
    Geometry.prototype.getDefaultValue = function (attrName) {
        var value;
        var attr = this.getAttribute(attrName);
        if (attr && (0, util_1.isEmpty)(attr.scales)) {
            // 获取映射至常量的值
            value = attr.values[0];
        }
        return value;
    };
    /**
     * 获取该数据发生图形映射后对应的 Attribute 图形空间数据。
     * @param attr Attribute 图形属性实例。
     * @param obj 需要进行映射的原始数据。
     * @returns
     */
    Geometry.prototype.getAttributeValues = function (attr, obj) {
        var params = [];
        var scales = attr.scales;
        for (var index = 0, length_1 = scales.length; index < length_1; index++) {
            var scale = scales[index];
            var field = scale.field;
            if (scale.isIdentity) {
                params.push(scale.values);
            }
            else {
                params.push(obj[field]);
            }
        }
        return attr.mapping.apply(attr, tslib_1.__spreadArray([], tslib_1.__read(params), false));
    };
    /**
     * 获取对应的 adjust 实例
     * @param adjustType
     * @returns
     */
    Geometry.prototype.getAdjust = function (adjustType) {
        return this.adjusts[adjustType];
    };
    /**
     * 获得 coordinate 实例
     * @returns
     */
    Geometry.prototype.getCoordinate = function () {
        return this.coordinate;
    };
    Geometry.prototype.getData = function () {
        return this.data;
    };
    /**
     * 获取 shape 对应的 marker 样式。
     * @param shapeName shape 具体名字
     * @param cfg marker 信息
     * @returns
     */
    Geometry.prototype.getShapeMarker = function (shapeName, cfg) {
        var shapeFactory = this.getShapeFactory();
        return shapeFactory.getMarker(shapeName, cfg);
    };
    /**
     * 根据一定的规则查找 Geometry 的 Elements。
     *
     * ```typescript
     * getElementsBy((element) => {
     *   const data = element.getData();
     *
     *   return data.a === 'a';
     * });
     * ```
     *
     * @param condition 定义查找规则的回调函数。
     * @returns
     */
    Geometry.prototype.getElementsBy = function (condition) {
        return this.elements.filter(function (element) { return condition(element); });
    };
    /**
     * 获取 Geometry 的所有 Elements。
     *
     * ```typescript
     * getElements();
     * ```
     */
    Geometry.prototype.getElements = function () {
        return this.elements;
    };
    /**
     * 获取数据对应的唯一 id。
     * @param data Element 对应的绘制数据
     * @returns
     */
    Geometry.prototype.getElementId = function (data) {
        data = (0, util_1.isArray)(data) ? data[0] : data;
        var originData = data[constant_1.FIELD_ORIGIN];
        // 如果用户声明了使用哪些字段作为 id 值
        if (this.idFields.length) {
            var elementId = originData[this.idFields[0]];
            for (var index = 1; index < this.idFields.length; index++) {
                elementId += '-' + originData[this.idFields[index]];
            }
            return elementId;
        }
        var type = this.type;
        var xScale = this.getXScale();
        var yScale = this.getYScale();
        var xField = xScale.field || 'x';
        var yField = yScale.field || 'y';
        var yVal = originData[yField];
        var xVal;
        if (xScale.type === 'identity') {
            xVal = xScale.values[0];
        }
        else {
            xVal = originData[xField];
        }
        var id;
        if (type === 'interval' || type === 'schema') {
            id = "".concat(xVal);
        }
        else if (type === 'line' || type === 'area' || type === 'path') {
            id = type;
        }
        else {
            id = "".concat(xVal, "-").concat(yVal);
        }
        var groupScales = this.groupScales;
        for (var index = 0, length_2 = groupScales.length; index < length_2; index++) {
            var groupScale = groupScales[index];
            var field = groupScale.field;
            id = "".concat(id, "-").concat(originData[field]);
        }
        // 用户在进行 dodge 类型的 adjust 调整的时候设置了 dodgeBy 属性
        var dodgeAdjust = this.getAdjust('dodge');
        if (dodgeAdjust) {
            var dodgeBy = dodgeAdjust.dodgeBy;
            if (dodgeBy) {
                id = "".concat(id, "-").concat(originData[dodgeBy]);
            }
        }
        if (this.getAdjust('jitter')) {
            id = "".concat(id, "-").concat(data.x, "-").concat(data.y);
        }
        return id;
    };
    /**
     * 获取所有需要创建 scale 的字段名称。
     */
    Geometry.prototype.getScaleFields = function () {
        var fields = [];
        var tmpMap = new Map();
        var _a = this, attributeOption = _a.attributeOption, labelOption = _a.labelOption, tooltipOption = _a.tooltipOption;
        // 获取图形属性上的 fields
        for (var attributeType in attributeOption) {
            if (attributeOption.hasOwnProperty(attributeType)) {
                var eachOpt = attributeOption[attributeType];
                if (eachOpt.fields) {
                    (0, helper_1.uniq)(eachOpt.fields, fields, tmpMap);
                }
                else if (eachOpt.values) {
                    // 考虑 size(10), shape('circle') 等场景
                    (0, helper_1.uniq)(eachOpt.values, fields, tmpMap);
                }
            }
        }
        // 获取 label 上的字段
        if (labelOption && labelOption.fields) {
            (0, helper_1.uniq)(labelOption.fields, fields, tmpMap);
        }
        // 获取 tooltip 上的字段
        if ((0, util_1.isObject)(tooltipOption) && tooltipOption.fields) {
            (0, helper_1.uniq)(tooltipOption.fields, fields, tmpMap);
        }
        return fields;
    };
    /**
     * 显示或者隐藏 geometry。
     * @param visible
     */
    Geometry.prototype.changeVisible = function (visible) {
        _super.prototype.changeVisible.call(this, visible);
        var elements = this.elements;
        for (var index = 0, length_3 = elements.length; index < length_3; index++) {
            var element = elements[index];
            element.changeVisible(visible);
        }
        if (visible) {
            if (this.container) {
                this.container.show();
            }
            if (this.labelsContainer) {
                this.labelsContainer.show();
            }
        }
        else {
            if (this.container) {
                this.container.hide();
            }
            if (this.labelsContainer) {
                this.labelsContainer.hide();
            }
        }
    };
    /**
     * 获得所有的字段
     */
    Geometry.prototype.getFields = function () {
        var uniqMap = new Map();
        var fields = [];
        Object.values(this.attributeOption).forEach(function (cfg) {
            var fs = (cfg === null || cfg === void 0 ? void 0 : cfg.fields) || [];
            fs.forEach(function (f) {
                if (!uniqMap.has(f)) {
                    fields.push(f);
                }
                uniqMap.set(f, true);
            });
        }, []);
        return fields;
    };
    /**
     * 获取当前配置中的所有分组 & 分类的字段。
     * @return fields string[]
     */
    Geometry.prototype.getGroupFields = function () {
        var groupFields = [];
        var tmpMap = new Map(); // 用于去重过滤
        for (var index = 0, length_4 = constant_1.GROUP_ATTRS.length; index < length_4; index++) {
            var attributeName = constant_1.GROUP_ATTRS[index];
            var cfg = this.attributeOption[attributeName];
            if (cfg && cfg.fields) {
                (0, helper_1.uniq)(cfg.fields, groupFields, tmpMap);
            }
        }
        return groupFields;
    };
    /**
     * 获得图形的 x y 字段。
     */
    Geometry.prototype.getXYFields = function () {
        var _a = tslib_1.__read(this.attributeOption.position.fields, 2), x = _a[0], y = _a[1];
        return [x, y];
    };
    /**
     * x 字段
     * @returns
     */
    Geometry.prototype.getXField = function () {
        return (0, util_1.get)(this.getXYFields(), [0]);
    };
    /**
     * y 字段
     * @returns
     */
    Geometry.prototype.getYField = function () {
        return (0, util_1.get)(this.getXYFields(), [1]);
    };
    /**
     * 获取该 Geometry 下所有生成的 shapes。
     * @returns shapes
     */
    Geometry.prototype.getShapes = function () {
        return this.elements.map(function (element) { return element.shape; });
    };
    /**
     * 获取虚拟 Group。
     * @returns
     */
    Geometry.prototype.getOffscreenGroup = function () {
        if (!this.offscreenGroup) {
            var GroupCtor = this.container.getGroupBase(); // 获取分组的构造函数
            this.offscreenGroup = new GroupCtor({});
        }
        return this.offscreenGroup;
    };
    // 对数据进行排序
    Geometry.prototype.sort = function (mappingArray) {
        if (!this.hasSorted) {
            // 未发生过排序
            var xScale_1 = this.getXScale();
            var xField_1 = xScale_1.field;
            for (var index = 0; index < mappingArray.length; index++) {
                var itemArr = mappingArray[index];
                itemArr.sort(function (obj1, obj2) {
                    return xScale_1.translate(obj1[constant_1.FIELD_ORIGIN][xField_1]) - xScale_1.translate(obj2[constant_1.FIELD_ORIGIN][xField_1]);
                });
            }
        }
        this.hasSorted = true;
    };
    /**
     * 调整度量范围。主要针对发生层叠以及一些特殊需求的 Geometry，比如 Interval 下的柱状图 Y 轴默认从 0 开始。
     */
    Geometry.prototype.adjustScale = function () {
        var yScale = this.getYScale();
        // 如果数据发生过 stack adjust，需要调整下 yScale 的数据范围
        if (yScale && this.getAdjust('stack')) {
            this.updateStackRange(yScale, this.beforeMappingData);
        }
    };
    /**
     * 获取当前 Geometry 对应的 Shape 工厂实例。
     */
    Geometry.prototype.getShapeFactory = function () {
        var shapeType = this.shapeType;
        if (!(0, base_2.getShapeFactory)(shapeType)) {
            return;
        }
        if (!this.shapeFactory) {
            this.shapeFactory = (0, util_1.clone)((0, base_2.getShapeFactory)(shapeType)); // 防止多个 view 共享一个 shapeFactory 实例，导致 coordinate 被篡改
        }
        // 因为这里缓存了 shapeFactory，但是外部可能会变更 coordinate，导致无法重新设置到 shapeFactory 中
        this.shapeFactory.coordinate = this.coordinate;
        // theme 原因同上
        this.shapeFactory.theme = this.theme.geometries[shapeType] || {};
        return this.shapeFactory;
    };
    /**
     * 获取每个 Shape 对应的关键点数据。
     * @param obj 经过分组 -> 数字化 -> adjust 调整后的数据记录
     * @returns
     */
    Geometry.prototype.createShapePointsCfg = function (obj) {
        var xScale = this.getXScale();
        var yScale = this.getYScale();
        var x = this.normalizeValues(obj[xScale.field], xScale);
        var y; // 存在没有 y 的情况
        if (yScale) {
            y = this.normalizeValues(obj[yScale.field], yScale);
        }
        else {
            y = obj.y ? obj.y : 0.1;
        }
        return {
            x: x,
            y: y,
            y0: yScale ? yScale.scale(this.getYMinValue()) : undefined,
        };
    };
    /**
     * 创建 Element 实例。
     * @param mappingDatum Element 对应的绘制数据
     * @param [isUpdate] 是否处于更新阶段
     * @returns element 返回创建的 Element 实例
     */
    Geometry.prototype.createElement = function (mappingDatum, index, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        var container = this.container;
        var shapeCfg = this.getDrawCfg(mappingDatum); // 获取绘制图形的配置信息
        var shapeFactory = this.getShapeFactory();
        var element = new element_1.default({
            shapeFactory: shapeFactory,
            container: container,
            offscreenGroup: this.getOffscreenGroup(),
            elementIndex: index,
        });
        element.animate = this.animateOption;
        element.geometry = this;
        element.draw(shapeCfg, isUpdate); // 绘制
        return element;
    };
    /**
     * 获取每条数据对应的图形绘制数据。
     * @param mappingDatum 映射后的数据
     * @returns draw cfg
     */
    Geometry.prototype.getDrawCfg = function (mappingDatum) {
        var originData = mappingDatum[constant_1.FIELD_ORIGIN]; // 原始数据
        var cfg = {
            mappingData: mappingDatum,
            data: originData,
            x: mappingDatum.x,
            y: mappingDatum.y,
            color: mappingDatum.color,
            size: mappingDatum.size,
            isInCircle: this.coordinate.isPolar,
            customInfo: this.customOption,
        };
        var shapeName = mappingDatum.shape;
        if (!shapeName && this.getShapeFactory()) {
            shapeName = this.getShapeFactory().defaultShapeType;
        }
        cfg.shape = shapeName;
        // 获取默认样式
        var theme = this.theme.geometries[this.shapeType];
        cfg.defaultStyle = (0, util_1.get)(theme, [shapeName, 'default'], {}).style;
        if (!cfg.defaultStyle && this.getShapeFactory()) {
            cfg.defaultStyle = this.getShapeFactory().getDefaultStyle(theme);
        }
        var styleOption = this.styleOption;
        if (styleOption) {
            cfg.style = this.getStyleCfg(styleOption, originData);
        }
        if (this.generatePoints) {
            cfg.points = mappingDatum.points;
            cfg.nextPoints = mappingDatum.nextPoints;
        }
        return cfg;
    };
    Geometry.prototype.updateElements = function (mappingDataArray, isUpdate) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (isUpdate === void 0) { isUpdate = false; }
        var keyDatum = new Map();
        var keys = [];
        // 用来保持 diff 元素之后 added, updated 的相对顺序
        var keyIndex = new Map();
        var index = 0;
        // 获得更新数据所有的 keys
        // 将更新的数据用 key 索引
        for (var i = 0; i < mappingDataArray.length; i++) {
            var mappingData = mappingDataArray[i];
            for (var j = 0; j < mappingData.length; j++) {
                var mappingDatum = mappingData[j];
                var key = this.getElementId(mappingDatum);
                var finalKey = keyDatum.has(key) ? "".concat(key, "-").concat(i, "-").concat(j) : key;
                keys.push(finalKey);
                keyDatum.set(finalKey, mappingDatum);
                keyIndex.set(finalKey, index);
                index++;
            }
        }
        this.elements = new Array(index);
        var _d = (0, diff_1.diff)(this.lastElementsMap, keys), added = _d.added, updated = _d.updated, removed = _d.removed;
        try {
            // 新建 element
            for (var added_1 = tslib_1.__values(added), added_1_1 = added_1.next(); !added_1_1.done; added_1_1 = added_1.next()) {
                var key = added_1_1.value;
                var mappingDatum = keyDatum.get(key);
                var i = keyIndex.get(key);
                var element = this.createElement(mappingDatum, i, isUpdate);
                this.elements[i] = element;
                this.elementsMap[key] = element;
                if (element.shape) {
                    element.shape.set('zIndex', this.zIndexReversed ? this.elements.length - i : i);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (added_1_1 && !added_1_1.done && (_a = added_1.return)) _a.call(added_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // 更新 element
            for (var updated_1 = tslib_1.__values(updated), updated_1_1 = updated_1.next(); !updated_1_1.done; updated_1_1 = updated_1.next()) {
                var key = updated_1_1.value;
                var element = this.lastElementsMap[key];
                var mappingDatum = keyDatum.get(key);
                var currentShapeCfg = this.getDrawCfg(mappingDatum);
                var preShapeCfg = element.getModel();
                var i = keyIndex.get(key);
                if (this.isCoordinateChanged || (0, is_model_change_1.isModelChange)(currentShapeCfg, preShapeCfg)) {
                    element.animate = this.animateOption;
                    // 通过绘制数据的变更来判断是否需要更新，因为用户有可能会修改图形属性映射
                    element.update(currentShapeCfg); // 更新对应的 element
                }
                this.elements[i] = element;
                this.elementsMap[key] = element;
                if (element.shape) {
                    element.shape.set('zIndex', this.zIndexReversed ? this.elements.length - i : i);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (updated_1_1 && !updated_1_1.done && (_b = updated_1.return)) _b.call(updated_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // 全部 setZIndex 之后，再执行 sort
        if (this.container) {
            this.container.sort();
        }
        try {
            // 销毁被删除的 elements
            for (var removed_1 = tslib_1.__values(removed), removed_1_1 = removed_1.next(); !removed_1_1.done; removed_1_1 = removed_1.next()) {
                var key = removed_1_1.value;
                var element = this.lastElementsMap[key];
                // 更新动画配置，用户有可能在更新之前有对动画进行配置操作
                element.animate = this.animateOption;
                element.destroy();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (removed_1_1 && !removed_1_1.done && (_c = removed_1.return)) _c.call(removed_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    /**
     * 获取渲染的 label 类型。
     */
    Geometry.prototype.getLabelType = function () {
        var _a = this, labelOption = _a.labelOption, coordinate = _a.coordinate, type = _a.type;
        var coordinateType = coordinate.type, isTransposed = coordinate.isTransposed;
        var labelType = (0, util_1.get)(labelOption, ['cfg', 'type']);
        if (!labelType) {
            // 用户未定义，则进行默认的逻辑
            if (coordinateType === 'polar') {
                // 极坐标下使用通用的极坐标文本，转置则使用饼图
                labelType = isTransposed ? 'pie' : 'polar';
            }
            else if (coordinateType === 'theta') {
                // theta 坐标系下使用饼图文本
                labelType = 'pie';
            }
            else if (type === 'interval' || type === 'polygon') {
                labelType = 'interval';
            }
            else {
                labelType = 'base';
            }
        }
        return labelType;
    };
    /**
     * 获取 Y 轴上的最小值。
     */
    Geometry.prototype.getYMinValue = function () {
        var yScale = this.getYScale();
        var min = yScale.min, max = yScale.max;
        var value;
        if (min >= 0) {
            value = min;
        }
        else if (max <= 0) {
            // 当值全位于负区间时，需要保证 ymin 在区域内，不可为 0
            value = max;
        }
        else {
            value = 0;
        }
        return value;
    };
    // 创建图形属性相关的配置项
    Geometry.prototype.createAttrOption = function (attrName, field, cfg) {
        if ((0, util_1.isNil)(field) || (0, util_1.isObject)(field)) {
            if ((0, util_1.isObject)(field) && (0, util_1.isEqual)(Object.keys(field), ['values'])) {
                // shape({ values: [ 'funnel' ] })
                (0, util_1.set)(this.attributeOption, attrName, {
                    fields: field.values,
                });
            }
            else {
                (0, util_1.set)(this.attributeOption, attrName, field);
            }
        }
        else {
            var attrCfg = {};
            if ((0, util_1.isNumber)(field)) {
                // size(3)
                attrCfg.values = [field];
            }
            else {
                attrCfg.fields = (0, parse_fields_1.parseFields)(field);
            }
            if (cfg) {
                if ((0, util_1.isFunction)(cfg)) {
                    attrCfg.callback = cfg;
                }
                else {
                    attrCfg.values = cfg;
                }
            }
            (0, util_1.set)(this.attributeOption, attrName, attrCfg);
        }
    };
    Geometry.prototype.initAttributes = function () {
        var _this = this;
        var _a = this, attributes = _a.attributes, attributeOption = _a.attributeOption, theme = _a.theme, shapeType = _a.shapeType;
        this.groupScales = [];
        var tmpMap = {};
        var _loop_1 = function (attrType) {
            if (attributeOption.hasOwnProperty(attrType)) {
                var option = attributeOption[attrType];
                if (!option) {
                    return { value: void 0 };
                }
                var attrCfg = tslib_1.__assign({}, option);
                var callback = attrCfg.callback, values = attrCfg.values, _b = attrCfg.fields, fields = _b === void 0 ? [] : _b;
                // 获取每一个字段对应的 scale
                var scales = fields.map(function (field) {
                    var scale = _this.scales[field];
                    if (!tmpMap[field] && constant_1.GROUP_ATTRS.includes(attrType)) {
                        var inferedScaleType = (0, scale_1.inferScaleType)(scale, (0, util_1.get)(_this.scaleDefs, field), attrType, _this.type);
                        if (inferedScaleType === 'cat') {
                            _this.groupScales.push(scale);
                            tmpMap[field] = true;
                        }
                    }
                    return scale;
                });
                attrCfg.scales = scales;
                if (attrType !== 'position' && scales.length === 1 && scales[0].type === 'identity') {
                    // 用户在图形通道上声明了常量字段 color('red'), size(5)
                    attrCfg.values = scales[0].values;
                }
                else if (!callback && !values) {
                    // 用户没有指定任何规则，则使用默认的映射规则
                    if (attrType === 'size') {
                        attrCfg.values = theme.sizes;
                    }
                    else if (attrType === 'shape') {
                        attrCfg.values = theme.shapes[shapeType] || [];
                    }
                    else if (attrType === 'color') {
                        if (scales.length) {
                            // 根据数值个数使用对应的色板
                            attrCfg.values = scales[0].values.length <= 10 ? theme.colors10 : theme.colors20;
                        }
                        else {
                            attrCfg.values = theme.colors10;
                        }
                    }
                }
                var AttributeCtor = (0, attr_1.getAttribute)(attrType);
                attributes[attrType] = new AttributeCtor(attrCfg);
            }
        };
        // 遍历每一个 attrOption，各自创建 Attribute 实例
        for (var attrType in attributeOption) {
            var state_1 = _loop_1(attrType);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    // 处理数据：分组 -> 数字化 -> adjust 调整
    Geometry.prototype.processData = function (data) {
        var e_4, _a;
        this.hasSorted = false;
        var scales = this.getAttribute('position').scales;
        var categoryScales = scales.filter(function (scale) { return scale.isCategory; });
        var groupedArray = this.groupData(data); // 数据分组
        var beforeAdjust = [];
        for (var i = 0, len = groupedArray.length; i < len; i++) {
            var subData = groupedArray[i];
            var arr = [];
            for (var j = 0, subLen = subData.length; j < subLen; j++) {
                var originData = subData[j];
                var item = {};
                // tslint:disable-next-line: forin
                for (var k in originData) {
                    item[k] = originData[k];
                }
                item[constant_1.FIELD_ORIGIN] = originData;
                try {
                    // 将分类数据翻译成数据, 仅对位置相关的度量进行数字化处理
                    for (var categoryScales_1 = (e_4 = void 0, tslib_1.__values(categoryScales)), categoryScales_1_1 = categoryScales_1.next(); !categoryScales_1_1.done; categoryScales_1_1 = categoryScales_1.next()) {
                        var scale = categoryScales_1_1.value;
                        var field = scale.field;
                        item[field] = scale.translate(item[field]);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (categoryScales_1_1 && !categoryScales_1_1.done && (_a = categoryScales_1.return)) _a.call(categoryScales_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                arr.push(item);
            }
            beforeAdjust.push(arr);
        }
        var dataArray = this.adjustData(beforeAdjust); // 进行 adjust 数据调整
        this.beforeMappingData = dataArray;
        return dataArray;
    };
    // 调整数据
    Geometry.prototype.adjustData = function (dataArray) {
        var adjustOption = this.adjustOption;
        var _a = this, intervalPadding = _a.intervalPadding, dodgePadding = _a.dodgePadding, theme = _a.theme;
        // 兼容theme配置
        var maxColumnWidth = this.maxColumnWidth || theme.maxColumnWidth;
        var minColumnWidth = this.minColumnWidth || theme.minColumnWidth;
        var columnWidthRatio = this.columnWidthRatio || theme.columnWidthRatio;
        var result = dataArray;
        if (adjustOption) {
            var xScale_2 = this.getXScale();
            var yScale = this.getYScale();
            var xField = xScale_2.field;
            var yField = yScale ? yScale.field : null;
            var xDimensionLength = (0, coordinate_1.getXDimensionLength)(this.coordinate);
            var groupNum = xScale_2.values.length;
            // 传入size计算相关参数，默认宽度、最大最小宽度约束
            var sizeAttr = this.getAttribute('size');
            var defaultSize = void 0;
            if (sizeAttr) {
                defaultSize = sizeAttr.values[0];
            }
            for (var i = 0, len = adjustOption.length; i < len; i++) {
                var adjust = adjustOption[i];
                var adjustCfg = tslib_1.__assign({ xField: xField, yField: yField, intervalPadding: intervalPadding, dodgePadding: dodgePadding, xDimensionLength: xDimensionLength, groupNum: groupNum, defaultSize: defaultSize, maxColumnWidth: maxColumnWidth, minColumnWidth: minColumnWidth, columnWidthRatio: columnWidthRatio }, adjust);
                var type = adjust.type;
                if (type === 'dodge') {
                    var adjustNames = [];
                    if (xScale_2.isCategory || xScale_2.type === 'identity') {
                        adjustNames.push('x');
                    }
                    else if (!yScale) {
                        adjustNames.push('y');
                    }
                    else {
                        throw new Error('dodge is not support linear attribute, please use category attribute!');
                    }
                    adjustCfg.adjustNames = adjustNames;
                    // 每个分组内每条柱子的宽度占比，用户不可指定，用户需要通过 columnWidthRatio 指定
                    // 兼容theme配置
                    adjustCfg.dodgeRatio = columnWidthRatio;
                }
                else if (type === 'stack') {
                    var coordinate = this.coordinate;
                    if (!yScale) {
                        // 一维的情况下获取高度和默认size
                        adjustCfg.height = coordinate.getHeight();
                        var size = this.getDefaultValue('size') || 3;
                        adjustCfg.size = size;
                    }
                    // 不进行 transpose 时，用户又没有设置这个参数时，默认从上向下
                    if (!coordinate.isTransposed && (0, util_1.isNil)(adjustCfg.reverseOrder)) {
                        adjustCfg.reverseOrder = true;
                    }
                }
                var adjustCtor = (0, adjust_1.getAdjust)(type);
                adjustCfg.dimValuesMap = {};
                //生成dimValuesMap
                if (xScale_2 && xScale_2.values) {
                    adjustCfg.dimValuesMap[xScale_2.field] = xScale_2.values.map(function (v) { return xScale_2.translate(v); });
                }
                var adjustInstance = new adjustCtor(adjustCfg);
                result = adjustInstance.process(result);
                this.adjusts[type] = adjustInstance;
            }
        }
        return result;
    };
    // 对数据进行分组
    Geometry.prototype.groupData = function (data) {
        var groupScales = this.getGroupScales();
        var scaleDefs = this.scaleDefs;
        var appendConditions = {};
        var groupFields = [];
        for (var index = 0; index < groupScales.length; index++) {
            var scale = groupScales[index];
            var field = scale.field;
            groupFields.push(field);
            if ((0, util_1.get)(scaleDefs, [field, 'values'])) {
                // 用户通过 view.scale() 接口指定了 values 属性
                appendConditions[field] = scaleDefs[field].values;
            }
        }
        return (0, group_data_1.group)(data, groupFields, appendConditions);
    };
    // 更新发生层叠后的数据对应的度量范围
    Geometry.prototype.updateStackRange = function (scale, dataArray) {
        var mergeArray = (0, util_1.flatten)(dataArray);
        var field = scale.field;
        var min = scale.min;
        var max = scale.max;
        for (var index = 0; index < mergeArray.length; index++) {
            var obj = mergeArray[index];
            var tmpMin = Math.min.apply(null, obj[field]);
            var tmpMax = Math.max.apply(null, obj[field]);
            if (tmpMin < min) {
                min = tmpMin;
            }
            if (tmpMax > max) {
                max = tmpMax;
            }
        }
        var scaleDefs = this.scaleDefs;
        var cfg = {};
        if (min < scale.min && !(0, util_1.get)(scaleDefs, [field, 'min'])) {
            // 用户如果在列定义中定义了 min，则以用户定义的为准
            cfg.min = min;
        }
        if (max > scale.max && !(0, util_1.get)(scaleDefs, [field, 'max'])) {
            // 用户如果在列定义中定义了 max
            cfg.max = max;
        }
        scale.change(cfg);
    };
    // 将数据映射至图形空间前的操作：排序以及关键点的生成
    Geometry.prototype.beforeMapping = function (beforeMappingData) {
        // 当初加 clone 是因为 points 的引用关系，导致更新失败，可是现在貌似复现不出来了，所以暂时不进行 clone
        // const source = clone(beforeMappingData);
        var source = beforeMappingData;
        if (this.sortable) {
            this.sort(source);
        }
        if (this.generatePoints) {
            // 需要生成关键点
            for (var index = 0, length_5 = source.length; index < length_5; index++) {
                var currentData = source[index];
                this.generateShapePoints(currentData);
                var nextData = source[index + 1];
                if (nextData) {
                    this.generateShapePoints(nextData);
                    currentData[0].nextPoints = nextData[0].points;
                }
            }
        }
        return source;
    };
    // 生成 shape 的关键点
    Geometry.prototype.generateShapePoints = function (data) {
        var shapeFactory = this.getShapeFactory();
        var shapeAttr = this.getAttribute('shape');
        for (var index = 0; index < data.length; index++) {
            var obj = data[index];
            var cfg = this.createShapePointsCfg(obj);
            var shape = shapeAttr ? this.getAttributeValues(shapeAttr, obj) : null;
            var points = shapeFactory.getShapePoints(shape, cfg);
            obj.points = points;
        }
    };
    // 将数据归一化
    Geometry.prototype.normalizeValues = function (values, scale) {
        var rst = [];
        if ((0, util_1.isArray)(values)) {
            for (var index = 0; index < values.length; index++) {
                var value = values[index];
                rst.push(scale.scale(value));
            }
        }
        else {
            rst = scale.scale(values);
        }
        return rst;
    };
    // 将数据映射至图形空间
    Geometry.prototype.mapping = function (data) {
        var attributes = this.attributes;
        var mappingData = [];
        for (var index = 0; index < data.length; index++) {
            var record = data[index];
            var newRecord = {
                _origin: record[constant_1.FIELD_ORIGIN],
                points: record.points,
                nextPoints: record.nextPoints,
            };
            for (var k in attributes) {
                if (attributes.hasOwnProperty(k)) {
                    var attr = attributes[k];
                    var names = attr.names;
                    var values = this.getAttributeValues(attr, record);
                    if (names.length > 1) {
                        // position 之类的生成多个字段的属性
                        for (var j = 0; j < values.length; j += 1) {
                            var val = values[j];
                            var name_1 = names[j];
                            newRecord[name_1] = (0, util_1.isArray)(val) && val.length === 1 ? val[0] : val; // 只有一个值时返回第一个属性值
                        }
                    }
                    else {
                        // values.length === 1 的判断是以下情况，获取用户设置的图形属性值
                        // shape('a', ['dot', 'dash']), color('a', ['red', 'yellow'])
                        newRecord[names[0]] = values.length === 1 ? values[0] : values;
                    }
                }
            }
            this.convertPoint(newRecord); // 将 x、y 转换成画布坐标
            mappingData.push(newRecord);
        }
        return mappingData;
    };
    // 将归一化的坐标值转换成画布坐标
    Geometry.prototype.convertPoint = function (mappingRecord) {
        var x = mappingRecord.x, y = mappingRecord.y;
        var rstX;
        var rstY;
        var obj;
        var coordinate = this.coordinate;
        if ((0, util_1.isArray)(x) && (0, util_1.isArray)(y)) {
            rstX = [];
            rstY = [];
            for (var i = 0, j = 0, xLen = x.length, yLen = y.length; i < xLen && j < yLen; i += 1, j += 1) {
                obj = coordinate.convert({
                    x: x[i],
                    y: y[j],
                });
                rstX.push(obj.x);
                rstY.push(obj.y);
            }
        }
        else if ((0, util_1.isArray)(y)) {
            rstY = [];
            for (var index = 0; index < y.length; index++) {
                var yVal = y[index];
                obj = coordinate.convert({
                    x: x,
                    y: yVal,
                });
                if (rstX && rstX !== obj.x) {
                    if (!(0, util_1.isArray)(rstX)) {
                        rstX = [rstX];
                    }
                    rstX.push(obj.x);
                }
                else {
                    rstX = obj.x;
                }
                rstY.push(obj.y);
            }
        }
        else if ((0, util_1.isArray)(x)) {
            rstX = [];
            for (var index = 0; index < x.length; index++) {
                var xVal = x[index];
                obj = coordinate.convert({
                    x: xVal,
                    y: y,
                });
                if (rstY && rstY !== obj.y) {
                    if (!(0, util_1.isArray)(rstY)) {
                        rstY = [rstY];
                    }
                    rstY.push(obj.y);
                }
                else {
                    rstY = obj.y;
                }
                rstX.push(obj.x);
            }
        }
        else {
            var point = coordinate.convert({
                x: x,
                y: y,
            });
            rstX = point.x;
            rstY = point.y;
        }
        mappingRecord.x = rstX;
        mappingRecord.y = rstY;
    };
    // 获取 style 配置
    Geometry.prototype.getStyleCfg = function (styleOption, originData) {
        var _a = styleOption.fields, fields = _a === void 0 ? [] : _a, callback = styleOption.callback, cfg = styleOption.cfg;
        if (cfg) {
            // 用户直接配置样式属性
            return cfg;
        }
        var params = fields.map(function (field) {
            return originData[field];
        });
        return callback.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(params), false));
    };
    Geometry.prototype.setCfg = function (cfg) {
        var _this = this;
        var coordinate = cfg.coordinate, data = cfg.data, theme = cfg.theme, scaleDefs = cfg.scaleDefs;
        if (coordinate) {
            this.coordinate = coordinate;
        }
        if (data) {
            this.data = data;
        }
        if (scaleDefs) {
            this.scaleDefs = scaleDefs;
            this.idFields = [];
            (0, util_1.each)(scaleDefs, function (scaleDef, field) {
                if (scaleDef && scaleDef.key) {
                    _this.idFields.push(field);
                }
            });
        }
        if (theme) {
            this.theme = this.userTheme ? (0, util_1.deepMix)({}, theme, this.userTheme) : theme; // 支持 geometry 层级的主题设置
        }
    };
    Geometry.prototype.renderLabels = function (mappingArray, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var geometryLabel, labelType, GeometryLabelsCtor, labelsMap, elementLabels, _a, _b, _c, element, labels;
            var e_5, _d;
            var _this = this;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        geometryLabel = this.geometryLabel;
                        this.emit(constant_1.GEOMETRY_LIFE_CIRCLE.BEFORE_RENDER_LABEL);
                        if (!geometryLabel) {
                            labelType = this.getLabelType();
                            GeometryLabelsCtor = (0, label_1.getGeometryLabel)(labelType);
                            geometryLabel = new GeometryLabelsCtor(this);
                            this.geometryLabel = geometryLabel;
                        }
                        return [4 /*yield*/, geometryLabel.render(mappingArray, isUpdate)];
                    case 1:
                        _e.sent();
                        labelsMap = geometryLabel.labelsRenderer.shapesMap;
                        elementLabels = new Map();
                        (0, util_1.each)(labelsMap, function (labelGroup, labelGroupId) {
                            var labelChildren = labelGroup.getChildren() || [];
                            for (var j = 0; j < labelChildren.length; j++) {
                                var labelShape = labelChildren[j];
                                var element = _this.elementsMap[labelShape.get('elementId') || labelGroupId.split(' ')[0]];
                                if (element) {
                                    labelShape.cfg.name = ['element', 'label'];
                                    labelShape.cfg.element = element;
                                    var labels = elementLabels.get(element) || new Set();
                                    labels.add(labelGroup);
                                    elementLabels.set(element, labels);
                                }
                            }
                        });
                        try {
                            for (_a = tslib_1.__values(elementLabels.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                _c = tslib_1.__read(_b.value, 2), element = _c[0], labels = _c[1];
                                element.labelShape = tslib_1.__spreadArray([], tslib_1.__read(labels), false);
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        this.emit(constant_1.GEOMETRY_LIFE_CIRCLE.AFTER_RENDER_LABEL);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 是否需要进行群组入场动画
     * 规则：
     * 1. 如果发生更新，则不进行
     * 2. 如果用户关闭 geometry 动画，则不进行
     * 3. 如果用户关闭了 appear 动画，则不进行
     * 4. 如果用户配置了 appear.animation，则不进行
     */
    Geometry.prototype.canDoGroupAnimation = function (isUpdate) {
        return (!isUpdate &&
            this.animateOption &&
            ((0, util_1.get)(this.animateOption, 'appear') === undefined ||
                ((0, util_1.get)(this.animateOption, 'appear') && (0, util_1.get)(this.animateOption, ['appear', 'animation']) === undefined)));
    };
    return Geometry;
}(base_1.default));
exports.default = Geometry;
//# sourceMappingURL=base.js.map