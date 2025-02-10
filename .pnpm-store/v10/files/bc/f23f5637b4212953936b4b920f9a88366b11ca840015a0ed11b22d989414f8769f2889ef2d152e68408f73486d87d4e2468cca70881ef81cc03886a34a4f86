/**
 * @fileoverview arrow
 * @author dengfuping_develop@163.com
 */
import { isArray, uniqueId } from '@antv/util';
import { createSVGElement } from '../util/dom';
var Arrow = /** @class */ (function () {
    function Arrow(attrs, type) {
        this.cfg = {};
        var el = createSVGElement('marker');
        var id = uniqueId('marker_');
        el.setAttribute('id', id);
        var shape = createSVGElement('path');
        shape.setAttribute('stroke', attrs.stroke || 'none');
        shape.setAttribute('fill', attrs.fill || 'none');
        el.appendChild(shape);
        el.setAttribute('overflow', 'visible');
        el.setAttribute('orient', 'auto-start-reverse');
        this.el = el;
        this.child = shape;
        this.id = id;
        var cfg = attrs[type === 'marker-start' ? 'startArrow' : 'endArrow'];
        this.stroke = attrs.stroke || '#000';
        if (cfg === true) {
            this._setDefaultPath(type, shape);
        }
        else {
            this.cfg = cfg; // when arrow config exists
            this._setMarker(attrs.lineWidth, shape);
        }
        return this;
    }
    Arrow.prototype.match = function () {
        return false;
    };
    Arrow.prototype._setDefaultPath = function (type, el) {
        var parent = this.el;
        // 默认箭头的边长为 10，夹角为 60 度
        el.setAttribute('d', "M0,0 L" + 10 * Math.cos(Math.PI / 6) + ",5 L0,10");
        parent.setAttribute('refX', "" + 10 * Math.cos(Math.PI / 6));
        parent.setAttribute('refY', "" + 5);
    };
    Arrow.prototype._setMarker = function (r, el) {
        var parent = this.el;
        var path = this.cfg.path;
        var d = this.cfg.d;
        if (isArray(path)) {
            path = path
                .map(function (segment) {
                return segment.join(' ');
            })
                .join('');
        }
        el.setAttribute('d', path);
        parent.appendChild(el);
        if (d) {
            parent.setAttribute('refX', "" + d / r);
        }
    };
    Arrow.prototype.update = function (fill) {
        var child = this.child;
        if (child.attr) {
            child.attr('fill', fill);
        }
        else {
            child.setAttribute('fill', fill);
        }
    };
    return Arrow;
}());
export default Arrow;
//# sourceMappingURL=arrow.js.map