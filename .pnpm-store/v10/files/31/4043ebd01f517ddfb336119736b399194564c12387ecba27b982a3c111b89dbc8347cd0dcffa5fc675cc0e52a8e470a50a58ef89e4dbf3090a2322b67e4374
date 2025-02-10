import { WebpackChunk } from './WebpackChunk';
import { ModuleCache } from './ModuleCache';
import { LicenseIdentifiedModule } from './LicenseIdentifiedModule';
import { WebpackCompilation } from './WebpackCompilation';
import { WebpackStats } from './WebpackStats';
interface WebpackChunkHandler {
    processChunk(compilation: WebpackCompilation, chunk: WebpackChunk, moduleCache: ModuleCache, stats: WebpackStats | undefined): void;
    processModule(compilation: WebpackCompilation, chunk: WebpackChunk, moduleCache: ModuleCache, module: LicenseIdentifiedModule): void;
}
export { WebpackChunkHandler };
