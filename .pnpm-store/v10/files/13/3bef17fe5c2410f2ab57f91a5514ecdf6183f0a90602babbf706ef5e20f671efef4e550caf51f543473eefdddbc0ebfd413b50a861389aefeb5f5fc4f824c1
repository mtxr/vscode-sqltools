import { createElement } from 'react';

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

var SVG = function (_a) {
    var animate = _a.animate, backgroundColor = _a.backgroundColor, backgroundOpacity = _a.backgroundOpacity, baseUrl = _a.baseUrl, children = _a.children, foregroundColor = _a.foregroundColor, foregroundOpacity = _a.foregroundOpacity, gradientRatio = _a.gradientRatio, uniqueKey = _a.uniqueKey, interval = _a.interval, rtl = _a.rtl, speed = _a.speed, style = _a.style, title = _a.title, props = __rest(_a, ["animate", "backgroundColor", "backgroundOpacity", "baseUrl", "children", "foregroundColor", "foregroundOpacity", "gradientRatio", "uniqueKey", "interval", "rtl", "speed", "style", "title"]);
    var fixedId = uniqueKey || uid();
    var idClip = fixedId + "-diff";
    var idGradient = fixedId + "-animated-diff";
    var idAria = fixedId + "-aria";
    var rtlStyle = rtl ? { transform: 'scaleX(-1)' } : null;
    var keyTimes = "0; " + interval + "; 1";
    var dur = speed + "s";
    return (createElement("svg", __assign({ "aria-labelledby": idAria, role: "img", style: __assign(__assign({}, style), rtlStyle) }, props),
        title ? createElement("title", { id: idAria }, title) : null,
        createElement("rect", { role: "presentation", x: "0", y: "0", width: "100%", height: "100%", clipPath: "url(" + baseUrl + "#" + idClip + ")", style: { fill: "url(" + baseUrl + "#" + idGradient + ")" } }),
        createElement("defs", { role: "presentation" },
            createElement("clipPath", { id: idClip }, children),
            createElement("linearGradient", { id: idGradient },
                createElement("stop", { offset: "0%", stopColor: backgroundColor, stopOpacity: backgroundOpacity }, animate && (createElement("animate", { attributeName: "offset", values: -gradientRatio + "; " + -gradientRatio + "; 1", keyTimes: keyTimes, dur: dur, repeatCount: "indefinite" }))),
                createElement("stop", { offset: "50%", stopColor: foregroundColor, stopOpacity: foregroundOpacity }, animate && (createElement("animate", { attributeName: "offset", values: -gradientRatio / 2 + "; " + -gradientRatio / 2 + "; " + (1 +
                        gradientRatio / 2), keyTimes: keyTimes, dur: dur, repeatCount: "indefinite" }))),
                createElement("stop", { offset: "100%", stopColor: backgroundColor, stopOpacity: backgroundOpacity }, animate && (createElement("animate", { attributeName: "offset", values: "0; 0; " + (1 + gradientRatio), keyTimes: keyTimes, dur: dur, repeatCount: "indefinite" })))))));
};
SVG.defaultProps = {
    animate: true,
    backgroundColor: '#f5f6f7',
    backgroundOpacity: 1,
    baseUrl: '',
    foregroundColor: '#eee',
    foregroundOpacity: 1,
    gradientRatio: 2,
    id: null,
    interval: 0.25,
    rtl: false,
    speed: 1.2,
    style: {},
    title: 'Loading...',
};

var ContentLoader = function (props) {
    return props.children ? createElement(SVG, __assign({}, props)) : createElement(ReactContentLoaderFacebook, __assign({}, props));
};

var ReactContentLoaderFacebook = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 476 124" }, props),
    createElement("rect", { x: "48", y: "8", width: "88", height: "6", rx: "3" }),
    createElement("rect", { x: "48", y: "26", width: "52", height: "6", rx: "3" }),
    createElement("rect", { x: "0", y: "56", width: "410", height: "6", rx: "3" }),
    createElement("rect", { x: "0", y: "72", width: "380", height: "6", rx: "3" }),
    createElement("rect", { x: "0", y: "88", width: "178", height: "6", rx: "3" }),
    createElement("circle", { cx: "20", cy: "20", r: "20" }))); };

var ReactContentLoaderInstagram = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 400 460" }, props),
    createElement("circle", { cx: "31", cy: "31", r: "15" }),
    createElement("rect", { x: "58", y: "18", rx: "2", ry: "2", width: "140", height: "10" }),
    createElement("rect", { x: "58", y: "34", rx: "2", ry: "2", width: "140", height: "10" }),
    createElement("rect", { x: "0", y: "60", rx: "2", ry: "2", width: "400", height: "400" }))); };

var ReactContentLoaderCode = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 340 84" }, props),
    createElement("rect", { x: "0", y: "0", width: "67", height: "11", rx: "3" }),
    createElement("rect", { x: "76", y: "0", width: "140", height: "11", rx: "3" }),
    createElement("rect", { x: "127", y: "48", width: "53", height: "11", rx: "3" }),
    createElement("rect", { x: "187", y: "48", width: "72", height: "11", rx: "3" }),
    createElement("rect", { x: "18", y: "48", width: "100", height: "11", rx: "3" }),
    createElement("rect", { x: "0", y: "71", width: "37", height: "11", rx: "3" }),
    createElement("rect", { x: "18", y: "23", width: "140", height: "11", rx: "3" }),
    createElement("rect", { x: "166", y: "23", width: "173", height: "11", rx: "3" }))); };

var ReactContentLoaderListStyle = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 400 110" }, props),
    createElement("rect", { x: "0", y: "0", rx: "3", ry: "3", width: "250", height: "10" }),
    createElement("rect", { x: "20", y: "20", rx: "3", ry: "3", width: "220", height: "10" }),
    createElement("rect", { x: "20", y: "40", rx: "3", ry: "3", width: "170", height: "10" }),
    createElement("rect", { x: "0", y: "60", rx: "3", ry: "3", width: "250", height: "10" }),
    createElement("rect", { x: "20", y: "80", rx: "3", ry: "3", width: "200", height: "10" }),
    createElement("rect", { x: "20", y: "100", rx: "3", ry: "3", width: "80", height: "10" }))); };

var ReactContentLoaderBulletList = function (props) { return (createElement(ContentLoader, __assign({ viewBox: "0 0 245 125" }, props),
    createElement("circle", { cx: "10", cy: "20", r: "8" }),
    createElement("rect", { x: "25", y: "15", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement("circle", { cx: "10", cy: "50", r: "8" }),
    createElement("rect", { x: "25", y: "45", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement("circle", { cx: "10", cy: "80", r: "8" }),
    createElement("rect", { x: "25", y: "75", rx: "5", ry: "5", width: "220", height: "10" }),
    createElement("circle", { cx: "10", cy: "110", r: "8" }),
    createElement("rect", { x: "25", y: "105", rx: "5", ry: "5", width: "220", height: "10" }))); };

export default ContentLoader;
export { ReactContentLoaderBulletList as BulletList, ReactContentLoaderCode as Code, ReactContentLoaderFacebook as Facebook, ReactContentLoaderInstagram as Instagram, ReactContentLoaderListStyle as List };
//# sourceMappingURL=react-content-loader.es.js.map
