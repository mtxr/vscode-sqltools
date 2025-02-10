import { IShape, PathCommand } from '../../dependents';
import { GAnimateCfg } from '../../interface';
import { AnimateExtraCfg } from '../interface';
/**
 * path 存在以下情况
 * 1. 饼图不为整圆的 path，命令为 M, L, A, L, Z
 * 2. 饼图为整圆的 path，命令为 M, M, A, A, M, Z
 * 3. 环图不为整圆的 path，命令为 M, A, L, A, L, Z
 * 4. 环图为整圆的 path，命令为 M, A, A, M, A, A, M, Z
 * 5. radial-line, 不为整圆时的 path, 命令为 M, A, A, Z
 * 6. radial-line, 为整圆时的 path，命令为 M, A, A, A, A, Z
 * @param path theta 坐标系下圆弧的 path 命令
 */
export declare function getArcInfo(path: PathCommand[]): {
    startAngle: any;
    endAngle: any;
    radius: number;
    innerRadius: number;
};
/**
 * @ignore
 * 饼图更新动画
 * @param shape 文本图形
 * @param animateCfg
 * @param cfg
 */
export declare function sectorPathUpdate(shape: IShape, animateCfg: GAnimateCfg, cfg: AnimateExtraCfg): void;
