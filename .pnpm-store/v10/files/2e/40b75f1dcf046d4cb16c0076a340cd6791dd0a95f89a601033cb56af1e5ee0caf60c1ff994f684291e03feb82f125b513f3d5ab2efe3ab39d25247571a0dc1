"use strict";
/**
 * @fileoverview image
 * @author dengfuping_develop@163.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var base_1 = require("./base");
var Image = /** @class */ (function (_super) {
    tslib_1.__extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'image';
        _this.canFill = false;
        _this.canStroke = false;
        return _this;
    }
    Image.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x: 0, y: 0, width: 0, height: 0 });
    };
    Image.prototype.createPath = function (context, targetAttrs) {
        var _this = this;
        var attrs = this.attr();
        var el = this.get('el');
        util_1.each(targetAttrs || attrs, function (value, attr) {
            if (attr === 'img') {
                _this._setImage(attrs.img);
            }
            else if (constant_1.SVG_ATTR_MAP[attr]) {
                el.setAttribute(constant_1.SVG_ATTR_MAP[attr], value);
            }
        });
    };
    Image.prototype.setAttr = function (name, value) {
        this.attrs[name] = value;
        if (name === 'img') {
            this._setImage(value);
        }
    };
    Image.prototype._setImage = function (img) {
        var attrs = this.attr();
        var el = this.get('el');
        if (util_1.isString(img)) {
            el.setAttribute('href', img);
        }
        else if (img instanceof window.Image) {
            if (!attrs.width) {
                el.setAttribute('width', img.width);
                this.attr('width', img.width);
            }
            if (!attrs.height) {
                el.setAttribute('height', img.height);
                this.attr('height', img.height);
            }
            el.setAttribute('href', img.src);
        }
        else if (img instanceof HTMLElement && util_1.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
            // @ts-ignore
            el.setAttribute('href', img.toDataURL());
        }
        else if (img instanceof ImageData) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', "" + img.width);
            canvas.setAttribute('height', "" + img.height);
            canvas.getContext('2d').putImageData(img, 0, 0);
            if (!attrs.width) {
                el.setAttribute('width', "" + img.width);
                this.attr('width', img.width);
            }
            if (!attrs.height) {
                el.setAttribute('height', "" + img.height);
                this.attr('height', img.height);
            }
            el.setAttribute('href', canvas.toDataURL());
        }
    };
    return Image;
}(base_1.default));
exports.default = Image;
//# sourceMappingURL=image.js.map