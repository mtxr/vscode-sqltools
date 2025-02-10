const Symbols = {
  // 圆
  circle(x: number, y: number, r: number): any[] {
    return [
      ['M', x, y],
      ['m', -r, 0],
      ['a', r, r, 0, 1, 0, r * 2, 0],
      ['a', r, r, 0, 1, 0, -r * 2, 0],
    ];
  },
  // 正方形
  square(x: number, y: number, r: number): any[] {
    return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
  },
  // 菱形
  diamond(x: number, y: number, r: number): any[] {
    return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
  },
  // 三角形
  triangle(x: number, y: number, r: number): any[] {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['z']];
  },
  // 倒三角形
  triangleDown(x: number, y: number, r: number): any[] {
    const diffY = r * Math.sin((1 / 3) * Math.PI);
    return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
  },
};

export type SymbolFunc = (x: number, y: number, r: number) => any[];

export default {
  get(type: string): SymbolFunc {
    return Symbols[type];
  },

  register(type: string, func: SymbolFunc) {
    Symbols[type] = func;
  },

  remove(type: string) {
    delete Symbols[type];
  },

  getAll() {
    return Symbols;
  },
};
