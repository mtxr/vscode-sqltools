import { __spreadArray } from "tslib";
import { ext, mat3, vec3 } from '@antv/matrix-util';
import { assign } from '@antv/util';
/**
 * Coordinate Base Class
 */
var Coordinate = /** @class */ (function () {
    function Coordinate(cfg) {
        // 自身属性
        this.type = 'coordinate';
        this.isRect = false;
        this.isHelix = false;
        this.isPolar = false;
        this.isReflectX = false;
        this.isReflectY = false;
        var start = cfg.start, end = cfg.end, _a = cfg.matrix, matrix = _a === void 0 ? [1, 0, 0, 0, 1, 0, 0, 0, 1] : _a, _b = cfg.isTransposed, isTransposed = _b === void 0 ? false : _b;
        this.start = start;
        this.end = end;
        this.matrix = matrix;
        this.originalMatrix = __spreadArray([], matrix); // 去除引用
        this.isTransposed = isTransposed;
    }
    /**
     * 初始化流程
     */
    Coordinate.prototype.initial = function () {
        // center、width、height
        this.center = {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2,
        };
        this.width = Math.abs(this.end.x - this.start.x);
        this.height = Math.abs(this.end.y - this.start.y);
    };
    /**
     * 更新配置
     * @param cfg
     */
    Coordinate.prototype.update = function (cfg) {
        assign(this, cfg);
        this.initial();
    };
    Coordinate.prototype.convertDim = function (percent, dim) {
        var _a;
        var _b = this[dim], start = _b.start, end = _b.end;
        // 交换
        if (this.isReflect(dim)) {
            _a = [end, start], start = _a[0], end = _a[1];
        }
        return start + percent * (end - start);
    };
    Coordinate.prototype.invertDim = function (value, dim) {
        var _a;
        var _b = this[dim], start = _b.start, end = _b.end;
        // 交换
        if (this.isReflect(dim)) {
            _a = [end, start], start = _a[0], end = _a[1];
        }
        return (value - start) / (end - start);
    };
    /**
     * 将坐标点进行矩阵变换
     * @param x   对应 x 轴画布坐标
     * @param y   对应 y 轴画布坐标
     * @param tag 默认为 0，可取值 0, 1
     * @return    返回变换后的三阶向量 [x, y, z]
     */
    Coordinate.prototype.applyMatrix = function (x, y, tag) {
        if (tag === void 0) { tag = 0; }
        var matrix = this.matrix;
        var vector = [x, y, tag];
        vec3.transformMat3(vector, vector, matrix);
        return vector;
    };
    /**
     * 将坐标点进行矩阵逆变换
     * @param x   对应 x 轴画布坐标
     * @param y   对应 y 轴画布坐标
     * @param tag 默认为 0，可取值 0, 1
     * @return    返回矩阵逆变换后的三阶向量 [x, y, z]
     */
    Coordinate.prototype.invertMatrix = function (x, y, tag) {
        if (tag === void 0) { tag = 0; }
        var matrix = this.matrix;
        var inverted = mat3.invert([0, 0, 0, 0, 0, 0, 0, 0, 0], matrix);
        var vector = [x, y, tag];
        if (inverted) {
            // 如果为空则不进行矩阵变化，防止报错
            vec3.transformMat3(vector, vector, inverted);
        }
        return vector;
    };
    /**
     * 将归一化的坐标点数据转换为画布坐标，并根据坐标系当前矩阵进行变换
     * @param point 归一化的坐标点
     * @return      返回进行矩阵变换后的画布坐标
     */
    Coordinate.prototype.convert = function (point) {
        var _a = this.convertPoint(point), x = _a.x, y = _a.y;
        var vector = this.applyMatrix(x, y, 1);
        return {
            x: vector[0],
            y: vector[1],
        };
    };
    /**
     * 将进行过矩阵变换画布坐标转换为归一化坐标
     * @param point 画布坐标
     * @return      返回归一化的坐标点
     */
    Coordinate.prototype.invert = function (point) {
        var vector = this.invertMatrix(point.x, point.y, 1);
        return this.invertPoint({
            x: vector[0],
            y: vector[1],
        });
    };
    /**
     * 坐标系旋转变换
     * @param  radian 旋转弧度
     * @return        返回坐标系对象
     */
    Coordinate.prototype.rotate = function (radian) {
        var matrix = this.matrix;
        var center = this.center;
        ext.leftTranslate(matrix, matrix, [-center.x, -center.y]);
        ext.leftRotate(matrix, matrix, radian);
        ext.leftTranslate(matrix, matrix, [center.x, center.y]);
        return this;
    };
    /**
     * 坐标系反射变换
     * @param dim 反射维度
     * @return    返回坐标系对象
     */
    Coordinate.prototype.reflect = function (dim) {
        if (dim === 'x') {
            this.isReflectX = !this.isReflectX;
        }
        else {
            this.isReflectY = !this.isReflectY;
        }
        return this;
    };
    /**
     * 坐标系比例变换
     * @param s1 x 方向缩放比例
     * @param s2 y 方向缩放比例
     * @return     返回坐标系对象
     */
    Coordinate.prototype.scale = function (s1, s2) {
        var matrix = this.matrix;
        var center = this.center;
        ext.leftTranslate(matrix, matrix, [-center.x, -center.y]);
        ext.leftScale(matrix, matrix, [s1, s2]);
        ext.leftTranslate(matrix, matrix, [center.x, center.y]);
        return this;
    };
    /**
     * 坐标系平移变换
     * @param x x 方向平移像素
     * @param y y 方向平移像素
     * @return    返回坐标系对象
     */
    Coordinate.prototype.translate = function (x, y) {
        var matrix = this.matrix;
        ext.leftTranslate(matrix, matrix, [x, y]);
        return this;
    };
    /**
     * 将坐标系 x y 两个轴进行转置
     * @return 返回坐标系对象
     */
    Coordinate.prototype.transpose = function () {
        this.isTransposed = !this.isTransposed;
        return this;
    };
    Coordinate.prototype.getCenter = function () {
        return this.center;
    };
    Coordinate.prototype.getWidth = function () {
        return this.width;
    };
    Coordinate.prototype.getHeight = function () {
        return this.height;
    };
    Coordinate.prototype.getRadius = function () {
        return this.radius;
    };
    /**
     * whether has reflect
     * @param dim
     */
    Coordinate.prototype.isReflect = function (dim) {
        return dim === 'x' ? this.isReflectX : this.isReflectY;
    };
    /**
     * 重置 matrix
     * @param matrix 如果传入，则使用，否则使用构造函数中传入的默认 matrix
     */
    Coordinate.prototype.resetMatrix = function (matrix) {
        // 去除引用关系
        this.matrix = matrix ? matrix : __spreadArray([], this.originalMatrix);
    };
    return Coordinate;
}());
export default Coordinate;
//# sourceMappingURL=base.js.map