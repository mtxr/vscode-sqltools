export default function d3Linear(cfg) {
    var min = cfg.min, max = cfg.max, nice = cfg.nice, tickCount = cfg.tickCount;
    var linear = new D3Linear();
    linear.domain([min, max]);
    if (nice) {
        linear.nice(tickCount);
    }
    return linear.ticks(tickCount);
}
var DEFAULT_COUNT = 5;
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
// https://github.com/d3/d3-scale
var D3Linear = /** @class */ (function () {
    function D3Linear() {
        this._domain = [0, 1];
    }
    D3Linear.prototype.domain = function (domain) {
        if (domain) {
            this._domain = Array.from(domain, Number);
            return this;
        }
        return this._domain.slice();
    };
    D3Linear.prototype.nice = function (count) {
        var _a, _b;
        if (count === void 0) { count = DEFAULT_COUNT; }
        var d = this._domain.slice();
        var i0 = 0;
        var i1 = this._domain.length - 1;
        var start = this._domain[i0];
        var stop = this._domain[i1];
        var step;
        if (stop < start) {
            _a = [stop, start], start = _a[0], stop = _a[1];
            _b = [i1, i0], i0 = _b[0], i1 = _b[1];
        }
        step = tickIncrement(start, stop, count);
        if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
            step = tickIncrement(start, stop, count);
        }
        else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
            step = tickIncrement(start, stop, count);
        }
        if (step > 0) {
            d[i0] = Math.floor(start / step) * step;
            d[i1] = Math.ceil(stop / step) * step;
            this.domain(d);
        }
        else if (step < 0) {
            d[i0] = Math.ceil(start * step) / step;
            d[i1] = Math.floor(stop * step) / step;
            this.domain(d);
        }
        return this;
    };
    D3Linear.prototype.ticks = function (count) {
        if (count === void 0) { count = DEFAULT_COUNT; }
        return d3ArrayTicks(this._domain[0], this._domain[this._domain.length - 1], count || DEFAULT_COUNT);
    };
    return D3Linear;
}());
export { D3Linear };
function d3ArrayTicks(start, stop, count) {
    var reverse;
    var i = -1;
    var n;
    var ticks;
    var step;
    (stop = +stop), (start = +start), (count = +count);
    if (start === stop && count > 0) {
        return [start];
    }
    // tslint:disable-next-line
    if ((reverse = stop < start)) {
        (n = start), (start = stop), (stop = n);
    }
    // tslint:disable-next-line
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) {
        return [];
    }
    if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array((n = Math.ceil(stop - start + 1)));
        while (++i < n) {
            ticks[i] = (start + i) * step;
        }
    }
    else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array((n = Math.ceil(start - stop + 1)));
        while (++i < n) {
            ticks[i] = (start - i) / step;
        }
    }
    if (reverse) {
        ticks.reverse();
    }
    return ticks;
}
function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count);
    var power = Math.floor(Math.log(step) / Math.LN10);
    var error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
//# sourceMappingURL=d3-linear.js.map