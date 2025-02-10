import { __assign, __extends, __values } from "tslib";
import ColorUtil from '@antv/color-util';
import { get, isNumber } from '@antv/util';
import { FIELD_ORIGIN } from '../constant';
import Geometry from './base';
/**
 * 用于绘制热力图。
 */
var Heatmap = /** @class */ (function (_super) {
    __extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'heatmap';
        _this.paletteCache = {};
        return _this;
    }
    Heatmap.prototype.updateElements = function (mappingDataArray, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        for (var i = 0; i < mappingDataArray.length; i++) {
            var mappingData = mappingDataArray[i];
            var range = this.prepareRange(mappingData);
            var radius = this.prepareSize();
            var blur_1 = get(this.styleOption, ['cfg', 'shadowBlur']);
            if (!isNumber(blur_1)) {
                blur_1 = radius / 2;
            }
            this.prepareGreyScaleBlurredCircle(radius, blur_1);
            this.drawWithRange(mappingData, range, radius, blur_1);
        }
    };
    /** 热力图暂时不支持 callback 回调（文档需要说明下） */
    Heatmap.prototype.color = function (field, cfg) {
        this.createAttrOption('color', field, typeof cfg !== 'function' ? cfg : '');
        return this;
    };
    /**
     * clear
     */
    Heatmap.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.clearShadowCanvasCtx();
        this.paletteCache = {};
    };
    Heatmap.prototype.prepareRange = function (data) {
        var colorAttr = this.getAttribute('color');
        var colorField = colorAttr.getFields()[0];
        var min = Infinity;
        var max = -Infinity;
        data.forEach(function (row) {
            var value = row[FIELD_ORIGIN][colorField];
            if (value > max) {
                max = value;
            }
            if (value < min) {
                min = value;
            }
        });
        if (min === max) {
            min = max - 1;
        }
        return [min, max];
    };
    Heatmap.prototype.prepareSize = function () {
        var radius = this.getDefaultValue('size');
        if (!isNumber(radius)) {
            radius = this.getDefaultSize();
        }
        return radius;
    };
    Heatmap.prototype.prepareGreyScaleBlurredCircle = function (radius, blur) {
        var grayScaleBlurredCanvas = this.getGrayScaleBlurredCanvas();
        var r2 = radius + blur;
        var ctx = grayScaleBlurredCanvas.getContext('2d');
        grayScaleBlurredCanvas.width = grayScaleBlurredCanvas.height = r2 * 2;
        ctx.clearRect(0, 0, grayScaleBlurredCanvas.width, grayScaleBlurredCanvas.height);
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    Heatmap.prototype.drawWithRange = function (data, range, radius, blur) {
        var e_1, _a;
        // canvas size
        var _b = this.coordinate, start = _b.start, end = _b.end;
        var width = this.coordinate.getWidth();
        var height = this.coordinate.getHeight();
        // value, range, etc
        var colorAttr = this.getAttribute('color');
        var valueField = colorAttr.getFields()[0];
        // prepare shadow canvas context
        this.clearShadowCanvasCtx();
        var ctx = this.getShadowCanvasCtx();
        // filter data
        if (range) {
            data = data.filter(function (row) {
                return row[FIELD_ORIGIN][valueField] <= range[1] && row[FIELD_ORIGIN][valueField] >= range[0];
            });
        }
        // step1. draw points with shadow
        var scale = this.scales[valueField];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var obj = data_1_1.value;
                var _c = this.getDrawCfg(obj), x = _c.x, y = _c.y;
                var alpha = scale.scale(obj[FIELD_ORIGIN][valueField]);
                this.drawGrayScaleBlurredCircle(x - start.x, y - end.y, radius + blur, alpha, ctx);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // step2. convert pixels
        var colored = ctx.getImageData(0, 0, width, height);
        this.clearShadowCanvasCtx();
        this.colorize(colored);
        ctx.putImageData(colored, 0, 0);
        var imageShape = this.getImageShape();
        imageShape.attr('x', start.x);
        imageShape.attr('y', end.y);
        imageShape.attr('width', width);
        imageShape.attr('height', height);
        imageShape.attr('img', ctx.canvas);
        imageShape.set('origin', this.getShapeInfo(data)); // 存储绘图信息数据
    };
    Heatmap.prototype.getDefaultSize = function () {
        var position = this.getAttribute('position');
        var coordinate = this.coordinate;
        return Math.min(coordinate.getWidth() / (position.scales[0].ticks.length * 4), coordinate.getHeight() / (position.scales[1].ticks.length * 4));
    };
    Heatmap.prototype.clearShadowCanvasCtx = function () {
        var ctx = this.getShadowCanvasCtx();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    Heatmap.prototype.getShadowCanvasCtx = function () {
        var canvas = this.shadowCanvas;
        if (!canvas) {
            canvas = document.createElement('canvas');
            this.shadowCanvas = canvas;
        }
        canvas.width = this.coordinate.getWidth();
        canvas.height = this.coordinate.getHeight();
        return canvas.getContext('2d');
    };
    Heatmap.prototype.getGrayScaleBlurredCanvas = function () {
        if (!this.grayScaleBlurredCanvas) {
            this.grayScaleBlurredCanvas = document.createElement('canvas');
        }
        return this.grayScaleBlurredCanvas;
    };
    Heatmap.prototype.drawGrayScaleBlurredCircle = function (x, y, r, alpha, ctx) {
        var grayScaleBlurredCanvas = this.getGrayScaleBlurredCanvas();
        ctx.globalAlpha = alpha;
        ctx.drawImage(grayScaleBlurredCanvas, x - r, y - r);
    };
    Heatmap.prototype.colorize = function (img) {
        var colorAttr = this.getAttribute('color');
        var pixels = img.data;
        var paletteCache = this.paletteCache;
        for (var i = 3; i < pixels.length; i += 4) {
            var alpha = pixels[i]; // get gradient color from opacity value
            if (isNumber(alpha)) {
                var palette = paletteCache[alpha] ? paletteCache[alpha] : ColorUtil.rgb2arr(colorAttr.gradient(alpha / 256));
                pixels[i - 3] = palette[0];
                pixels[i - 2] = palette[1];
                pixels[i - 1] = palette[2];
                pixels[i] = alpha;
            }
        }
    };
    Heatmap.prototype.getImageShape = function () {
        var imageShape = this.imageShape;
        if (imageShape) {
            return imageShape;
        }
        var container = this.container;
        imageShape = container.addShape({
            type: 'image',
            attrs: {},
        });
        this.imageShape = imageShape;
        return imageShape;
    };
    Heatmap.prototype.getShapeInfo = function (mappingData) {
        var shapeCfg = this.getDrawCfg(mappingData[0]);
        var data = mappingData.map(function (obj) {
            return obj[FIELD_ORIGIN];
        });
        return __assign(__assign({}, shapeCfg), { mappingData: mappingData, data: data });
    };
    return Heatmap;
}(Geometry));
export default Heatmap;
//# sourceMappingURL=heatmap.js.map