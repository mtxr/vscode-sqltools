import { __extends } from "tslib";
import { each, isDate, isNil, isNumber, isString } from '@antv/util';
import { timeFormat, toTimeStamp } from '../util/time';
import Linear from './linear';
/**
 * 时间度量
 * @class
 */
var Time = /** @class */ (function (_super) {
    __extends(Time, _super);
    function Time() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'time';
        return _this;
    }
    /**
     * @override
     */
    Time.prototype.getText = function (value, index) {
        var numberValue = this.translate(value);
        var formatter = this.formatter;
        return formatter ? formatter(numberValue, index) : timeFormat(numberValue, this.mask);
    };
    /**
     * @override
     */
    Time.prototype.scale = function (value) {
        var v = value;
        if (isString(v) || isDate(v)) {
            v = this.translate(v);
        }
        return _super.prototype.scale.call(this, v);
    };
    /**
     * 将时间转换成数字
     * @override
     */
    Time.prototype.translate = function (v) {
        return toTimeStamp(v);
    };
    Time.prototype.initCfg = function () {
        this.tickMethod = 'time-pretty';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7;
        this.nice = false;
    };
    Time.prototype.setDomain = function () {
        var values = this.values;
        // 是否设置了 min, max，而不是直接取 this.min, this.max
        var minConfig = this.getConfig('min');
        var maxConfig = this.getConfig('max');
        // 如果设置了 min,max 则转换成时间戳
        if (!isNil(minConfig) || !isNumber(minConfig)) {
            this.min = this.translate(this.min);
        }
        if (!isNil(maxConfig) || !isNumber(maxConfig)) {
            this.max = this.translate(this.max);
        }
        // 没有设置 min, max 时
        if (values && values.length) {
            // 重新计算最大最小值
            var timeStamps_1 = [];
            var min_1 = Infinity; // 最小值
            var secondMin_1 = min_1; // 次小值
            var max_1 = 0;
            // 使用一个循环，计算min,max,secondMin
            each(values, function (v) {
                var timeStamp = toTimeStamp(v);
                if (isNaN(timeStamp)) {
                    throw new TypeError("Invalid Time: " + v + " in time scale!");
                }
                if (min_1 > timeStamp) {
                    secondMin_1 = min_1;
                    min_1 = timeStamp;
                }
                else if (secondMin_1 > timeStamp) {
                    secondMin_1 = timeStamp;
                }
                if (max_1 < timeStamp) {
                    max_1 = timeStamp;
                }
                timeStamps_1.push(timeStamp);
            });
            // 存在多个值时，设置最小间距
            if (values.length > 1) {
                this.minTickInterval = secondMin_1 - min_1;
            }
            if (isNil(minConfig)) {
                this.min = min_1;
            }
            if (isNil(maxConfig)) {
                this.max = max_1;
            }
        }
    };
    return Time;
}(Linear));
export default Time;
//# sourceMappingURL=time.js.map