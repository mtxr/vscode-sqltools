import { SankeyOptions } from './types';
export declare function getNodeWidthRatio(nodeWidth: number, nodeWidthRatio: number, width: number): number;
export declare function getNodePaddingRatio(nodePadding: number, nodePaddingRatio: number, height: number): number;
/**
 * 将桑基图配置经过 layout，生成最终的 view 数据
 * @param options
 * @param width
 * @param height
 */
export declare function transformToViewsData(options: SankeyOptions, width: number, height: number): {
    nodes: {
        isNode: boolean;
    }[];
    edges: {
        isNode: boolean;
        source: string;
        target: string;
        name: string;
    }[];
};
