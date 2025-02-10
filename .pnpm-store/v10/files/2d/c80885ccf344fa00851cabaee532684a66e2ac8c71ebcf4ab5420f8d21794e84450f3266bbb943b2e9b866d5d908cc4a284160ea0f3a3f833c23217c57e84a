"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var dependents_1 = require("../../dependents");
/**
 * coordinate controller，职责：
 * 1. 创建实例
 * 2. 暂存配置
 */
var CoordinateController = /** @class */ (function () {
    function CoordinateController(option) {
        // 设置默认值，并存储配置
        this.option = this.wrapperOption(option);
    }
    /**
     * 更新配置
     * @param option
     */
    CoordinateController.prototype.update = function (option) {
        this.option = this.wrapperOption(option);
        return this;
    };
    /**
     * 是否存在某一个 action
     * @param actionName
     */
    CoordinateController.prototype.hasAction = function (actionName) {
        var actions = this.option.actions;
        return (0, util_1.some)(actions, function (action) { return action[0] === actionName; });
    };
    /**
     * 创建坐标系对象
     * @param start 起始位置
     * @param end   结束位置
     * @return 坐标系实例
     */
    CoordinateController.prototype.create = function (start, end) {
        var _a = this.option, type = _a.type, cfg = _a.cfg;
        var isTheta = type === 'theta';
        // 1. 起始位置
        var props = tslib_1.__assign({ start: start, end: end }, cfg);
        // 2. 创建实例
        var C = (0, dependents_1.getCoordinate)(isTheta ? 'polar' : type);
        this.coordinate = new C(props);
        // @ts-ignore FIXME coordinate 包问题导致 type 不正确
        this.coordinate.type = type;
        // 3. 添加默认 action
        if (isTheta) {
            // 不存在 transpose，为其自动设置一个 action
            if (!this.hasAction('transpose')) {
                this.transpose();
            }
        }
        // 4. 执行 action
        this.execActions();
        return this.coordinate;
    };
    /**
     * 更新坐标系对象
     * @param start 起始位置
     * @param end   结束位置
     * @return 坐标系实例
     */
    CoordinateController.prototype.adjust = function (start, end) {
        this.coordinate.update({
            start: start,
            end: end,
        });
        // 更新坐标系大小的时候，需要：
        // 1. 重置 matrix
        // 2. 重新执行作用于 matrix 的 action
        this.coordinate.resetMatrix();
        this.execActions(['scale', 'rotate', 'translate']);
        return this.coordinate;
    };
    /**
     * 旋转弧度
     * @param angle
     */
    CoordinateController.prototype.rotate = function (angle) {
        this.option.actions.push(['rotate', angle]);
        return this;
    };
    /**
     * 镜像
     * @param dim
     */
    CoordinateController.prototype.reflect = function (dim) {
        this.option.actions.push(['reflect', dim]);
        return this;
    };
    /**
     * scale
     * @param sx
     * @param sy
     */
    CoordinateController.prototype.scale = function (sx, sy) {
        this.option.actions.push(['scale', sx, sy]);
        return this;
    };
    /**
     * 对角变换
     */
    CoordinateController.prototype.transpose = function () {
        this.option.actions.push(['transpose']);
        return this;
    };
    /**
     * 获取配置
     */
    CoordinateController.prototype.getOption = function () {
        return this.option;
    };
    /**
     * 获得 coordinate 实例
     */
    CoordinateController.prototype.getCoordinate = function () {
        return this.coordinate;
    };
    /**
     * 包装配置的默认值
     * @param option
     */
    CoordinateController.prototype.wrapperOption = function (option) {
        return tslib_1.__assign({ type: 'rect', actions: [], cfg: {} }, option);
    };
    /**
     * coordinate 实例执行 actions
     * @params includeActions 如果没有指定，则执行全部，否则，执行指定的 action
     */
    CoordinateController.prototype.execActions = function (includeActions) {
        var _this = this;
        var actions = this.option.actions;
        (0, util_1.each)(actions, function (action) {
            var _a;
            var _b = tslib_1.__read(action), actionName = _b[0], args = _b.slice(1);
            var shouldExec = (0, util_1.isNil)(includeActions) ? true : includeActions.includes(actionName);
            if (shouldExec) {
                (_a = _this.coordinate)[actionName].apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
            }
        });
    };
    return CoordinateController;
}());
exports.default = CoordinateController;
//# sourceMappingURL=coordinate.js.map