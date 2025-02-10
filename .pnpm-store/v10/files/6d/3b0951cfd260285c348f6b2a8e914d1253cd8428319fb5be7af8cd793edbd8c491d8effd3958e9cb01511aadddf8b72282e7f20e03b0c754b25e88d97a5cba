"use strict";
/**
 * @fileoverview 图片
 * @author dxq613@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
var util_1 = require("../util/util");
function isCanvas(dom) {
    return dom instanceof HTMLElement && util_1.isString(dom.nodeName) && dom.nodeName.toUpperCase() === 'CANVAS';
}
var ImageShape = /** @class */ (function (_super) {
    tslib_1.__extends(ImageShape, _super);
    function ImageShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageShape.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, attrs), { x: 0, y: 0, width: 0, height: 0 });
    };
    ImageShape.prototype.initAttrs = function (attrs) {
        this._setImage(attrs.img);
    };
    // image 不计算 stroke
    ImageShape.prototype.isStroke = function () {
        return false;
    };
    // 仅仅使用包围盒检测来进行拾取
    // 所以不需要复写 isInStrokeOrPath 的方法
    ImageShape.prototype.isOnlyHitBox = function () {
        return true;
    };
    ImageShape.prototype._afterLoading = function () {
        if (this.get('toDraw') === true) {
            var canvas = this.get('canvas');
            if (canvas) {
                // 这段应该改成局部渲染
                canvas.draw();
            }
            else {
                // 这种方式如果发生遮挡会出现问题
                this.createPath(this.get('context'));
            }
        }
    };
    ImageShape.prototype._setImage = function (img) {
        var _this = this;
        var attrs = this.attrs;
        if (util_1.isString(img)) {
            var image_1 = new Image();
            image_1.onload = function () {
                // 图片未加载完，则已经被销毁
                if (_this.destroyed) {
                    return false;
                }
                // 缓存原始地址，可以做对比，防止重复加载图片
                // 如果考虑到在加载过程中可能替换 img 属性，则情况更加复杂
                // this.set('imgSrc', img);
                // 这里会循环调用 _setImage 方法，但不会再走这个分支
                _this.attr('img', image_1);
                _this.set('loading', false);
                _this._afterLoading();
                var callback = _this.get('callback');
                if (callback) {
                    callback.call(_this);
                }
            };
            // 设置跨域
            image_1.crossOrigin = 'Anonymous';
            image_1.src = img;
            // loading 过程中不绘制
            this.set('loading', true);
        }
        else if (img instanceof Image) {
            // 如果是一个 image 对象，则设置宽高
            if (!attrs.width) {
                attrs.width = img.width;
            }
            if (!attrs.height) {
                attrs.height = img.height;
            }
        }
        else if (isCanvas(img)) {
            // 如果设置了 canvas 对象
            if (!attrs.width) {
                attrs.width = Number(img.getAttribute('width'));
            }
            if (!attrs.height) {
                attrs.height, Number(img.getAttribute('height'));
            }
        }
    };
    ImageShape.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        // 如果加载的已经是当前图片，则不再处理
        if (name === 'img') {
            // 可以加缓冲，&& this.get('imgSrc') !== value
            this._setImage(value);
        }
    };
    ImageShape.prototype.createPath = function (context) {
        // 正在加载则不绘制
        if (this.get('loading')) {
            this.set('toDraw', true); // 加载完成后绘制
            this.set('context', context);
            return;
        }
        var attrs = this.attr();
        var x = attrs.x, y = attrs.y, width = attrs.width, height = attrs.height, sx = attrs.sx, sy = attrs.sy, swidth = attrs.swidth, sheight = attrs.sheight;
        var img = attrs.img;
        if (img instanceof Image || isCanvas(img)) {
            if (!util_1.isNil(sx) && !util_1.isNil(sy) && !util_1.isNil(swidth) && !util_1.isNil(sheight)) {
                context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
            }
            else {
                context.drawImage(img, x, y, width, height);
            }
        }
    };
    return ImageShape;
}(base_1.default));
exports.default = ImageShape;
//# sourceMappingURL=image.js.map