import { WebpackChunk } from './WebpackChunk';
import { Source } from 'webpack-sources';
import { ChunkGraph } from './ChunkGraph';
import { WebpackCompiler } from './WebpackCompiler';
import { WebpackStats } from './WebpackStats';
export interface WebpackCompilation {
    hash: string;
    chunks: IterableIterator<WebpackChunk>;
    assets: {
        [key: string]: Source;
    };
    errors: any[];
    warnings: any[];
    getPath(filename: string, data: {
        hash?: any;
        chunk?: any;
        filename?: string;
        basename?: string;
        query?: any;
    }): string;
    hooks: {
        optimizeChunkAssets: {
            tap: (pluginName: string, handler: (chunks: IterableIterator<WebpackChunk>) => void) => void;
        };
        processAssets: {
            tap: (options: {
                name: string;
                stage: number;
            }, handler: () => void) => void;
        };
    };
    plugin?: (phase: string, callback: Function) => void;
    chunkGraph?: ChunkGraph;
    compiler: WebpackCompiler;
    getStats: () => {
        toJson: (options?: WebpackStatsOptions) => WebpackStats;
    };
}
export interface WebpackStatsOptions {
    all?: boolean;
    chunks?: boolean;
    chunkModules?: boolean;
    nestedModules?: boolean;
    dependentModules?: boolean;
    cachedModules?: boolean;
}
