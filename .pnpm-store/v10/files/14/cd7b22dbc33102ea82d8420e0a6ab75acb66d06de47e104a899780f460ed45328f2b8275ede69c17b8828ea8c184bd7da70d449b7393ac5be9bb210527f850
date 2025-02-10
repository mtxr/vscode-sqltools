import { size, valuesOfKey } from '@antv/util';
import { isBetween } from '../../../utils';
/**
 * 右侧 View 进行 slider 过滤
 * 由于双轴图是多 View , 需要监听左侧 Slider 的 change 事件来同步右侧 View
 * @param { View } view 右侧视图
 * @param { number[] } sliderValue 滑块当前值
 * @returns void
 */
export var doSliderFilter = function (view, sliderValue) {
    var min = sliderValue[0], max = sliderValue[1];
    var data = view.getOptions().data;
    var xScale = view.getXScale();
    var dataSize = size(data);
    if (!xScale || !dataSize) {
        return;
    }
    var isHorizontal = true;
    var values = valuesOfKey(data, xScale.field);
    var xValues = isHorizontal ? values : values.reverse();
    var xTickCount = size(xValues);
    var minIndex = Math.floor(min * (xTickCount - 1));
    var maxIndex = Math.floor(max * (xTickCount - 1));
    // 增加 x 轴的过滤器
    view.filter(xScale.field, function (value) {
        var idx = xValues.indexOf(value);
        return idx > -1 ? isBetween(idx, minIndex, maxIndex) : true;
    });
    view.getRootView().render(true);
};
//# sourceMappingURL=render-sider.js.map