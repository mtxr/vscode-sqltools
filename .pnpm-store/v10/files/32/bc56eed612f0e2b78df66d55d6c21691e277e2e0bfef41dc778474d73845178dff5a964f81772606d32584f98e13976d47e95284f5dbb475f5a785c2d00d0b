"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var matrix_util_1 = require("@antv/matrix-util");
var __1 = require("..");
var util_1 = require("../util");
var MIN_DISTANCE = 5;
/**
 * @ignore
 * View 移动的 Action
 */
var Move = /** @class */ (function (_super) {
    tslib_1.__extends(Move, _super);
    function Move() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.starting = false;
        _this.isMoving = false;
        // private cacheRange = null;
        _this.startPoint = null;
        _this.startMatrix = null;
        return _this;
    }
    /**
     * 开始移动
     */
    Move.prototype.start = function () {
        this.starting = true;
        this.startPoint = this.context.getCurrentPoint();
        // 缓存开始时的矩阵，防止反复拖拽
        this.startMatrix = this.context.view.middleGroup.getMatrix();
    };
    /**
     * 移动
     */
    Move.prototype.move = function () {
        if (!this.starting) {
            return;
        }
        var startPoint = this.startPoint;
        var currentPoint = this.context.getCurrentPoint();
        var d = (0, util_1.distance)(startPoint, currentPoint);
        if (d > MIN_DISTANCE && !this.isMoving) {
            this.isMoving = true;
        }
        if (this.isMoving) {
            var view = this.context.view;
            var matrix = matrix_util_1.ext.transform(this.startMatrix, [
                ['t', currentPoint.x - startPoint.x, currentPoint.y - startPoint.y],
            ]);
            view.backgroundGroup.setMatrix(matrix);
            view.foregroundGroup.setMatrix(matrix);
            view.middleGroup.setMatrix(matrix);
        }
    };
    /**
     * 结束移动
     */
    Move.prototype.end = function () {
        if (this.isMoving) {
            this.isMoving = false;
        }
        this.startMatrix = null;
        this.starting = false;
        this.startPoint = null;
    };
    /**
     * 回滚
     */
    Move.prototype.reset = function () {
        this.starting = false;
        this.startPoint = null;
        this.isMoving = false;
        var view = this.context.view;
        view.backgroundGroup.resetMatrix();
        view.foregroundGroup.resetMatrix();
        view.middleGroup.resetMatrix();
        this.isMoving = false;
    };
    return Move;
}(__1.Action));
exports.default = Move;
//# sourceMappingURL=move.js.map