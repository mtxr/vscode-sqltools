import { __assign } from "tslib";
import { get } from '@antv/util';
import { ellipsisLabel } from './label';
import { applyRotate, applyTranslate } from './matrix';
import { formatPadding } from './util';
export function renderTag(container, tagCfg) {
    var x = tagCfg.x, y = tagCfg.y, content = tagCfg.content, style = tagCfg.style, id = tagCfg.id, name = tagCfg.name, rotate = tagCfg.rotate, maxLength = tagCfg.maxLength, autoEllipsis = tagCfg.autoEllipsis, isVertical = tagCfg.isVertical, ellipsisPosition = tagCfg.ellipsisPosition, background = tagCfg.background;
    var tagGroup = container.addGroup({
        id: id + "-group",
        name: name + "-group",
        attrs: {
            x: x,
            y: y,
        }
    });
    // Text shape
    var text = tagGroup.addShape({
        type: 'text',
        id: id,
        name: name,
        attrs: __assign({ x: 0, y: 0, text: content }, style),
    });
    // maxLength 应包含 background 中的 padding 值
    var padding = formatPadding(get(background, 'padding', 0));
    if (maxLength && autoEllipsis) {
        var maxTextLength = maxLength - (padding[1] + padding[3]);
        // 超出自动省略
        ellipsisLabel(!isVertical, text, maxTextLength, ellipsisPosition);
    }
    if (background) {
        // 渲染文本背景
        var backgroundStyle = get(background, 'style', {});
        var _a = text.getCanvasBBox(), minX = _a.minX, minY = _a.minY, width = _a.width, height = _a.height;
        var tagBg = tagGroup.addShape('rect', {
            id: id + "-bg",
            name: id + "-bg",
            attrs: __assign({ x: minX - padding[3], y: minY - padding[0], width: width + padding[1] + padding[3], height: height + padding[0] + padding[2] }, backgroundStyle),
        });
        tagBg.toBack();
    }
    applyTranslate(tagGroup, x, y);
    applyRotate(tagGroup, rotate, x, y);
}
//# sourceMappingURL=graphic.js.map