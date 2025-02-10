import React__default, { Component, createElement } from 'react';
import Svg, { LinearGradient, Rect, Defs, ClipPath, Stop, Circle } from 'react-native-svg';
export { Circle, Path, Rect } from 'react-native-svg';
import { Animated } from 'react-native';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var uid = (function () {
    return Math.random()
        .toString(36)
        .substring(6);
});

var AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
var NativeSvg = /** @class */ (function (_super) {
    __extends(NativeSvg, _super);
    function NativeSvg() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animatedValue = new Animated.Value(-1);
        _this.fixedId = _this.props.uniqueKey || uid();
        _this.idClip = _this.fixedId + "-diff";
        _this.idGradient = _this.fixedId + "-animated-diff";
        _this.setAnimation = function () {
            // Turn in seconds to keep compatible with web one
            var durInSeconds = _this.props.speed * 1000;
            Animated.timing(_this.animatedValue, {
                toValue: 2,
                delay: durInSeconds,
                duration: durInSeconds,
                useNativeDriver: true,
            }).start(function () {
                _this.animatedValue.setValue(-1);
                _this.setAnimation();
            });
        };
        _this.componentDidMount = function () {
            if (_this.props.animate) {
                _this.setAnimation();
            }
        };
        return _this;
    }
    NativeSvg.prototype.render = function () {
        var _a = this.props, children = _a.children, backgroundColor = _a.backgroundColor, foregroundColor = _a.foregroundColor, rtl = _a.rtl, style = _a.style, props = __rest(_a, ["children", "backgroundColor", "foregroundColor", "rtl", "style"]);
        var x1Animation = this.animatedValue.interpolate({
            extrapolate: 'clamp',
            inputRange: [-1, 2],
            outputRange: ['-100%', '100%'],
        });
        var x2Animation = this.animatedValue.interpolate({
            extrapolate: 'clamp',
            inputRange: [-1, 2],
            outputRange: ['0%', '200%'],
        });
        var rtlStyle = rtl ? { transform: [{ rotateY: '180deg' }] } : {};
        var svgStyle = Object.assign(Object.assign({}, style), rtlStyle);
        // Remove unnecessary keys
        delete props.uniqueKey;
        delete props.animate;
        delete props.speed;
        return (React__default.createElement(Svg, __assign({ style: svgStyle }, props),
            React__default.createElement(Rect, { x: "0", y: "0", width: "100%", height: "100%", fill: "url(#" + this.idClip + ")", clipPath: "url(#" + this.idGradient + ")" }),
            React__default.createElement(Defs, null,
                React__default.createElement(ClipPath, { id: this.idGradient }, children),
                React__default.createElement(AnimatedLinearGradient, { id: this.idClip, x1: x1Animation, x2: x2Animation, y1: 0, y2: 0 },
                    React__default.createElement(Stop, { offset: 0, stopColor: backgroundColor }),
                    React__default.createElement(Stop, { offset: 0.5, stopColor: foregroundColor }),
                    React__default.createElement(Stop, { offset: 1, stopColor: backgroundColor })))));
    };
    NativeSvg.defaultProps = {
        animate: true,
        backgroundColor: '#f5f6f7',
        foregroundColor: '#eee',
        rtl: false,
        speed: 1.2,
        style: {},
    };
    return NativeSvg;
}(Component));

var ContentLoader = function (props) {
    return props.children ? createElement(NativeSvg, __assign({}, props)) : createElement(ReactContentLoaderFacebook, __assign({}, props));
};

var ReactContentLoaderFacebook = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 476 124", width: 476, height: 124 }, props),
    createElement(Rect, { x: "48", y: "8", width: "88", height: "6", rx: "3" }),
    createElement(Rect, { x: "48", y: "26", width: "52", height: "6", rx: "3" }),
    createElement(Rect, { x: "0", y: "56", width: "410", height: "6", rx: "3" }),
    createElement(Rect, { x: "0", y: "72", width: "380", height: "6", rx: "3" }),
    createElement(Rect, { x: "0", y: "88", width: "178", height: "6", rx: "3" }),
    createElement(Circle, { cx: "20", cy: "20", r: "20" }))); };

var ReactContentLoaderInstagram = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 400 460", width: 400, height: 460 }, props),
    createElement(Circle, { cx: "31", cy: "31", r: "15" }),
    createElement(Rect, { x: "58", y: "18", rx: "2", ry: "2", width: "140", height: "10" }),
    createElement(Rect, { x: "58", y: "34", rx: "2", ry: "2", width: "140", height: "10" }),
    createElement(Rect, { x: "0", y: "60", rx: "2", ry: "2", width: "400", height: "400" }))); };

var ReactContentLoaderCode = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 340 84", width: 340, height: 84 }, props),
    createElement(Rect, { x: "0", y: "0", width: "67", height: "11", rx: "3" }),
    createElement(Rect, { x: "76", y: "0", width: "140", height: "11", rx: "3" }),
    createElement(Rect, { x: "127", y: "48", width: "53", height: "11", rx: "3" }),
    createElement(Rect, { x: "187", y: "48", width: "72", height: "11", rx: "3" }),
    createElement(Rect, { x: "18", y: "48", width: "100", height: "11", rx: "3" }),
    createElement(Rect, { x: "0", y: "71", width: "37", height: "11", rx: "3" }),
    createElement(Rect, { x: "18", y: "23", width: "140", height: "11", rx: "3" }),
    createElement(Rect, { x: "166", y: "23", width: "173", height: "11", rx: "3" }))); };

var ReactContentLoaderListStyle = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 400 110", width: 400, height: 110 }, props),
    createElement(Rect, { x: "0", y: "0", rx: "3", ry: "3", width: "250", height: "10" }),
    createElement(Rect, { x: "20", y: "20", rx: "3", ry: "3", width: "220", height: "10" }),
    createElement(Rect, { x: "20", y: "40", rx: "3", ry: "3", width: "170", height: "10" }),
    createElement(Rect, { x: "0", y: "60", rx: "3", ry: "3", width: "250", height: "10" }),
    createElement(Rect, { x: "20", y: "80", rx: "3", ry: "3", width: "200", height: "10" }),
    createElement(Rect, { x: "20", y: "100", rx: "3", ry: "3", width: "80", height: "10" }))); };

var ReactContentLoaderBulletList = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 245 125", width: 245, height: 125 }, props),
    createElement(Circle, { cx: "10", cy: "20", r: "8" }),
    createElement(Rect, { x: "25", y: "15", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement(Circle, { cx: "10", cy: "50", r: "8" }),
    createElement(Rect, { x: "25", y: "45", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement(Circle, { cx: "10", cy: "80", r: "8" }),
    createElement(Rect, { x: "25", y: "75", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement(Circle, { cx: "10", cy: "110", r: "8" }),
    createElement(Rect, { x: "25", y: "105", rx: "5", ry: "5", width: "220", height: "10" }))); };

export default ContentLoader;
export { ReactContentLoaderBulletList as BulletList, ReactContentLoaderCode as Code, ReactContentLoaderFacebook as Facebook, ReactContentLoaderInstagram as Instagram, ReactContentLoaderListStyle as List };
//# sourceMappingURL=react-content-loader.native.es.js.map
