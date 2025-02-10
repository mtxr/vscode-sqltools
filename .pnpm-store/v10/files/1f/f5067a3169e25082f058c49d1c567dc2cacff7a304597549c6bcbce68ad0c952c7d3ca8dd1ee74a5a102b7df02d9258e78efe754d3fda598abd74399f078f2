import { __read, __spreadArray } from "tslib";
import { each } from '@antv/util';
import { COMPONENT_TYPE } from '../../constant';
import { BBox } from '../../util/bbox';
import { isAutoPadding, parsePadding } from '../../util/padding';
import { PaddingCal } from './padding-cal';
/**
 * @ignore
 * 根据 view 中的组件，计算实际的 padding 数值
 * @param view
 */
export function calculatePadding(view) {
    var padding = view.padding;
    // 如果不是 auto padding，那么直接解析之后返回
    if (!isAutoPadding(padding)) {
        return new (PaddingCal.bind.apply(PaddingCal, __spreadArray([void 0], __read(parsePadding(padding)), false)))();
    }
    // 是 auto padding，根据组件的情况，来计算 padding
    var viewBBox = view.viewBBox;
    var paddingCal = new PaddingCal();
    var axisComponents = [];
    var paddingComponents = [];
    var otherComponents = [];
    each(view.getComponents(), function (co) {
        var type = co.type;
        if (type === COMPONENT_TYPE.AXIS) {
            axisComponents.push(co);
        }
        else if ([COMPONENT_TYPE.LEGEND, COMPONENT_TYPE.SLIDER, COMPONENT_TYPE.SCROLLBAR].includes(type)) {
            paddingComponents.push(co);
        }
        else if (type !== COMPONENT_TYPE.GRID && type !== COMPONENT_TYPE.TOOLTIP) {
            otherComponents.push(co);
        }
    });
    // 进行坐标轴布局，应该是取 padding 的并集，而不是进行相加
    each(axisComponents, function (co) {
        var component = co.component;
        var bboxObject = component.getLayoutBBox();
        var componentBBox = new BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height);
        var exceed = componentBBox.exceed(viewBBox);
        // 在对组件分组之后，先对 axis 进行处理，然后取最大的超出即可。
        paddingCal.max(exceed);
    });
    // 有 padding 的组件布局
    each(paddingComponents, function (co) {
        var component = co.component, direction = co.direction;
        var bboxObject = component.getLayoutBBox();
        var componentPadding = component.get('padding');
        var componentBBox = new BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height).expand(componentPadding);
        // 按照方向计算 padding
        paddingCal.inc(componentBBox, direction);
    });
    // 其他组件布局
    each(otherComponents, function (co) {
        var component = co.component, direction = co.direction;
        var bboxObject = component.getLayoutBBox();
        var componentBBox = new BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height);
        // 按照方向计算 padding
        paddingCal.inc(componentBBox, direction);
    });
    return paddingCal;
}
//# sourceMappingURL=auto.js.map