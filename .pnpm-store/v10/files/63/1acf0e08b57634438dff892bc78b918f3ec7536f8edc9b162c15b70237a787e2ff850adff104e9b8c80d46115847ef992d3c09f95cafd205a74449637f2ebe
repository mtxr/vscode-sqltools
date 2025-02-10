"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var time_1 = require("../util/time");
var base_1 = require("./base");
/**
 * 时间分类度量
 * @class
 */
var TimeCat = /** @class */ (function (_super) {
    tslib_1.__extends(TimeCat, _super);
    function TimeCat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'timeCat';
        return _this;
    }
    /**
     * @override
     */
    TimeCat.prototype.translate = function (value) {
        value = time_1.toTimeStamp(value);
        var index = this.values.indexOf(value);
        if (index === -1) {
            if (util_1.isNumber(value) && value < this.values.length) {
                index = value;
            }
            else {
                index = NaN;
            }
        }
        return index;
    };
    /**
     * 由于时间类型数据需要转换一下，所以复写 getText
     * @override
     */
    TimeCat.prototype.getText = function (value, tickIndex) {
        var index = this.translate(value);
        if (index > -1) {
            var result = this.values[index];
            var formatter = this.formatter;
            result = formatter ? formatter(result, tickIndex) : time_1.timeFormat(result, this.mask);
            return result;
        }
        return value;
    };
    TimeCat.prototype.initCfg = function () {
        this.tickMethod = 'time-cat';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7; // 一般时间数据会显示 7， 14， 30 天的数字
    };
    TimeCat.prototype.setDomain = function () {
        var values = this.values;
        // 针对时间分类类型，会将时间统一转换为时间戳
        util_1.each(values, function (v, i) {
            values[i] = time_1.toTimeStamp(v);
        });
        values.sort(function (v1, v2) {
            return v1 - v2;
        });
        _super.prototype.setDomain.call(this);
    };
    return TimeCat;
}(base_1.default));
exports.default = TimeCat;
//# sourceMappingURL=time.js.map