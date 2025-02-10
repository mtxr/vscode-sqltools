"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeFactory = exports.registerShape = exports.registerShapeFactory = void 0;
var tslib_1 = require("tslib");
var path_util_1 = require("@antv/path-util");
var util_1 = require("@antv/util");
var path_1 = require("./util/path");
/** ShapeFactory 基类 */
var ShapeFactoryBase = {
    /** 坐标系对象 */
    coordinate: null,
    /** 默认绘制的 Shape 类型 */
    defaultShapeType: null,
    /** 主题样式 */
    theme: null,
    /**
     * 获取 shape 绘制需要的关键点
     * @param shapeType shape 类型
     * @param shapePoint 每条数据映射后的坐标点以及 size 数值
     * @returns 图形关键点信息
     */
    getShapePoints: function (shapeType, shapePoint) {
        var shape = this.getShape(shapeType);
        if (shape.getPoints) {
            return shape.getPoints(shapePoint);
        }
        return this.getDefaultPoints(shapePoint);
    },
    /**
     * 根据 shape 类型获取具体的 shape 实例
     * @param shapeType string shape 的类型
     * @returns
     */
    getShape: function (shapeType) {
        var shape = this[shapeType] || this[this.defaultShapeType];
        shape.coordinate = this.coordinate;
        return shape;
    },
    /**
     * 获取 shape 的默认关键点
     * @override
     */
    getDefaultPoints: function () {
        return [];
    },
    /**
     * 获取 shape 的默认绘制样式 (内置的 shapeFactory 均有注册默认样式)
     */
    getDefaultStyle: function (geometryTheme) {
        return (0, util_1.get)(geometryTheme, [this.defaultShapeType, 'default', 'style'], {});
    },
    /**
     * 获取 shape 对应的缩略图配置信息。
     * @param shapeType shape 类型
     * @param color 颜色
     * @param isInPolar 是否在极坐标系下
     * @returns 返回缩略图 marker 配置。
     */
    getMarker: function (shapeType, markerCfg) {
        var shape = this.getShape(shapeType);
        if (!shape.getMarker) {
            var defaultShapeType = this.defaultShapeType;
            shape = this.getShape(defaultShapeType);
        }
        var theme = this.theme;
        var shapeStyle = (0, util_1.get)(theme, [shapeType, 'default'], {});
        var markerStyle = shape.getMarker(markerCfg);
        return (0, util_1.deepMix)({}, shapeStyle, markerStyle);
    },
    /**
     * 绘制 shape
     * @override
     * @param shapeType 绘制的 shape 类型
     * @param cfg 绘制 shape 需要的信息
     * @param element Element 实例
     * @returns
     */
    drawShape: function (shapeType, cfg, container) {
        var shape = this.getShape(shapeType);
        return shape.draw(cfg, container);
    },
};
/** Shape 基类 */
var ShapeBase = {
    /** 坐标系对象 */
    coordinate: null,
    /**
     * 将归一化的 path 转换成坐标系下的 path
     * @param path 归一化的路径
     * @returns
     */
    parsePath: function (path) {
        var coordinate = this.coordinate;
        var parsedPath = (0, path_util_1.parsePathString)(path);
        if (coordinate.isPolar) {
            parsedPath = (0, path_1.convertPolarPath)(coordinate, parsedPath);
        }
        else {
            parsedPath = (0, path_1.convertNormalPath)(coordinate, parsedPath);
        }
        return parsedPath;
    },
    /**
     * 将归一化的坐标转换成画布坐标
     * @param point 归一化的坐标点数据
     * @returns
     */
    parsePoint: function (point) {
        var coordinate = this.coordinate;
        return coordinate.convert(point);
    },
    /**
     * 0～1 points 转 画布 points
     * @param points 节点集合
     * @returns
     */
    parsePoints: function (points) {
        var coordinate = this.coordinate;
        return points.map(function (point) {
            return coordinate.convert(point);
        });
    },
    /**
     * 绘制 shape
     * @override
     */
    draw: function (cfg, container) { },
};
var ShapeFactoryMap = {};
/**
 * 注册 ShapeFactory。
 * @param factoryName  ShapeFactory 名称，对应 Geometry 几何标记名称。
 * @param cfg 注册 ShapeFactory 需要覆写定义的属性。
 * @returns 返回 ShapeFactory 对象。
 */
function registerShapeFactory(factoryName, cfg) {
    var className = (0, util_1.upperFirst)(factoryName);
    var geomObj = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, ShapeFactoryBase), cfg), { geometryType: factoryName });
    ShapeFactoryMap[className] = geomObj;
    return geomObj;
}
exports.registerShapeFactory = registerShapeFactory;
/**
 * 注册 Shape。
 * @param factoryName 对应的 ShapeFactory 名称。
 * @param shapeType 注册的 shape 名称。
 * @param cfg 注册 Shape 需要覆写定义的属性。
 * @returns shape 返回注册的 shape 对象。
 */
function registerShape(factoryName, shapeType, cfg) {
    var className = (0, util_1.upperFirst)(factoryName);
    var factory = ShapeFactoryMap[className];
    var shapeObj = tslib_1.__assign(tslib_1.__assign({}, ShapeBase), cfg);
    factory[shapeType] = shapeObj;
    return shapeObj;
}
exports.registerShape = registerShape;
/**
 * 获取 factoryName 对应的 shapeFactory
 * @param factoryName
 * @returns shape factory
 */
function getShapeFactory(factoryName) {
    var className = (0, util_1.upperFirst)(factoryName);
    return ShapeFactoryMap[className];
}
exports.getShapeFactory = getShapeFactory;
//# sourceMappingURL=base.js.map