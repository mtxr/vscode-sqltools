export default function addEventListener(target: HTMLElement, eventType: string, callback: any) {
  if (target) {
    if (typeof target.addEventListener === 'function') {
      target.addEventListener(eventType, callback, false);
      return {
        remove() {
          target.removeEventListener(eventType, callback, false);
        },
      };
      // @ts-ignore
    }  if (typeof target.attachEvent === 'function') {
      // @ts-ignore
      target.attachEvent('on' + eventType, callback);
      return {
        remove() {
          // @ts-ignore
          target.detachEvent('on' + eventType, callback);
        },
      };
    }
  }
}
