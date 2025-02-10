"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview 设置画布的箭头，参看：https://www.w3school.com.cn/jsref/prop_style_cursor.asp
 * @author dxq613
 */
var base_1 = tslib_1.__importDefault(require("./base"));
/**
 * 鼠标形状的 Action
 * @ignore
 */
var CursorAction = /** @class */ (function (_super) {
    tslib_1.__extends(CursorAction, _super);
    function CursorAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CursorAction.prototype.setCursor = function (cursor) {
        var view = this.context.view;
        view.getCanvas().setCursor(cursor);
    };
    /**
     * 默认光标（通常是一个箭头）
     */
    CursorAction.prototype.default = function () {
        this.setCursor('default');
    };
    /** 光标呈现为指示链接的指针（一只手） */
    CursorAction.prototype.pointer = function () {
        this.setCursor('pointer');
    };
    /** 此光标指示某对象可被移动。 */
    CursorAction.prototype.move = function () {
        this.setCursor('move');
    };
    /** 光标呈现为十字线。 */
    CursorAction.prototype.crosshair = function () {
        this.setCursor('crosshair');
    };
    /** 此光标指示程序正忙（通常是一只表或沙漏）。 */
    CursorAction.prototype.wait = function () {
        this.setCursor('wait');
    };
    /** 此光标指示可用的帮助（通常是一个问号或一个气球）。 */
    CursorAction.prototype.help = function () {
        this.setCursor('help');
    };
    /** 此光标指示文本。 */
    CursorAction.prototype.text = function () {
        this.setCursor('text');
    };
    /**
     * 此光标指示矩形框的边缘可被向右（东）移动。
     */
    CursorAction.prototype.eResize = function () {
        this.setCursor('e-resize');
    };
    /**
     * 此光标指示矩形框的边缘可被向左（西）移动。
     */
    CursorAction.prototype.wResize = function () {
        this.setCursor('w-resize');
    };
    /**
     * 此光标指示矩形框的边缘可被向上（北）移动。
     */
    CursorAction.prototype.nResize = function () {
        this.setCursor('n-resize');
    };
    /**
     * 此光标指示矩形框的边缘可被向下（南）移动。
     */
    CursorAction.prototype.sResize = function () {
        this.setCursor('s-resize');
    };
    /**
     * 光标指示可移动的方向 右上方（东北）
     */
    CursorAction.prototype.neResize = function () {
        this.setCursor('ne-resize');
    };
    /**
     * 光标指示可移动的方向 左上方（西北）
     */
    CursorAction.prototype.nwResize = function () {
        this.setCursor('nw-resize');
    };
    /**
     * 光标指示可移动的方向右下方（东南）
     */
    CursorAction.prototype.seResize = function () {
        this.setCursor('se-resize');
    };
    /**
     * 光标指示可移动的方向左下方（西南）
     */
    CursorAction.prototype.swResize = function () {
        this.setCursor('sw-resize');
    };
    /**
     * 光标指示可以在上下方向移动
     */
    CursorAction.prototype.nsResize = function () {
        this.setCursor('ns-resize');
    };
    /**
     * 光标指示可以在左右方向移动
     */
    CursorAction.prototype.ewResize = function () {
        this.setCursor('ew-resize');
    };
    /**
     * 光标显示可以被放大
     */
    CursorAction.prototype.zoomIn = function () {
        this.setCursor('zoom-in');
    };
    /**
     * 光标显示可以缩小尺寸
     */
    CursorAction.prototype.zoomOut = function () {
        this.setCursor('zoom-out');
    };
    return CursorAction;
}(base_1.default));
exports.default = CursorAction;
//# sourceMappingURL=cursor.js.map