import { register, getMethod } from './register';
import rect from './rect';
import circle from './circle';
import polyline from './polyline';
import polygon from './polygon';
import text from './text';
import path from './path';
import line from './line';
import ellipse from './ellipse';

register('rect', rect);
register('image', rect); // image 使用 rect 的包围盒计算
register('circle', circle);
register('marker', circle); // marker 使用 circle 的计算方案
register('polyline', polyline);
register('polygon', polygon);
register('text', text);
register('path', path);
register('line', line);
register('ellipse', ellipse);

export { getMethod as getBBoxMethod, register as registerBBox };
