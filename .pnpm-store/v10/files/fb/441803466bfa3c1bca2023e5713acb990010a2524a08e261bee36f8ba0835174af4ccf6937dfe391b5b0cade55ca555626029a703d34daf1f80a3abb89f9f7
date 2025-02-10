/**
 * @fileoverview pattern
 * @author dengfuping_develop@163.com
 */
import { uniqueId } from '@antv/util';
import { createSVGElement } from '../util/dom';
var regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
var Pattern = /** @class */ (function () {
    function Pattern(cfg) {
        this.cfg = {};
        var el = createSVGElement('pattern');
        el.setAttribute('patternUnits', 'userSpaceOnUse');
        var child = createSVGElement('image');
        el.appendChild(child);
        var id = uniqueId('pattern_');
        el.id = id;
        this.el = el;
        this.id = id;
        this.cfg = cfg;
        var arr = regexPR.exec(cfg);
        var source = arr[2];
        child.setAttribute('href', source);
        var img = new Image();
        if (!source.match(/^data:/i)) {
            img.crossOrigin = 'Anonymous';
        }
        img.src = source;
        function onload() {
            el.setAttribute('width', "" + img.width);
            el.setAttribute('height', "" + img.height);
        }
        if (img.complete) {
            onload();
        }
        else {
            img.onload = onload;
            // Fix onload() bug in IE9
            img.src = img.src;
        }
        return this;
    }
    Pattern.prototype.match = function (type, attr) {
        return this.cfg === attr;
    };
    return Pattern;
}());
export default Pattern;
//# sourceMappingURL=pattern.js.map