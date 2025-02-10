"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overlap = exports.fixedOverlap = void 0;
var util_1 = require("@antv/util");
var MAX_TIMES = 100;
/**
 * @ignore
 * Greedy 贪婪算法
 */
var Greedy = /** @class */ (function () {
    function Greedy(cfg) {
        if (cfg === void 0) { cfg = {}; }
        this.bitmap = {};
        var _a = cfg.xGap, xGap = _a === void 0 ? 1 : _a, _b = cfg.yGap, yGap = _b === void 0 ? 8 : _b;
        this.xGap = xGap;
        this.yGap = yGap;
    }
    Greedy.prototype.hasGap = function (bbox) {
        var hasGap = true;
        var bitmap = this.bitmap;
        var minX = Math.round(bbox.minX);
        var maxX = Math.round(bbox.maxX);
        var minY = Math.round(bbox.minY);
        var maxY = Math.round(bbox.maxY);
        for (var i = minX; i <= maxX; i += 1) {
            if (!bitmap[i]) {
                bitmap[i] = {};
                continue;
            }
            if (i === minX || i === maxX) {
                for (var j = minY; j <= maxY; j++) {
                    if (bitmap[i][j]) {
                        hasGap = false;
                        break;
                    }
                }
            }
            else {
                if (bitmap[i][minY] || bitmap[i][maxY]) {
                    hasGap = false;
                    break;
                }
            }
        }
        return hasGap;
    };
    Greedy.prototype.fillGap = function (bbox) {
        var bitmap = this.bitmap;
        var minX = Math.round(bbox.minX);
        var maxX = Math.round(bbox.maxX);
        var minY = Math.round(bbox.minY);
        var maxY = Math.round(bbox.maxY);
        // filling grid
        for (var i = minX; i <= maxX; i += 1) {
            if (!bitmap[i]) {
                bitmap[i] = {};
            }
        }
        for (var i = minX; i <= maxX; i += this.xGap) {
            for (var j = minY; j <= maxY; j += this.yGap) {
                bitmap[i][j] = true;
            }
            bitmap[i][maxY] = true;
        }
        // filling y edges
        if (this.yGap !== 1) {
            for (var i = minY; i <= maxY; i += 1) {
                bitmap[minX][i] = true;
                bitmap[maxX][i] = true;
            }
        }
        // filling x edges
        if (this.xGap !== 1) {
            for (var i = minX; i <= maxX; i += 1) {
                bitmap[i][minY] = true;
                bitmap[i][maxY] = true;
            }
        }
    };
    Greedy.prototype.destroy = function () {
        this.bitmap = {};
    };
    return Greedy;
}());
function spiralFill(label, greedy, maxTimes) {
    if (maxTimes === void 0) { maxTimes = MAX_TIMES; }
    var dt = -1;
    var _a = label.attr(), x = _a.x, y = _a.y;
    var bbox = label.getCanvasBBox();
    var maxDelta = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height);
    var dxdy;
    var t = -dt;
    var dx = 0;
    var dy = 0;
    var f = function (param) {
        var nt = param * 0.1;
        return [nt * Math.cos(nt), nt * Math.sin(nt)];
    };
    if (greedy.hasGap(bbox)) {
        greedy.fillGap(bbox);
        return true;
    }
    var canFill = false;
    var times = 0;
    var accessedCache = {};
    while (Math.min(Math.abs(dx), Math.abs(dy)) < maxDelta && times < maxTimes) {
        dxdy = f((t += dt));
        dx = ~~dxdy[0];
        dy = ~~dxdy[1];
        if ((!dx && !dy) || accessedCache["".concat(dx, "-").concat(dy)]) {
            continue;
        }
        label.attr({ x: x + dx, y: y + dy });
        if (dx + dy < 0) {
            label.attr('textAlign', 'right');
        }
        times++;
        if (greedy.hasGap(label.getCanvasBBox())) {
            greedy.fillGap(label.getCanvasBBox());
            canFill = true;
            accessedCache["".concat(dx, "-").concat(dy)] = true;
            break;
        }
    }
    return canFill;
}
/*
 *  根据如下规则尝试放置label
 *                5
 *        ------------------
 *        |    1   |   0   |
 *    8   —————————4————————   7
 *        |    2   |   3   |
 *        ——————————————————
 *                 6
 */
function adjustLabelPosition(label, x, y, index) {
    var _a = label.getCanvasBBox(), width = _a.width, height = _a.height;
    var attrs = {
        x: x,
        y: y,
        textAlign: 'center',
    };
    switch (index) {
        case 0:
            attrs.y -= height + 1;
            attrs.x += 1;
            attrs.textAlign = 'left';
            break;
        case 1:
            attrs.y -= height + 1;
            attrs.x -= 1;
            attrs.textAlign = 'right';
            break;
        case 2:
            attrs.y += height + 1;
            attrs.x -= 1;
            attrs.textAlign = 'right';
            break;
        case 3:
            attrs.y += height + 1;
            attrs.x += 1;
            attrs.textAlign = 'left';
            break;
        case 5:
            attrs.y -= height * 2 + 2;
            break;
        case 6:
            attrs.y += height * 2 + 2;
            break;
        case 7:
            attrs.x += width + 1;
            attrs.textAlign = 'left';
            break;
        case 8:
            attrs.x -= width + 1;
            attrs.textAlign = 'right';
            break;
        default:
            break;
    }
    label.attr(attrs);
    return label.getCanvasBBox();
}
/**
 * @ignore
 * label 防遮挡布局：在不改变 label 位置的情况下对相互重叠的 label 进行调整。
 * 不同于 'overlap' 类型的布局，该布局不会对 label 的位置进行偏移调整。
 * @param labels 参与布局调整的 label 数组集合
 */
function fixedOverlap(items, labels, shapes, region) {
    var greedy = new Greedy();
    (0, util_1.each)(labels, function (label) {
        var labelShape = label.find(function (shape) { return shape.get('type') === 'text'; });
        if (!spiralFill(labelShape, greedy)) {
            label.remove(true);
        }
    });
    greedy.destroy();
}
exports.fixedOverlap = fixedOverlap;
/**
 * @ignore
 * label 防遮挡布局：为了防止 label 之间相互覆盖同时保证尽可能多 的 label 展示，通过尝试将 label 向**四周偏移**来剔除放不下的 label
 * @param labels 参与布局调整的 label 数组集合
 */
function overlap(items, labels, shapes, region) {
    var greedy = new Greedy();
    (0, util_1.each)(labels, function (label) {
        var labelShape = label.find(function (shape) { return shape.get('type') === 'text'; });
        var _a = labelShape.attr(), x = _a.x, y = _a.y;
        var canFill = false;
        for (var i = 0; i <= 8; i++) {
            var bbox = adjustLabelPosition(labelShape, x, y, i);
            if (greedy.hasGap(bbox)) {
                greedy.fillGap(bbox);
                canFill = true;
                break;
            }
        }
        if (!canFill) {
            label.remove(true);
        }
    });
    greedy.destroy();
}
exports.overlap = overlap;
//# sourceMappingURL=overlap.js.map