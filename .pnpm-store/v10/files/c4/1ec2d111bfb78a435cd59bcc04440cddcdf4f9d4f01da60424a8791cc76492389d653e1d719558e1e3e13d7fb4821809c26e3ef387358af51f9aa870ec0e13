import { WebpackChunkHandler } from './WebpackChunkHandler';
import { WebpackCompiler } from './WebpackCompiler';
import { ChunkIncludeExcludeTester } from './ChunkIncludeExcludeTester';
import { ModuleCache } from './ModuleCache';
import { AssetManager } from './AssetManager';
import { Module } from './Module';
declare class WebpackCompilerHandler {
    private chunkIncludeTester;
    private chunkHandler;
    private assetManager;
    private moduleCache;
    private addBanner;
    private perChunkOutput;
    private additionalChunkModules;
    private additionalModules;
    private skipChildCompilers;
    static PROCESS_ASSETS_STAGE_ADDITIONS: number;
    static PROCESS_ASSETS_STAGE_REPORT: number;
    constructor(chunkIncludeTester: ChunkIncludeExcludeTester, chunkHandler: WebpackChunkHandler, assetManager: AssetManager, moduleCache: ModuleCache, addBanner: boolean, perChunkOutput: boolean, additionalChunkModules: {
        [chunkName: string]: Module[];
    }, additionalModules: Module[], skipChildCompilers: boolean);
    handleCompiler(compiler: WebpackCompiler): void;
    private iterateChunksForBanner;
    private iterateChunks;
}
export { WebpackCompilerHandler };
