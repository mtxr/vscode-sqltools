"use strict";
/**
 * @fileoverview gradient
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var dom_1 = require("../util/dom");
var regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
var regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
var regexColorStop = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function addStop(steps) {
    var arr = steps.match(regexColorStop);
    if (!arr) {
        return '';
    }
    var stops = '';
    arr.sort(function (a, b) {
        a = a.split(':');
        b = b.split(':');
        return Number(a[0]) - Number(b[0]);
    });
    util_1.each(arr, function (item) {
        item = item.split(':');
        stops += "<stop offset=\"" + item[0] + "\" stop-color=\"" + item[1] + "\"></stop>";
    });
    return stops;
}
function parseLineGradient(color, el) {
    var arr = regexLG.exec(color);
    var angle = util_1.mod(util_1.toRadian(parseFloat(arr[1])), Math.PI * 2);
    var steps = arr[2];
    var start;
    var end;
    if (angle >= 0 && angle < 0.5 * Math.PI) {
        start = {
            x: 0,
            y: 0,
        };
        end = {
            x: 1,
            y: 1,
        };
    }
    else if (0.5 * Math.PI <= angle && angle < Math.PI) {
        start = {
            x: 1,
            y: 0,
        };
        end = {
            x: 0,
            y: 1,
        };
    }
    else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
        start = {
            x: 1,
            y: 1,
        };
        end = {
            x: 0,
            y: 0,
        };
    }
    else {
        start = {
            x: 0,
            y: 1,
        };
        end = {
            x: 1,
            y: 0,
        };
    }
    var tanTheta = Math.tan(angle);
    var tanTheta2 = tanTheta * tanTheta;
    var x = (end.x - start.x + tanTheta * (end.y - start.y)) / (tanTheta2 + 1) + start.x;
    var y = (tanTheta * (end.x - start.x + tanTheta * (end.y - start.y))) / (tanTheta2 + 1) + start.y;
    el.setAttribute('x1', start.x);
    el.setAttribute('y1', start.y);
    el.setAttribute('x2', x);
    el.setAttribute('y2', y);
    el.innerHTML = addStop(steps);
}
function parseRadialGradient(color, self) {
    var arr = regexRG.exec(color);
    var cx = parseFloat(arr[1]);
    var cy = parseFloat(arr[2]);
    var r = parseFloat(arr[3]);
    var steps = arr[4];
    self.setAttribute('cx', cx);
    self.setAttribute('cy', cy);
    self.setAttribute('r', r);
    self.innerHTML = addStop(steps);
}
var Gradient = /** @class */ (function () {
    function Gradient(cfg) {
        this.cfg = {};
        var el = null;
        var id = util_1.uniqueId('gradient_');
        if (cfg.toLowerCase()[0] === 'l') {
            el = dom_1.createSVGElement('linearGradient');
            parseLineGradient(cfg, el);
        }
        else {
            el = dom_1.createSVGElement('radialGradient');
            parseRadialGradient(cfg, el);
        }
        el.setAttribute('id', id);
        this.el = el;
        this.id = id;
        this.cfg = cfg;
        return this;
    }
    Gradient.prototype.match = function (type, attr) {
        return this.cfg === attr;
    };
    return Gradient;
}());
exports.default = Gradient;
//# sourceMappingURL=gradient.js.map