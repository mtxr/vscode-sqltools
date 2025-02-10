"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g_base_1 = require("@antv/g-base");
var util_1 = require("@antv/util");
var LOCATION_FIELD_MAP = {
    none: [],
    point: ['x', 'y'],
    region: ['start', 'end'],
    points: ['points'],
    circle: ['center', 'radius', 'startAngle', 'endAngle'],
};
var Component = /** @class */ (function (_super) {
    tslib_1.__extends(Component, _super);
    function Component(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.initCfg();
        return _this;
    }
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    Component.prototype.getDefaultCfg = function () {
        return {
            id: '',
            name: '',
            type: '',
            locationType: 'none',
            offsetX: 0,
            offsetY: 0,
            animate: false,
            capture: true,
            updateAutoRender: false,
            animateOption: {
                appear: null,
                update: {
                    duration: 400,
                    easing: 'easeQuadInOut',
                },
                enter: {
                    duration: 400,
                    easing: 'easeQuadInOut',
                },
                leave: {
                    duration: 350,
                    easing: 'easeQuadIn',
                },
            },
            events: null,
            defaultCfg: {},
            visible: true,
        };
    };
    /**
     * 清理组件的内容，一般配合 render 使用
     * @example
     * axis.clear();
     * axis.render();
     */
    Component.prototype.clear = function () { };
    /**
     * 更新组件
     * @param {object} cfg 更新属性
     */
    Component.prototype.update = function (cfg) {
        var _this = this;
        var defaultCfg = this.get('defaultCfg') || {};
        util_1.each(cfg, function (value, name) {
            var originCfg = _this.get(name);
            var newCfg = value;
            if (originCfg !== value) {
                // 判断两者是否相等，主要是进行 null 的判定
                if (util_1.isObject(value) && defaultCfg[name]) {
                    // 新设置的属性与默认值进行合并
                    newCfg = util_1.deepMix({}, defaultCfg[name], value);
                }
                _this.set(name, newCfg);
            }
        });
        this.updateInner(cfg);
        this.afterUpdate(cfg);
    };
    // 更新内部
    Component.prototype.updateInner = function (cfg) {
    };
    Component.prototype.afterUpdate = function (cfg) {
        // 更新时考虑显示、隐藏
        if (util_1.hasKey(cfg, 'visible')) {
            if (cfg.visible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
        // 更新时考虑capture
        if (util_1.hasKey(cfg, 'capture')) {
            this.setCapture(cfg.capture);
        }
    };
    Component.prototype.getLayoutBBox = function () {
        return this.getBBox(); // 默认返回 getBBox，不同的组件内部单独实现
    };
    Component.prototype.getLocationType = function () {
        return this.get('locationType');
    };
    Component.prototype.getOffset = function () {
        return {
            offsetX: this.get('offsetX'),
            offsetY: this.get('offsetY'),
        };
    };
    // 默认使用 update
    Component.prototype.setOffset = function (offsetX, offsetY) {
        this.update({
            offsetX: offsetX,
            offsetY: offsetY,
        });
    };
    Component.prototype.setLocation = function (cfg) {
        var location = tslib_1.__assign({}, cfg);
        this.update(location);
    };
    // 实现 ILocation 接口的 getLocation
    Component.prototype.getLocation = function () {
        var _this = this;
        var location = {};
        var locationType = this.get('locationType');
        var fields = LOCATION_FIELD_MAP[locationType];
        util_1.each(fields, function (field) {
            location[field] = _this.get(field);
        });
        return location;
    };
    Component.prototype.isList = function () {
        return false;
    };
    Component.prototype.isSlider = function () {
        return false;
    };
    /**
     * @protected
     * 初始化，用于具体的组件继承
     */
    Component.prototype.init = function () { };
    // 将组件默认的配置项设置合并到传入的配置项
    Component.prototype.initCfg = function () {
        var _this = this;
        var defaultCfg = this.get('defaultCfg');
        util_1.each(defaultCfg, function (value, name) {
            var cfg = _this.get(name);
            if (util_1.isObject(cfg)) {
                var newCfg = util_1.deepMix({}, value, cfg);
                _this.set(name, newCfg);
            }
        });
    };
    return Component;
}(g_base_1.Base));
exports.default = Component;
//# sourceMappingURL=component.js.map