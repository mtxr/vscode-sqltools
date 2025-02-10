"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePadding = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../../constant");
var bbox_1 = require("../../util/bbox");
var padding_1 = require("../../util/padding");
var padding_cal_1 = require("./padding-cal");
/**
 * @ignore
 * 根据 view 中的组件，计算实际的 padding 数值
 * @param view
 */
function calculatePadding(view) {
    var padding = view.padding;
    // 如果不是 auto padding，那么直接解析之后返回
    if (!(0, padding_1.isAutoPadding)(padding)) {
        return new (padding_cal_1.PaddingCal.bind.apply(padding_cal_1.PaddingCal, tslib_1.__spreadArray([void 0], tslib_1.__read((0, padding_1.parsePadding)(padding)), false)))();
    }
    // 是 auto padding，根据组件的情况，来计算 padding
    var viewBBox = view.viewBBox;
    var paddingCal = new padding_cal_1.PaddingCal();
    var axisComponents = [];
    var paddingComponents = [];
    var otherComponents = [];
    (0, util_1.each)(view.getComponents(), function (co) {
        var type = co.type;
        if (type === constant_1.COMPONENT_TYPE.AXIS) {
            axisComponents.push(co);
        }
        else if ([constant_1.COMPONENT_TYPE.LEGEND, constant_1.COMPONENT_TYPE.SLIDER, constant_1.COMPONENT_TYPE.SCROLLBAR].includes(type)) {
            paddingComponents.push(co);
        }
        else if (type !== constant_1.COMPONENT_TYPE.GRID && type !== constant_1.COMPONENT_TYPE.TOOLTIP) {
            otherComponents.push(co);
        }
    });
    // 进行坐标轴布局，应该是取 padding 的并集，而不是进行相加
    (0, util_1.each)(axisComponents, function (co) {
        var component = co.component;
        var bboxObject = component.getLayoutBBox();
        var componentBBox = new bbox_1.BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height);
        var exceed = componentBBox.exceed(viewBBox);
        // 在对组件分组之后，先对 axis 进行处理，然后取最大的超出即可。
        paddingCal.max(exceed);
    });
    // 有 padding 的组件布局
    (0, util_1.each)(paddingComponents, function (co) {
        var component = co.component, direction = co.direction;
        var bboxObject = component.getLayoutBBox();
        var componentPadding = component.get('padding');
        var componentBBox = new bbox_1.BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height).expand(componentPadding);
        // 按照方向计算 padding
        paddingCal.inc(componentBBox, direction);
    });
    // 其他组件布局
    (0, util_1.each)(otherComponents, function (co) {
        var component = co.component, direction = co.direction;
        var bboxObject = component.getLayoutBBox();
        var componentBBox = new bbox_1.BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height);
        // 按照方向计算 padding
        paddingCal.inc(componentBBox, direction);
    });
    return paddingCal;
}
exports.calculatePadding = calculatePadding;
//# sourceMappingURL=auto.js.map