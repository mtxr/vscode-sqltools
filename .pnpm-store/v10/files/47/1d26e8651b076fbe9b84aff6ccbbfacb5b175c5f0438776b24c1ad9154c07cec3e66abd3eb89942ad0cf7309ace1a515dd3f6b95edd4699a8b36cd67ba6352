"use strict";
/*! isStandalonePWA 0.1.1
    Detect if PWA is running in standalone mode
    https://github.com/faisalman/is-standalone-pwa
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStandalonePWA = isStandalonePWA;
function isStandalonePWA() {
    var _a;
    return typeof window !== 'undefined' &&
        ((window === null || window === void 0 ? void 0 : window.matchMedia('(display-mode: standalone)').matches) ||
            ((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone) ||
            document.referrer.startsWith('android-app://') ||
            (window === null || window === void 0 ? void 0 : window.Windows) ||
            /trident.+(msapphost|webview)\//i.test(navigator.userAgent) ||
            document.referrer.startsWith('app-info://platform/microsoft-store'));
}
;
