import { __extends } from "tslib";
import { getActionClass } from '@antv/g2';
import { placeElementsOrdered } from '../util';
var ElementSelectedAction = getActionClass('element-selected');
var ElementSingleSelectedAction = getActionClass('element-single-selected');
/**
 * 韦恩图元素 多选交互
 */
var VennElementSelected = /** @class */ (function (_super) {
    __extends(VennElementSelected, _super);
    function VennElementSelected() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementSelected.prototype.syncElementsPos = function () {
        placeElementsOrdered(this.context.view);
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
export { VennElementSelected };
/**
 * 韦恩图元素 单选交互
 */
var VennElementSingleSelected = /** @class */ (function (_super) {
    __extends(VennElementSingleSelected, _super);
    function VennElementSingleSelected() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 同步所有元素的位置
     */
    VennElementSingleSelected.prototype.syncElementsPos = function () {
        placeElementsOrdered(this.context.view);
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
export { VennElementSingleSelected };
//# sourceMappingURL=selected.js.map