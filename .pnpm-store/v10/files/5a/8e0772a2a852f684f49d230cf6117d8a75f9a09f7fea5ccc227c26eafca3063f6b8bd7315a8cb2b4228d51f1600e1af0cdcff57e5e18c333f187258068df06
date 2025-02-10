"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalePool = void 0;
/**
 * view 中缓存 scale 的类
 */
var util_1 = require("@antv/util");
var scale_1 = require("../../util/scale");
/** @ignore */
var ScalePool = /** @class */ (function () {
    function ScalePool() {
        /** 所有的 scales */
        this.scales = new Map();
        /** 需要同步的 scale 分组， key: scaleKeyArray */
        this.syncScales = new Map();
    }
    /**
     * 创建 scale
     * @param field
     * @param data
     * @param scaleDef
     * @param key
     */
    ScalePool.prototype.createScale = function (field, data, scaleDef, key) {
        var finalScaleDef = scaleDef;
        var cacheScaleMeta = this.getScaleMeta(key);
        if (data.length === 0 && cacheScaleMeta) {
            // 在更新过程中数据变为空，同时 key 对应的 scale 已存在则保持 scale 同类型
            var cacheScale = cacheScaleMeta.scale;
            var cacheScaleDef = {
                type: cacheScale.type,
            };
            if (cacheScale.isCategory) {
                // 如果是分类类型，保持 values
                cacheScaleDef.values = cacheScale.values;
            }
            finalScaleDef = (0, util_1.deepMix)(cacheScaleDef, cacheScaleMeta.scaleDef, scaleDef);
        }
        var scale = (0, scale_1.createScaleByField)(field, data, finalScaleDef);
        // 缓存起来
        this.cacheScale(scale, scaleDef, key);
        return scale;
    };
    /**
     * 同步 scale
     */
    ScalePool.prototype.sync = function (coordinate, theme) {
        var _this = this;
        // 对于 syncScales 中每一个 syncKey 下面的 scale 数组进行同步处理
        this.syncScales.forEach(function (scaleKeys, syncKey) {
            // min, max, values, ranges
            var min = Number.MAX_SAFE_INTEGER;
            var max = Number.MIN_SAFE_INTEGER;
            var values = [];
            // 1. 遍历求得最大最小值，values 等
            (0, util_1.each)(scaleKeys, function (key) {
                var scale = _this.getScale(key);
                max = (0, util_1.isNumber)(scale.max) ? Math.max(max, scale.max) : max;
                min = (0, util_1.isNumber)(scale.min) ? Math.min(min, scale.min) : min;
                // 去重
                (0, util_1.each)(scale.values, function (v) {
                    if (!values.includes(v)) {
                        values.push(v);
                    }
                });
            });
            // 2. 同步
            (0, util_1.each)(scaleKeys, function (key) {
                var scale = _this.getScale(key);
                if (scale.isContinuous) {
                    scale.change({
                        min: min,
                        max: max,
                        values: values,
                    });
                }
                else if (scale.isCategory) {
                    var range = scale.range;
                    var cacheScaleMeta = _this.getScaleMeta(key);
                    // 存在 value 值，且用户没有配置 range 配置 to fix https://github.com/antvis/G2/issues/2996
                    if (values && !(0, util_1.get)(cacheScaleMeta, ['scaleDef', 'range'])) {
                        // 更新 range
                        range = (0, scale_1.getDefaultCategoryScaleRange)((0, util_1.deepMix)({}, scale, {
                            values: values,
                        }), coordinate, theme);
                    }
                    scale.change({
                        values: values,
                        range: range,
                    });
                }
            });
        });
    };
    /**
     * 缓存一个 scale
     * @param scale
     * @param scaleDef
     * @param key
     */
    ScalePool.prototype.cacheScale = function (scale, scaleDef, key) {
        // 1. 缓存到 scales
        var sm = this.getScaleMeta(key);
        // 存在则更新，同时检测类型是否一致
        if (sm && sm.scale.type === scale.type) {
            (0, scale_1.syncScale)(sm.scale, scale);
            sm.scaleDef = scaleDef;
            // 更新 scaleDef
        }
        else {
            sm = {
                key: key,
                scale: scale,
                scaleDef: scaleDef,
            };
            this.scales.set(key, sm);
        }
        // 2. 缓存到 syncScales，构造 Record<sync, string[]> 数据结构
        var syncKey = this.getSyncKey(sm);
        sm.syncKey = syncKey; // 设置 sync 同步的 key
        // 因为存在更新 scale 机制，所以在缓存之前，先从原 syncScales 中去除 sync 的缓存引用
        this.removeFromSyncScales(key);
        // 存在 sync 标记才进行 sync
        if (syncKey) {
            // 不存在这个 syncKey，则创建一个空数组
            var scaleKeys = this.syncScales.get(syncKey);
            if (!scaleKeys) {
                scaleKeys = [];
                this.syncScales.set(syncKey, scaleKeys);
            }
            scaleKeys.push(key);
        }
    };
    /**
     * 通过 key 获取 scale
     * @param key
     */
    ScalePool.prototype.getScale = function (key) {
        var scaleMeta = this.getScaleMeta(key);
        if (!scaleMeta) {
            var field = (0, util_1.last)(key.split('-'));
            var scaleKeys = this.syncScales.get(field);
            if (scaleKeys && scaleKeys.length) {
                scaleMeta = this.getScaleMeta(scaleKeys[0]);
            }
        }
        return scaleMeta && scaleMeta.scale;
    };
    /**
     * 在 view 销毁的时候，删除 scale 实例，防止内存泄露
     * @param key
     */
    ScalePool.prototype.deleteScale = function (key) {
        var scaleMeta = this.getScaleMeta(key);
        if (scaleMeta) {
            var syncKey = scaleMeta.syncKey;
            var scaleKeys = this.syncScales.get(syncKey);
            // 移除同步的关系
            if (scaleKeys && scaleKeys.length) {
                var idx = scaleKeys.indexOf(key);
                if (idx !== -1) {
                    scaleKeys.splice(idx, 1);
                }
            }
        }
        // 删除 scale 实例
        this.scales.delete(key);
    };
    /**
     * 清空
     */
    ScalePool.prototype.clear = function () {
        this.scales.clear();
        this.syncScales.clear();
    };
    /**
     * 删除 sync scale 引用
     * @param key
     */
    ScalePool.prototype.removeFromSyncScales = function (key) {
        var _this = this;
        this.syncScales.forEach(function (scaleKeys, syncKey) {
            var idx = scaleKeys.indexOf(key);
            if (idx !== -1) {
                scaleKeys.splice(idx, 1);
                // 删除空数组值
                if (scaleKeys.length === 0) {
                    _this.syncScales.delete(syncKey);
                }
                return false; // 跳出循环
            }
        });
    };
    /**
     * get sync key
     * @param sm
     */
    ScalePool.prototype.getSyncKey = function (sm) {
        var scale = sm.scale, scaleDef = sm.scaleDef;
        var field = scale.field;
        var sync = (0, util_1.get)(scaleDef, ['sync']);
        // 如果 sync = true，则直接使用字段名作为 syncKey
        return sync === true ? field : sync === false ? undefined : sync;
    };
    /**
     * 通过 key 获取 scale
     * @param key
     */
    ScalePool.prototype.getScaleMeta = function (key) {
        return this.scales.get(key);
    };
    return ScalePool;
}());
exports.ScalePool = ScalePool;
//# sourceMappingURL=scale-pool.js.map