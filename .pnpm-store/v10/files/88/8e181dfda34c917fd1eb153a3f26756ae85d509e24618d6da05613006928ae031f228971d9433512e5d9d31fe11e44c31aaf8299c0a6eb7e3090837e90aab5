"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setClip = exports.setTransform = exports.setShadow = void 0;
var dom_1 = require("./dom");
function setShadow(model, context) {
    var el = model.cfg.el;
    var attrs = model.attr();
    var cfg = {
        dx: attrs.shadowOffsetX,
        dy: attrs.shadowOffsetY,
        blur: attrs.shadowBlur,
        color: attrs.shadowColor,
    };
    if (!cfg.dx && !cfg.dy && !cfg.blur && !cfg.color) {
        el.removeAttribute('filter');
    }
    else {
        var id = context.find('filter', cfg);
        if (!id) {
            id = context.addShadow(cfg);
        }
        el.setAttribute('filter', "url(#" + id + ")");
    }
}
exports.setShadow = setShadow;
function setTransform(model) {
    var matrix = model.attr().matrix;
    if (matrix) {
        var el = model.cfg.el;
        var transform = [];
        for (var i = 0; i < 9; i += 3) {
            transform.push(matrix[i] + "," + matrix[i + 1]);
        }
        transform = transform.join(',');
        if (transform.indexOf('NaN') === -1) {
            el.setAttribute('transform', "matrix(" + transform + ")");
        }
        else {
            console.warn('invalid matrix:', matrix);
        }
    }
}
exports.setTransform = setTransform;
function setClip(model, context) {
    var clip = model.getClip();
    var el = model.get('el');
    if (!clip) {
        el.removeAttribute('clip-path');
    }
    else if (clip && !el.hasAttribute('clip-path')) {
        dom_1.createDom(clip);
        clip.createPath(context);
        var id = context.addClip(clip);
        el.setAttribute('clip-path', "url(#" + id + ")");
    }
}
exports.setClip = setClip;
//# sourceMappingURL=svg.js.map