import { isFunction } from '@antv/util';
var MyWorker = /** @class */ (function () {
    function MyWorker(url) {
        var _this = this;
        this.queue = [];
        this.worker = new Worker(url);
        this.worker.onmessage = function (e) {
            var _a;
            (_a = _this.queue.shift()) === null || _a === void 0 ? void 0 : _a.resolve(e);
        };
        this.worker.onmessageerror = function (e) {
            var _a;
            console.warn('[AntV G2] Web worker is not available');
            (_a = _this.queue.shift()) === null || _a === void 0 ? void 0 : _a.reject(e);
        };
    }
    MyWorker.prototype.post = function (params, onError) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.queue.push({ resolve: resolve, reject: reject });
            try {
                _this.worker.postMessage(params);
            }
            catch (e) {
                console.warn('[AntV G2] Web worker is not available');
                isFunction(onError) && onError();
            }
        });
    };
    MyWorker.prototype.destroy = function () {
        this.worker.terminate();
    };
    return MyWorker;
}());
export function createWorker(f) {
    if (typeof window === 'undefined')
        return;
    var blob;
    try {
        blob = new Blob([f.toString()], { type: 'application/javascript' });
    }
    catch (e) {
        // @ts-ignore
        blob = new window.BlobBuilder();
        blob.append(f.toString());
        blob = blob.getBlob();
    }
    return new MyWorker(URL.createObjectURL(blob));
}
//# sourceMappingURL=createWorker.js.map