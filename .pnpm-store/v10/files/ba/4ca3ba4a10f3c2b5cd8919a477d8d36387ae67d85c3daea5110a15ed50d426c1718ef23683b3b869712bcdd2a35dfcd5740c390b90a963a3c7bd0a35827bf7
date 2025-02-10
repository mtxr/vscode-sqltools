"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
// Step 1
// 自定义 Label 类
// 需要继承 GeometryLabel 基类
var VennLabel = /** @class */ (function (_super) {
    tslib_1.__extends(VennLabel, _super);
    function VennLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取每个 label 的位置
     * @param labelCfg
     * @param mappingData
     * @param index
     * @returns label point
     */
    VennLabel.prototype.getLabelPoint = function (labelCfg, mappingData, index) {
        var _a = labelCfg.data, x = _a.x, y = _a.y;
        var _b = labelCfg.customLabelInfo, offsetX = _b.offsetX, offsetY = _b.offsetY;
        return {
            content: labelCfg.content[index],
            x: x + offsetX,
            y: y + offsetY,
        };
    };
    return VennLabel;
}(g2_1.GeometryLabel));
// Step 2: 注册 CustomLabel
(0, g2_1.registerGeometryLabel)('venn', VennLabel);
//# sourceMappingURL=label.js.map