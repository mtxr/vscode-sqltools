"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VennElementSingleSelected = exports.VennElementSelected = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("../util");
var ElementSelectedAction = (0, g2_1.getActionClass)('element-selected');
var ElementSingleSelectedAction = (0, g2_1.getActionClass)('element-single-selected');
/**
 * 韦恩图元素 多选交互
 */
var VennElementSelected = /** @class */ (function (_super) {
    tslib_1.__extends(VennElementSelected, _super);
    function VennElementSelected() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementSelected.prototype.syncElementsPos = function () {
        (0, util_1.placeElementsOrdered)(this.context.view);
    };
    /** 激活图形元素 */
    VennElementSelected.prototype.selected = function () {
        _super.prototype.selected.call(this);
        this.syncElementsPos();
    };
    /** toggle 图形元素激活状态 */
    VennElementSelected.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.syncElementsPos();
    };
    /** 重置 */
    VennElementSelected.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.syncElementsPos();
    };
    return VennElementSelected;
}(ElementSelectedAction));
exports.VennElementSelected = VennElementSelected;
/**
 * 韦恩图元素 单选交互
 */
var VennElementSingleSelected = /** @class */ (function (_super) {
    tslib_1.__extends(VennElementSingleSelected, _super);
    function VennElementSingleSelected() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementSingleSelected.prototype.syncElementsPos = function () {
        (0, util_1.placeElementsOrdered)(this.context.view);
    };
    /** 激活图形元素 */
    VennElementSingleSelected.prototype.selected = function () {
        _super.prototype.selected.call(this);
        this.syncElementsPos();
    };
    /** toggle 图形元素激活状态 */
    VennElementSingleSelected.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.syncElementsPos();
    };
    /** 重置 */
    VennElementSingleSelected.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.syncElementsPos();
    };
    return VennElementSingleSelected;
}(ElementSingleSelectedAction));
exports.VennElementSingleSelected = VennElementSingleSelected;
//# sourceMappingURL=selected.js.map