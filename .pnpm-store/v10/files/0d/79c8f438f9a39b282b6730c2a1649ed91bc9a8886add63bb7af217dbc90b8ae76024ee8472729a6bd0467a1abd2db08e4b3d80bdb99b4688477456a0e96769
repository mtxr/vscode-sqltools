"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTag = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var label_1 = require("./label");
var matrix_1 = require("./matrix");
var util_2 = require("./util");
function renderTag(container, tagCfg) {
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
        attrs: tslib_1.__assign({ x: 0, y: 0, text: content }, style),
    });
    // maxLength 应包含 background 中的 padding 值
    var padding = util_2.formatPadding(util_1.get(background, 'padding', 0));
    if (maxLength && autoEllipsis) {
        var maxTextLength = maxLength - (padding[1] + padding[3]);
        // 超出自动省略
        label_1.ellipsisLabel(!isVertical, text, maxTextLength, ellipsisPosition);
    }
    if (background) {
        // 渲染文本背景
        var backgroundStyle = util_1.get(background, 'style', {});
        var _a = text.getCanvasBBox(), minX = _a.minX, minY = _a.minY, width = _a.width, height = _a.height;
        var tagBg = tagGroup.addShape('rect', {
            id: id + "-bg",
            name: id + "-bg",
            attrs: tslib_1.__assign({ x: minX - padding[3], y: minY - padding[0], width: width + padding[1] + padding[3], height: height + padding[0] + padding[2] }, backgroundStyle),
        });
        tagBg.toBack();
    }
    matrix_1.applyTranslate(tagGroup, x, y);
    matrix_1.applyRotate(tagGroup, rotate, x, y);
}
exports.renderTag = renderTag;
//# sourceMappingURL=graphic.js.map