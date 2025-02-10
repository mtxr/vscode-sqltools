import { Writeable } from '../../util/types';
import { MappingDatum, Point } from '../../interface';
import GeometryLabel from './base';
import { LabelCfg, LabelPointCfg } from './interface';
/**
 * 柱状图 label
 */
export default class IntervalLabel extends GeometryLabel {
    /**
     * 获取 interval label 的方向，取决于 value 的值是正还是负
     * @param labelCfg
     */
    private getLabelValueDir;
    /**
     * 重载：根据 interval 值的正负来调整 label 偏移量
     * @param labelCfg
     * @param index
     * @param total
     */
    protected getLabelOffsetPoint(labelCfg: LabelCfg, index: number, total: number, position?: string): Point;
    /**
     * 重载：定制 interval label 的默认主题配置
     * @param labelCfg
     */
    protected getThemedLabelCfg(labelCfg: LabelCfg): any;
    protected setLabelPosition(labelPointCfg: Writeable<LabelPointCfg>, mappingData: MappingDatum, index: number, position: string): void;
}
