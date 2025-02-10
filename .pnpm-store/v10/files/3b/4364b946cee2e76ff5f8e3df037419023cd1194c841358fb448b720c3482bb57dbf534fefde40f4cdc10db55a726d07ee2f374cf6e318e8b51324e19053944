import { Datum } from '../../types';
import { center, justify, left, right } from './sankey';
declare const ALIGN_METHOD: {
    left: typeof left;
    right: typeof right;
    center: typeof center;
    justify: typeof justify;
};
type InputNode = {
    readonly name: string;
};
type InputLink = {
    readonly source: number;
    readonly target: number;
    readonly value: number;
};
type OutputNode = {
    readonly name: string;
    readonly x0: number;
    readonly x1: number;
    readonly y0: number;
    readonly y1: number;
    readonly depth: number;
    readonly value: number;
    x: number[];
    y: number[];
};
type OutputLink = {
    readonly source: OutputNode;
    readonly target: OutputNode;
    readonly value: number;
    readonly width: number;
    readonly y0: number;
    readonly y1: number;
    x?: number[];
    y?: number[];
};
/**
 * 桑基图布局的数据结构定义
 */
export type SankeyLayoutInputData = {
    readonly nodes: InputNode[];
    readonly links: InputLink[];
};
type SankeyLayoutOutputData = {
    readonly nodes: OutputNode[];
    readonly links: OutputLink[];
};
/**
 * 对齐方式的类型定义
 */
export type NodeAlign = keyof typeof ALIGN_METHOD | ((...args: any[]) => any);
/**
 * 节点的 depth 自定义
 */
export type NodeDepth = (datum: Datum, maxDepth: number) => number;
/**
 * 节点排序方法的类型定义
 */
export type NodeSort = (a: Datum, b: Datum) => number;
/**
 * 布局参数的定义
 */
export type SankeyLayoutOptions = {
    readonly nodeId?: (node: Datum) => any;
    readonly nodeSort?: (a: any, b: any) => number;
    readonly nodeAlign?: NodeAlign;
    readonly nodeWidth?: number;
    readonly nodePadding?: number;
    readonly nodeDepth?: NodeDepth;
};
/**
 * 获得 align function
 * @param nodeAlign
 * @param nodeDepth
 */
export declare function getNodeAlignFunction(nodeAlign: NodeAlign): (...args: any[]) => any;
export declare function getDefaultOptions(sankeyLayoutOptions: SankeyLayoutOptions): Partial<SankeyLayoutOptions> & SankeyLayoutOptions;
/**
 * 桑基图利用数据进行布局的函数，最终返回节点、边的位置（0 - 1 的信息）
 * 将会修改 data 数据
 * @param sankeyLayoutOptions
 * @param data
 */
export declare function sankeyLayout(sankeyLayoutOptions: SankeyLayoutOptions, data: SankeyLayoutInputData): SankeyLayoutOutputData;
export {};
