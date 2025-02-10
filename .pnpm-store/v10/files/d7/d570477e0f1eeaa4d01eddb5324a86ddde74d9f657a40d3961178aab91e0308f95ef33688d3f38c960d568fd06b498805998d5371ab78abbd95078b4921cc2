import { createDom } from './dom';
export function setShadow(model, context) {
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
export function setTransform(model) {
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
export function setClip(model, context) {
    var clip = model.getClip();
    var el = model.get('el');
    if (!clip) {
        el.removeAttribute('clip-path');
    }
    else if (clip && !el.hasAttribute('clip-path')) {
        createDom(clip);
        clip.createPath(context);
        var id = context.addClip(clip);
        el.setAttribute('clip-path', "url(#" + id + ")");
    }
}
//# sourceMappingURL=svg.js.map