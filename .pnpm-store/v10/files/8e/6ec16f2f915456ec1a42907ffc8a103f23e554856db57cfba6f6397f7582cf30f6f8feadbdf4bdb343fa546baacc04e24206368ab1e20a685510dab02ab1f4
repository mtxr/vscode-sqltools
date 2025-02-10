/**
 * @fileoverview clip
 * @author dengfuping_develop@163.com
 */
import { uniqueId } from '@antv/util';
import { createSVGElement } from '../util/dom';
var Clip = /** @class */ (function () {
    function Clip(cfg) {
        this.type = 'clip';
        this.cfg = {};
        var el = createSVGElement('clipPath');
        this.el = el;
        this.id = uniqueId('clip_');
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
export default Clip;
//# sourceMappingURL=clip.js.map