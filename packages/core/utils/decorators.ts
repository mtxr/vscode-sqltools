
export function runIfPropIsDefined(prop: string) {
  return function(target, key, descriptor) {
    if (typeof descriptor === 'undefined') {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      if (typeof this[prop] === 'undefined') return;
      originalMethod.apply(this, args);
    };
  };
}

export function logOnCall(env?: string) {
  return function(_: any, prop: string, descriptor?: TypedPropertyDescriptor<any>): any {
    if (!env || process.env.NODE_ENV === env) {
      let fn, patched;

      if (descriptor) {
        fn = descriptor.value;
      }

      return {
        configurable: true,
        enumerable: false,
        get() {
          if (!patched) {
            patched = (...args) => {
              console.log('Called', prop);
              return fn.apply(this, args);
            }
          }
          return patched;

        },
        set(newFn) {
          patched = undefined;
          fn = newFn;
        },
      };
    }
  };
}
