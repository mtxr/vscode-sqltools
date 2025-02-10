import { NodeLinkData } from '../../types/relation-data';
export type ChordLayoutOptions = {
    weight?: boolean;
    y?: number;
    nodeWidthRatio?: number;
    nodePaddingRatio?: number;
    id?(node: any): any;
    source?(edge: any): any;
    target?(edge: any): any;
    sourceWeight?(edge: any): number;
    targetWeight?(edge: any): number;
    sortBy?: 'id' | 'weight' | 'frequency' | null | ((a: any, b: any) => number);
};
type OutputNode = {
    readonly id: number;
    readonly name: string;
    readonly value: number;
    x: number[];
    y: number[];
};
type OutputLink = {
    readonly source: OutputNode;
    readonly target: OutputNode;
    readonly value: number;
    x?: number[];
    y?: number[];
};
type ChordLayoutOutputData = {
    readonly nodes: OutputNode[];
    readonly links: OutputLink[];
};
export declare function getDefaultOptions(options: ChordLayoutOptions): ChordLayoutOptions;
export declare function chordLayout(chordLayoutOptions: ChordLayoutOptions, chordLayoutInputData: NodeLinkData): ChordLayoutOutputData;
export {};
