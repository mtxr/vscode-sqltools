declare function hasArc(path: any): boolean;
declare function isPointInStroke(segments: any, lineWidth: any, x: any, y: any, length: any): boolean;
/**
 * 提取出内部的闭合多边形和非闭合的多边形，假设 path 不存在圆弧
 * @param {Array} path 路径
 * @returns {Array} 点的集合
 */
declare function extractPolygons(path: any): {
    polygons: any[];
    polylines: any[];
};
declare const _default: {
    catmullRomToBezier: (crp: any, z: any) => any[];
    fillPath: (source: any, target: any) => any;
    fillPathByDiff: (source: any, target: any) => any;
    formatPath: (fromPath: any, toPath: any) => any;
    intersection: (path1: any, path2: any) => number | any[];
    parsePathArray: (path: any) => any;
    parsePathString: (pathString: string) => import("@antv/g-base").PathCommand[];
    pathToAbsolute: (pathArray: any) => any[];
    pathToCurve: (path: any, path2?: any) => any[];
    rectPath: (x: any, y: any, w: any, h: any, r?: any) => any[][];
    hasArc: typeof hasArc;
    extractPolygons: typeof extractPolygons;
    isPointInStroke: typeof isPointInStroke;
};
export default _default;
