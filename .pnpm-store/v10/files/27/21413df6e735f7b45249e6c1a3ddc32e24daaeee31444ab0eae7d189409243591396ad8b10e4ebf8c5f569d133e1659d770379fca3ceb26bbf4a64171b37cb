export interface Ele {
  [idx: number]: number | string;
}

export default function rectPath(x: number, y: number, w: number, h: number, r?: number): Ele[] {
  if (r) {
    return [
      [ 'M', +x + (+r), y ],
      [ 'l', w - r * 2, 0 ],
      [ 'a', r, r, 0, 0, 1, r, r ],
      [ 'l', 0, h - r * 2 ],
      [ 'a', r, r, 0, 0, 1, -r, r ],
      [ 'l', r * 2 - w, 0 ],
      [ 'a', r, r, 0, 0, 1, -r, -r ],
      [ 'l', 0, r * 2 - h ],
      [ 'a', r, r, 0, 0, 1, r, -r ],
      [ 'z' ],
    ];
  }
  return [
    [ 'M', x, y ],
    [ 'l', w, 0 ],
    [ 'l', 0, h ],
    [ 'l', -w, 0 ],
    [ 'z' ],
  ];
  // res.parsePathArray = parsePathArray;
}
