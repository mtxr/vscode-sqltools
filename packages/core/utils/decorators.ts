
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

export function logOnCall(opts: Partial<{ message: string; trace: boolean, prefix: string; env: string; verbose: boolean | Function, args: any[] }> = {}) {
  return function(_: any, prop: string, descriptor?: TypedPropertyDescriptor<any>): any {
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
            if (!opts.env || process.env.NODE_ENV === opts.env) {
              console[opts.trace ? 'trace' : 'log'](opts.message || `${opts.prefix || 'Called'} ${prop}`);
              if (typeof opts.verbose === 'function') {
                opts.verbose(args);
              } else if (opts.verbose) {
                console.table(args);
              }
            }
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
  };
}
