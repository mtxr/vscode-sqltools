"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWaterWave = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var matrix_1 = require("../../../utils/matrix");
var DURATION = 5000;
/**
 * 一个线性映射的函数
 * @param min
 * @param max
 * @param factor
 */
function lerp(min, max, factor) {
    return min + (max - min) * factor;
}
/**
 * 波浪的 attrs
 * @param cfg
 */
function getFillAttrs(cfg) {
    var attrs = tslib_1.__assign({ opacity: 1 }, cfg.style);
    if (cfg.color && !attrs.fill) {
        attrs.fill = cfg.color;
    }
    return attrs;
}
/**
 * shape 的 attrs
 * @param cfg
 */
function getLineAttrs(cfg) {
    var defaultAttrs = {
        fill: '#fff',
        fillOpacity: 0,
        lineWidth: 4,
    };
    var attrs = (0, util_1.mix)({}, defaultAttrs, cfg.style);
    if (cfg.color && !attrs.stroke) {
        attrs.stroke = cfg.color;
    }
    if ((0, util_1.isNumber)(cfg.opacity)) {
        attrs.opacity = attrs.strokeOpacity = cfg.opacity;
    }
    return attrs;
}
/**
 * 用贝塞尔曲线模拟正弦波
 * Using Bezier curves to fit sine wave.
 * There is 4 control points for each curve of wave,
 * which is at 1/4 wave length of the sine wave.
 *
 * The control points for a wave from (a) to (d) are a-b-c-d:
 *          c *----* d
 *     b *
 *       |
 * ... a * ..................
 *
 * whose positions are a: (0, 0), b: (0.5, 0.5), c: (1, 1), d: (PI / 2, 1)
 *
 * @param x          x position of the left-most point (a)
 * @param stage      0-3, stating which part of the wave it is
 * @param waveLength wave length of the sine wave
 * @param amplitude  wave amplitude
 * @return 正弦片段曲线
 */
function getWaterWavePositions(x, stage, waveLength, amplitude) {
    if (stage === 0) {
        return [
            [x + ((1 / 2) * waveLength) / Math.PI / 2, amplitude / 2],
            [x + ((1 / 2) * waveLength) / Math.PI, amplitude],
            [x + waveLength / 4, amplitude],
        ];
    }
    if (stage === 1) {
        return [
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 2), amplitude],
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 1), amplitude / 2],
            [x + waveLength / 4, 0],
        ];
    }
    if (stage === 2) {
        return [
            [x + ((1 / 2) * waveLength) / Math.PI / 2, -amplitude / 2],
            [x + ((1 / 2) * waveLength) / Math.PI, -amplitude],
            [x + waveLength / 4, -amplitude],
        ];
    }
    return [
        [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 2), -amplitude],
        [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 1), -amplitude / 2],
        [x + waveLength / 4, 0],
    ];
}
/**
 * 获取水波路径
 * @param radius          半径
 * @param waterLevel      水位
 * @param waveLength      波长
 * @param phase           相位
 * @param amplitude       震幅
 * @param cx              圆心x
 * @param cy              圆心y
 * @return path            路径
 * @reference http://gitlab.alipay-inc.com/datavis/g6/blob/1.2.0/src/graph/utils/path.js#L135
 */
function getWaterWavePath(radius, waterLevel, waveLength, phase, amplitude, cx, cy) {
    var curves = Math.ceil(((2 * radius) / waveLength) * 4) * 4;
    var path = [];
    var _phase = phase;
    // map phase to [-Math.PI * 2, 0]
    while (_phase < -Math.PI * 2) {
        _phase += Math.PI * 2;
    }
    while (_phase > 0) {
        _phase -= Math.PI * 2;
    }
    _phase = (_phase / Math.PI / 2) * waveLength;
    var left = cx - radius + _phase - radius * 2;
    /**
     * top-left corner as start point
     *
     * draws this point
     *  |
     * \|/
     *  ~~~~~~~~
     *  |      |
     *  +------+
     */
    path.push(['M', left, waterLevel]);
    /**
     * top wave
     *
     * ~~~~~~~~ <- draws this sine wave
     * |      |
     * +------+
     */
    var waveRight = 0;
    for (var c = 0; c < curves; ++c) {
        var stage = c % 4;
        var pos = getWaterWavePositions((c * waveLength) / 4, stage, waveLength, amplitude);
        path.push([
            'C',
            pos[0][0] + left,
            -pos[0][1] + waterLevel,
            pos[1][0] + left,
            -pos[1][1] + waterLevel,
            pos[2][0] + left,
            -pos[2][1] + waterLevel,
        ]);
        if (c === curves - 1) {
            waveRight = pos[2][0];
        }
    }
    /**
     * top-right corner
     *
     *                       ~~~~~~~~
     * 3. draws this line -> |      | <- 1. draws this line
     *                       +------+
     *                          ^
     *                          |
     *                  2. draws this line
     */
    path.push(['L', waveRight + left, cy + radius]);
    path.push(['L', left, cy + radius]);
    path.push(['Z']);
    // path.push(['L', left, waterLevel]);
    return path;
}
/**
 * 添加水波
 * @param x           中心x
 * @param y           中心y
 * @param level       水位等级 0～1
 * @param waveCount   水波数
 * @param waveAttrs      色值
 * @param group       图组
 * @param clip        用于剪切的图形
 * @param radius      绘制图形的高度
 * @param waveLength  波的长度
 */
function addWaterWave(x, y, level, waveCount, waveAttrs, group, clip, radius, waveLength, animation) {
    // 盒子属性 颜色 宽高
    var fill = waveAttrs.fill, opacity = waveAttrs.opacity;
    var bbox = clip.getBBox();
    var width = bbox.maxX - bbox.minX;
    var height = bbox.maxY - bbox.minY;
    // 循环 waveCount 个数
    for (var idx = 0; idx < waveCount; idx++) {
        var factor = waveCount <= 1 ? 1 : idx / (waveCount - 1);
        // 画波
        var wave = group.addShape('path', {
            name: "waterwave-path",
            attrs: {
                // 波形路径配置
                path: getWaterWavePath(radius, bbox.minY + height * level, waveLength, 0, width / 32, // 波幅高度
                x, y),
                fill: fill,
                opacity: lerp(0.2, 0.9, factor) * opacity,
            },
        });
        try {
            // 默认 underfind 开启动画
            if (animation === false)
                return;
            var matrix = (0, matrix_1.transform)([['t', waveLength, 0]]);
            wave.stopAnimate();
            wave.animate({ matrix: matrix }, {
                duration: lerp(0.5 * DURATION, DURATION, factor),
                repeat: true,
            });
        }
        catch (e) {
            // TODO off-screen canvas 中动画会找不到 canvas
            console.warn('off-screen group animate error!');
        }
    }
}
exports.addWaterWave = addWaterWave;
/**
 *
 * @param x 中心 x
 * @param y 中心 y
 * @param width 外接矩形的宽
 * @param height 外接矩形的高
 */
function pin(x, y, width, height) {
    var w = (width * 2) / 3;
    var h = Math.max(w, height);
    var r = w / 2;
    // attrs of the upper circle
    var cx = x;
    var cy = r + y - h / 2;
    var theta = Math.asin(r / ((h - r) * 0.85));
    var dy = Math.sin(theta) * r;
    var dx = Math.cos(theta) * r;
    // the start point of the path
    var x0 = cx - dx;
    var y0 = cy + dy;
    // control point
    var cpX = x;
    var cpY = cy + r / Math.sin(theta);
    return "\n      M ".concat(x0, " ").concat(y0, "\n      A ").concat(r, " ").concat(r, " 0 1 1 ").concat(x0 + dx * 2, " ").concat(y0, "\n      Q ").concat(cpX, " ").concat(cpY, " ").concat(x, " ").concat(y + h / 2, "\n      Q ").concat(cpX, " ").concat(cpY, " ").concat(x0, " ").concat(y0, "\n      Z \n    ");
}
/**
 *
 * @param x 中心 x
 * @param y 中心 y
 * @param width 外接矩形的宽
 * @param height 外接矩形的高
 */
function circle(x, y, width, height) {
    var rx = width / 2;
    var ry = height / 2;
    return "\n      M ".concat(x, " ").concat(y - ry, " \n      a ").concat(rx, " ").concat(ry, " 0 1 0 0 ").concat(ry * 2, "\n      a ").concat(rx, " ").concat(ry, " 0 1 0 0 ").concat(-ry * 2, "\n      Z\n    ");
}
/**
 *
 * @param x 中心 x
 * @param y 中心 y
 * @param width 外接矩形的宽
 * @param height 外接矩形的高
 */
function diamond(x, y, width, height) {
    var h = height / 2;
    var w = width / 2;
    return "\n      M ".concat(x, " ").concat(y - h, "\n      L ").concat(x + w, " ").concat(y, "\n      L ").concat(x, " ").concat(y + h, "\n      L ").concat(x - w, " ").concat(y, "\n      Z\n    ");
}
/**
 *
 * @param x 中心 x
 * @param y 中心 y
 * @param width 外接矩形的宽
 * @param height 外接矩形的高
 */
function triangle(x, y, width, height) {
    var h = height / 2;
    var w = width / 2;
    return "\n      M ".concat(x, " ").concat(y - h, "\n      L ").concat(x + w, " ").concat(y + h, "\n      L ").concat(x - w, " ").concat(y + h, "\n      Z\n    ");
}
/**
 *
 * @param x 中心 x
 * @param y 中心 y
 * @param width 外接矩形的宽
 * @param height 外接矩形的高
 */
function rect(x, y, width, height) {
    var GOLDEN_SECTION_RATIO = 0.618;
    var h = height / 2;
    var w = (width / 2) * GOLDEN_SECTION_RATIO;
    return "\n      M ".concat(x - w, " ").concat(y - h, "\n      L ").concat(x + w, " ").concat(y - h, "\n      L ").concat(x + w, " ").concat(y + h, "\n      L ").concat(x - w, " ").concat(y + h, "\n      Z\n    ");
}
var builtInShapeByName = {
    pin: pin,
    circle: circle,
    diamond: diamond,
    triangle: triangle,
    rect: rect,
};
(0, g2_1.registerShape)('interval', 'liquid-fill-gauge', {
    draw: function (cfg, container) {
        var cx = 0.5;
        var cy = 0.5;
        var customInfo = cfg.customInfo;
        var _a = customInfo, percent = _a.percent, radio = _a.radius, shape = _a.shape, shapeStyle = _a.shapeStyle, background = _a.background, animation = _a.animation;
        var outline = customInfo.outline;
        var wave = customInfo.wave;
        var border = outline.border, distance = outline.distance;
        var waveCount = wave.count, waveLength = wave.length;
        // 获取最小 minX
        var minX = (0, util_1.reduce)(cfg.points, function (r, p) {
            return Math.min(r, p.x);
        }, Infinity);
        var center = this.parsePoint({ x: cx, y: cy });
        var minXPoint = this.parsePoint({ x: minX, y: cy });
        var halfWidth = center.x - minXPoint.x;
        // 保证半径是 画布宽高最小值的 radius 值
        var radius = Math.min(halfWidth, minXPoint.y * radio);
        var waveAttrs = getFillAttrs(cfg);
        var outlineAttrs = getLineAttrs((0, util_1.mix)({}, cfg, outline));
        var innerRadius = radius - border / 2;
        var buildPath = typeof shape === 'function' ? shape : builtInShapeByName[shape] || builtInShapeByName['circle'];
        var shapePath = buildPath(center.x, center.y, innerRadius * 2, innerRadius * 2);
        // 1. 当 shapeStyle 不为空时，绘制形状样式作为背景
        if (shapeStyle) {
            container.addShape('path', {
                name: 'shape',
                attrs: tslib_1.__assign({ path: shapePath }, shapeStyle),
            });
        }
        // 比例大于 0 时才绘制水波
        if (percent > 0) {
            // 2. 绘制一个波
            var waves = container.addGroup({
                name: 'waves',
            });
            // 3. 波对应的 clip 裁剪形状
            var clipPath = waves.setClip({
                type: 'path',
                attrs: {
                    path: shapePath,
                },
            });
            // 4. 绘制波形
            addWaterWave(center.x, center.y, 1 - cfg.points[1].y, waveCount, waveAttrs, waves, clipPath, radius * 2, waveLength, animation);
        }
        // 5. 绘制一个 distance 宽的 border
        container.addShape('path', {
            name: 'distance',
            attrs: {
                path: shapePath,
                fill: 'transparent',
                lineWidth: border + distance * 2,
                stroke: background === 'transparent' ? '#fff' : background,
            },
        });
        // 6. 绘制一个 border 宽的 border
        container.addShape('path', {
            name: 'wrap',
            attrs: (0, util_1.mix)(outlineAttrs, {
                path: shapePath,
                fill: 'transparent',
                lineWidth: border,
            }),
        });
        return container;
    },
});
//# sourceMappingURL=liquid.js.map