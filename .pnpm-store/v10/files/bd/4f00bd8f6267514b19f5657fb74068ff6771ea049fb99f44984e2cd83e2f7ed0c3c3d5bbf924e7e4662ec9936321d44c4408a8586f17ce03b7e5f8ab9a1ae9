import { Data } from '../../types';
/**
 * 根据 edges 获取对应的 node 结构
 */
export declare function getNodes(edges: Data, sourceField: string, targetField: string): string[];
/**
 * 根据 edges 获取对应的 dfs 邻接矩阵
 */
export declare function getMatrix(edges: Data, nodes: string[], sourceField: string, targetField: string): Record<string, Record<string, number>>;
/**
 * 使用 DFS 思路切断桑基图数据中的环（会丢失数据），保证顺序
 * @param data
 * @param sourceField
 * @param targetField
 */
export declare function cutoffCircle(edges: Data, sourceField: string, targetField: string): Data;
