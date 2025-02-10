"use strict";
/**
 * @fileoverview defs
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var gradient_1 = require("./gradient");
var shadow_1 = require("./shadow");
var arrow_1 = require("./arrow");
var clip_1 = require("./clip");
var pattern_1 = require("./pattern");
var dom_1 = require("../util/dom");
var Defs = /** @class */ (function () {
    function Defs(canvas) {
        var el = dom_1.createSVGElement('defs');
        var id = util_1.uniqueId('defs_');
        el.id = id;
        canvas.appendChild(el);
        this.children = [];
        this.defaultArrow = {};
        this.el = el;
        this.canvas = canvas;
    }
    Defs.prototype.find = function (type, attr) {
        var children = this.children;
        var result = null;
        for (var i = 0; i < children.length; i++) {
            if (children[i].match(type, attr)) {
                result = children[i].id;
                break;
            }
        }
        return result;
    };
    Defs.prototype.findById = function (id) {
        var children = this.children;
        var flag = null;
        for (var i = 0; i < children.length; i++) {
            if (children[i].id === id) {
                flag = children[i];
                break;
            }
        }
        return flag;
    };
    Defs.prototype.add = function (item) {
        this.children.push(item);
        item.canvas = this.canvas;
        item.parent = this;
    };
    Defs.prototype.getDefaultArrow = function (attrs, name) {
        var stroke = attrs.stroke || attrs.strokeStyle;
        if (this.defaultArrow[stroke]) {
            return this.defaultArrow[stroke].id;
        }
        var arrow = new arrow_1.default(attrs, name);
        this.defaultArrow[stroke] = arrow;
        this.el.appendChild(arrow.el);
        this.add(arrow);
        return arrow.id;
    };
    Defs.prototype.addGradient = function (cfg) {
        var gradient = new gradient_1.default(cfg);
        this.el.appendChild(gradient.el);
        this.add(gradient);
        return gradient.id;
    };
    Defs.prototype.addArrow = function (attrs, name) {
        var arrow = new arrow_1.default(attrs, name);
        this.el.appendChild(arrow.el);
        this.add(arrow);
        return arrow.id;
    };
    Defs.prototype.addShadow = function (cfg) {
        var shadow = new shadow_1.default(cfg);
        this.el.appendChild(shadow.el);
        this.add(shadow);
        return shadow.id;
    };
    Defs.prototype.addPattern = function (cfg) {
        var pattern = new pattern_1.default(cfg);
        this.el.appendChild(pattern.el);
        this.add(pattern);
        return pattern.id;
    };
    Defs.prototype.addClip = function (cfg) {
        var clip = new clip_1.default(cfg);
        this.el.appendChild(clip.el);
        this.add(clip);
        return clip.id;
    };
    return Defs;
}());
exports.default = Defs;
//# sourceMappingURL=index.js.map