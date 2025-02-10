export const trunc = function (v: number): number {
  return v > 0 ? Math.floor(v) : Math.ceil(v);
};

export function formatNum(num: number, digits?: number) {
  const pow = Math.pow(10, digits === undefined ? 6 : digits);
  return Math.round(num * pow) / pow;
}

export function wrapNum(x: number, range: number[], includeMax?: boolean): number {
  const max = range[1];
  const min = range[0];
  const d = max - min;
  return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}
