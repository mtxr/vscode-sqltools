export function ifProp(prop: string) {
  return function (target, key, descriptor) {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      if (typeof this[prop] === 'undefined') return;
      originalMethod.apply(this, args);
    }
  }
}
