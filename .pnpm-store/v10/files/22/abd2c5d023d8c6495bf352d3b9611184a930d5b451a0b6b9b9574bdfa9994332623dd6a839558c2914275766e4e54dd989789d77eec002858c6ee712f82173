"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounds = void 0;
var variable_1 = require("./variable");
/**
 * 定义一个布局元素的大小，其实就是包含有四个变量
 */
var Bounds = /** @class */ (function () {
    function Bounds(name) {
        this.x = new variable_1.Variable("".concat(name, ".x"));
        this.y = new variable_1.Variable("".concat(name, ".y"));
        this.width = new variable_1.Variable("".concat(name, ".w"));
        this.height = new variable_1.Variable("".concat(name, ".h"));
    }
    Object.defineProperty(Bounds.prototype, "bbox", {
        /**
         * 最终的布局信息
         */
        get: function () {
            return {
                x: this.x.value,
                y: this.y.value,
                width: this.width.value,
                height: this.height.value,
            };
        },
        enumerable: false,
        configurable: true
    });
    return Bounds;
}());
exports.Bounds = Bounds;
//# sourceMappingURL=bounds.js.map