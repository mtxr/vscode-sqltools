export function sortText(a: string, b: string) {
  return a.toString().localeCompare(b.toString());
}

export function numericVersion(v: string) {
  const n: number[] = v
    .replace(/^v/, '')
    .split('.')
    .map(a => parseInt(a.replace(/\D+/, ''), 10));
  if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
  if (n.length === 2) return n[0] * 10000 + n[1] * 100;
  return n[0] * 10000;
}
