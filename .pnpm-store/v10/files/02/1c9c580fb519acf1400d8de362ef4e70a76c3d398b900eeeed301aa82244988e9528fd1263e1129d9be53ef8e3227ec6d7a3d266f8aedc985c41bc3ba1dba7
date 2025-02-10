// export function getPointAtSegLength(p1x: number, p1y: number, c1x: number, c1y: number, c2x: number, c2y: number, p2x: number, p2y: number, t: number) {
//   const t1 = 1 - t;
//   return {
//     x: (t1 ** 3) * p1x
//       + t1 * t1 * 3 * t * c1x
//       + t1 * 3 * t * t * c2x
//       + (t ** 3) * p2x,
//     y: (t1 ** 3) * p1y
//       + t1 * t1 * 3 * t * c1y
//       + t1 * 3 * t * t * c2y
//       + (t ** 3) * p2y,
//   };
// }

// export function midPoint(a: number[], b: number[], t: number) {
//   const ax = a[0];
//   const ay = a[1];
//   const bx = b[0];
//   const by = b[1];
//   return [ax + (bx - ax) * t, ay + (by - ay) * t];
// }

export function lineToCubic(x1: number, y1: number, x2: number, y2: number) {

  return [ x1, y1, x2, y2, x2, y2 ];
  // const t = 0.5;
  // const p0 = [x1, y1];
  // const p1 = [x2, y2];
  // const p2 = midPoint(p0, p1, t);
  // const p3 = midPoint(p1, p2, t);
  // const p4 = midPoint(p2, p3, t);
  // const p5 = midPoint(p3, p4, t);
  // const p6 = midPoint(p4, p5, t);
  // const cp1 = getPointAtSegLength.apply(0, p0.concat(p2, p4, p6, t));
  // const cp2 = getPointAtSegLength.apply(0, p6.concat(p5, p3, p1, 0));

  // return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
}