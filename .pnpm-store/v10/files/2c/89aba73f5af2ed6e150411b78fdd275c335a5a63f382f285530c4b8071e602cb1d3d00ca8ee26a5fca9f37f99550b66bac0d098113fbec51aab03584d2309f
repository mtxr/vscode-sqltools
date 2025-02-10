"use strict";
/**
 * @fileoverview shadow
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var dom_1 = require("../util/dom");
var ATTR_MAP = {
    shadowColor: 'color',
    shadowOpacity: 'opacity',
    shadowBlur: 'blur',
    shadowOffsetX: 'dx',
    shadowOffsetY: 'dy',
};
var SHADOW_DIMENSION = {
    x: '-40%',
    y: '-40%',
    width: '200%',
    height: '200%',
};
var Shadow = /** @class */ (function () {
    function Shadow(cfg) {
        this.type = 'filter';
        this.cfg = {};
        this.type = 'filter';
        var el = dom_1.createSVGElement('filter');
        // expand the filter region to fill in shadows
        util_1.each(SHADOW_DIMENSION, function (v, k) {
            el.setAttribute(k, v);
        });
        this.el = el;
        this.id = util_1.uniqueId('filter_');
        this.el.id = this.id;
        this.cfg = cfg;
        this._parseShadow(cfg, el);
        return this;
    }
    Shadow.prototype.match = function (type, cfg) {
        if (this.type !== type) {
            return false;
        }
        var flag = true;
        var config = this.cfg;
        util_1.each(Object.keys(config), function (attr) {
            if (config[attr] !== cfg[attr]) {
                flag = false;
                return false;
            }
        });
        return flag;
    };
    Shadow.prototype.update = function (name, value) {
        var config = this.cfg;
        config[ATTR_MAP[name]] = value;
        this._parseShadow(config, this.el);
        return this;
    };
    Shadow.prototype._parseShadow = function (config, el) {
        var child = "<feDropShadow\n      dx=\"" + (config.dx || 0) + "\"\n      dy=\"" + (config.dy || 0) + "\"\n      stdDeviation=\"" + (config.blur ? config.blur / 10 : 0) + "\"\n      flood-color=\"" + (config.color ? config.color : '#000') + "\"\n      flood-opacity=\"" + (config.opacity ? config.opacity : 1) + "\"\n      />";
        el.innerHTML = child;
    };
    return Shadow;
}());
exports.default = Shadow;
//# sourceMappingURL=shadow.js.map