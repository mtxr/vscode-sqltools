"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
// 自定义Shape 部分
(0, g2_1.registerShape)('point', 'gauge-indicator', {
    draw: function (cfg, container) {
        // 使用 customInfo 传递参数
        var _a = cfg.customInfo, indicator = _a.indicator, defaultColor = _a.defaultColor;
        var _b = indicator, pointer = _b.pointer, pin = _b.pin;
        var group = container.addGroup();
        // 获取极坐标系下画布中心点
        var center = this.parsePoint({ x: 0, y: 0 });
        // 绘制指针
        if (pointer) {
            // pointer
            group.addShape('line', {
                name: 'pointer',
                attrs: tslib_1.__assign({ x1: center.x, y1: center.y, x2: cfg.x, y2: cfg.y, stroke: defaultColor }, pointer.style),
            });
        }
        // pin
        if (pin) {
            group.addShape('circle', {
                name: 'pin',
                attrs: tslib_1.__assign({ x: center.x, y: center.y, stroke: defaultColor }, pin.style),
            });
        }
        return group;
    },
});
//# sourceMappingURL=indicator.js.map