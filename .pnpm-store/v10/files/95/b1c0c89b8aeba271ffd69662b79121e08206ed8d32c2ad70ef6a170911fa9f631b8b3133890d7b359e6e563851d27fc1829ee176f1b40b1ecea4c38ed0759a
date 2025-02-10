import { __assign, __extends } from "tslib";
import * as _ from '@antv/util';
import Adjust from './adjust';
var Cache = _.Cache;
var Stack = /** @class */ (function (_super) {
    __extends(Stack, _super);
    function Stack(cfg) {
        var _this = _super.call(this, cfg) || this;
        var _a = cfg.adjustNames, adjustNames = _a === void 0 ? ['y'] : _a, _b = cfg.height, height = _b === void 0 ? NaN : _b, _c = cfg.size, size = _c === void 0 ? 10 : _c, _d = cfg.reverseOrder, reverseOrder = _d === void 0 ? false : _d;
        _this.adjustNames = adjustNames;
        _this.height = height;
        _this.size = size;
        _this.reverseOrder = reverseOrder;
        return _this;
    }
    /**
     * 方法入参是经过数据分组、数据数字化之后的二维数组
     * @param groupDataArray 分组之后的数据
     */
    Stack.prototype.process = function (groupDataArray) {
        var _a = this, yField = _a.yField, reverseOrder = _a.reverseOrder;
        // 如果有指定 y 字段，那么按照 y 字段来 stack
        // 否则，按照高度均分
        var d = yField ? this.processStack(groupDataArray) : this.processOneDimStack(groupDataArray);
        return reverseOrder ? this.reverse(d) : d;
    };
    Stack.prototype.reverse = function (groupedDataArray) {
        return groupedDataArray.slice(0).reverse();
    };
    Stack.prototype.processStack = function (groupDataArray) {
        var _a = this, xField = _a.xField, yField = _a.yField, reverseOrder = _a.reverseOrder;
        // 层叠顺序翻转
        var groupedDataArray = reverseOrder ? this.reverse(groupDataArray) : groupDataArray;
        // 用来缓存，正数和负数的堆叠问题
        var positive = new Cache();
        var negative = new Cache();
        return groupedDataArray.map(function (dataArray) {
            return dataArray.map(function (data) {
                var _a;
                var x = _.get(data, xField, 0);
                var y = _.get(data, [yField]);
                var xKey = x.toString();
                // todo 是否应该取 _origin？因为 y 可能取到的值不正确，比如先 symmetric，再 stack！
                y = _.isArray(y) ? y[1] : y;
                if (!_.isNil(y)) {
                    var cache = y >= 0 ? positive : negative;
                    if (!cache.has(xKey)) {
                        cache.set(xKey, 0);
                    }
                    var xValue = cache.get(xKey);
                    var newXValue = y + xValue;
                    // 存起来
                    cache.set(xKey, newXValue);
                    return __assign(__assign({}, data), (_a = {}, _a[yField] = [xValue, newXValue], _a));
                }
                // 没有修改，则直接返回
                return data;
            });
        });
    };
    Stack.prototype.processOneDimStack = function (groupDataArray) {
        var _this = this;
        var _a = this, xField = _a.xField, height = _a.height, reverseOrder = _a.reverseOrder;
        var yField = 'y';
        // 如果层叠的顺序翻转
        var groupedDataArray = reverseOrder ? this.reverse(groupDataArray) : groupDataArray;
        // 缓存累加数据
        var cache = new Cache();
        return groupedDataArray.map(function (dataArray) {
            return dataArray.map(function (data) {
                var _a;
                var size = _this.size;
                var xValue = data[xField];
                // todo 没有看到这个 stack 计算原理
                var stackHeight = (size * 2) / height;
                if (!cache.has(xValue)) {
                    cache.set(xValue, stackHeight / 2); // 初始值大小
                }
                var stackValue = cache.get(xValue);
                // 增加一层 stackHeight
                cache.set(xValue, stackValue + stackHeight);
                return __assign(__assign({}, data), (_a = {}, _a[yField] = stackValue, _a));
            });
        });
    };
    return Stack;
}(Adjust));
export default Stack;
//# sourceMappingURL=stack.js.map