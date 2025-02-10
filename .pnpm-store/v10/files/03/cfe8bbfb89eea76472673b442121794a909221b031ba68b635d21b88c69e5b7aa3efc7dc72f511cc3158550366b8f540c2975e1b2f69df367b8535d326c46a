export default function addEventListener(target, eventType, callback) {
    if (target) {
        if (typeof target.addEventListener === 'function') {
            target.addEventListener(eventType, callback, false);
            return {
                remove: function () {
                    target.removeEventListener(eventType, callback, false);
                },
            };
            // @ts-ignore
        }
        if (typeof target.attachEvent === 'function') {
            // @ts-ignore
            target.attachEvent('on' + eventType, callback);
            return {
                remove: function () {
                    // @ts-ignore
                    target.detachEvent('on' + eventType, callback);
                },
            };
        }
    }
}
//# sourceMappingURL=add-event-listener.js.map