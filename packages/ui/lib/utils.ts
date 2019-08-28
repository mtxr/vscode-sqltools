export interface ValidationFunction {
  (...args: any[]): boolean;
  errorMessage?: string;
}
export function int(v) {
  return notEmpty(v) ? parseInt(v, 10) : null;
}
export function bool(v) {
  if (typeof v === 'undefined') return false;
  v = v.toString().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'y';
}
export const notEmpty: ValidationFunction = function(value) {
  return value && value.toString().trim().length > 0;
};
notEmpty.errorMessage = '{0} can\'t be empty';

export const gtz: ValidationFunction = function(value) {
  value = int(value);
  return value > 0;
};
gtz.errorMessage = '{0} should be greater than zero';

export function inRange(max, min) {
  return (value) => {
    value = int(value);
    return value >= min && value <= max;
  };
}


export const clipboardInsert = (value, format = 'text/plain') => {
  value = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const listener = function(e: ClipboardEvent) {
    e.clipboardData.setData(format, value);
    e.preventDefault();
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}

const isRegExMatcher = /^\/(.+)\/(\w+)?$/gi;

export function toRegEx(value: string | RegExp) {
  if (value instanceof RegExp) return value;
  try {
    if (isRegExMatcher.test(value)) {
      try {
        return eval(value.replace(isRegExMatcher, '/($1)/$2'));
      } catch(ee) {}
    }
    return new RegExp(value, 'gi');
  } catch (e) { }
  return value;
}