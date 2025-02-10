import { ColorAttr, Options, StyleAttr } from '../../types';
import { DrillDownCfg } from '../../types/drill-down';
import { HierarchyOption } from '../../utils/hierarchy/types';
export interface CirclePackingOptions extends Omit<Options, 'data'> {
    /**
     * @title 数据字段
     */
    readonly data?: Record<string, any>;
    /**
     * @title 层级布局配置
     */
    readonly hierarchyConfig?: Omit<HierarchyOption, 'as' | 'type' | 'field'>;
    /**
     * @title 颜色字段
     */
    readonly colorField?: string;
    /**
     * @title 颜色
     */
    readonly color?: ColorAttr;
    /**
     * @title 大小字段
     */
    readonly sizeField?: string;
    /**
     * @title 源字段
     */
    readonly rawFields?: string[];
    /**
     * @title 图形样式
     */
    readonly pointStyle?: StyleAttr;
    /**
     * @title 交互
     * @description 下钻交互
     */
    readonly drilldown?: DrillDownCfg;
}
