"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieLegendAction = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var matrix_1 = require("../../../../utils/matrix");
/**
 * 饼图 图例激活 action
 */
var PieLegendAction = /** @class */ (function (_super) {
    tslib_1.__extends(PieLegendAction, _super);
    function PieLegendAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取激活的图形元素
     */
    PieLegendAction.prototype.getActiveElements = function () {
        var delegateObject = g2_1.Util.getDelegationObject(this.context);
        if (delegateObject) {
            var view = this.context.view;
            var component = delegateObject.component, item_1 = delegateObject.item;
            var field_1 = component.get('field');
            if (field_1) {
                var elements = view.geometries[0].elements;
                return elements.filter(function (ele) { return ele.getModel().data[field_1] === item_1.value; });
            }
        }
        return [];
    };
    /**
     * 获取激活的标签
     */
    PieLegendAction.prototype.getActiveElementLabels = function () {
        var view = this.context.view;
        var elements = this.getActiveElements();
        var labels = view.geometries[0].labelsContainer.getChildren();
        return labels.filter(function (label) { return elements.find(function (ele) { return (0, util_1.isEqual)(ele.getData(), label.get('data')); }); });
    };
    PieLegendAction.prototype.transfrom = function (offset) {
        if (offset === void 0) { offset = 7.5; }
        var elements = this.getActiveElements();
        var elementLabels = this.getActiveElementLabels();
        elements.forEach(function (element, idx) {
            var labelShape = elementLabels[idx];
            var coordinate = element.geometry.coordinate;
            if (coordinate.isPolar && coordinate.isTransposed) {
                var _a = g2_1.Util.getAngle(element.getModel(), coordinate), startAngle = _a.startAngle, endAngle = _a.endAngle;
                var middleAngle = (startAngle + endAngle) / 2;
                var r = offset;
                var x = r * Math.cos(middleAngle);
                var y = r * Math.sin(middleAngle);
                element.shape.setMatrix((0, matrix_1.transform)([['t', x, y]]));
                labelShape.setMatrix((0, matrix_1.transform)([['t', x, y]]));
            }
        });
    };
    PieLegendAction.prototype.active = function () {
        this.transfrom();
    };
    /**
     * 激活态还原
     */
    PieLegendAction.prototype.reset = function () {
        this.transfrom(0);
    };
    return PieLegendAction;
}(g2_1.Action));
exports.PieLegendAction = PieLegendAction;
//# sourceMappingURL=legend-active.js.map