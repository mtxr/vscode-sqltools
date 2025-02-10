"use strict";
/**
 * @fileoverview clip
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var dom_1 = require("../util/dom");
var Clip = /** @class */ (function () {
    function Clip(cfg) {
        this.type = 'clip';
        this.cfg = {};
        var el = dom_1.createSVGElement('clipPath');
        this.el = el;
        this.id = util_1.uniqueId('clip_');
        el.id = this.id;
        var shapeEl = cfg.cfg.el;
        el.appendChild(shapeEl);
        this.cfg = cfg;
        return this;
    }
    Clip.prototype.match = function () {
        return false;
    };
    Clip.prototype.remove = function () {
        var el = this.el;
        el.parentNode.removeChild(el);
    };
    return Clip;
}());
exports.default = Clip;
//# sourceMappingURL=clip.js.map