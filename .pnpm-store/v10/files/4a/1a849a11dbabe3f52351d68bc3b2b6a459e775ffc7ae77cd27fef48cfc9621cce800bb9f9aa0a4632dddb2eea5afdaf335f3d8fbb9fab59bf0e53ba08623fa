import { Variable } from './variable';
/**
 * 定义一个布局元素的大小，其实就是包含有四个变量
 */
var Bounds = /** @class */ (function () {
    function Bounds(name) {
        this.x = new Variable("".concat(name, ".x"));
        this.y = new Variable("".concat(name, ".y"));
        this.width = new Variable("".concat(name, ".w"));
        this.height = new Variable("".concat(name, ".h"));
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
export { Bounds };
//# sourceMappingURL=bounds.js.map