import { WebpackChunk } from './WebpackChunk';
import { WebpackChunkModule } from './WebpackChunkModule';
export interface ChunkGraph {
    getChunkModulesIterable: (chunk: WebpackChunk) => IterableIterator<WebpackChunkModule>;
    getChunkEntryModulesIterable: (chunk: WebpackChunk) => IterableIterator<WebpackChunkModule>;
}
