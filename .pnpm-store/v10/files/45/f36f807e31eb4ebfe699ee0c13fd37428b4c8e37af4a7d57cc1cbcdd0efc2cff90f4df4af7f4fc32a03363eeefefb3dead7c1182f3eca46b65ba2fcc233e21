import { WebpackChunkHandler } from './WebpackChunkHandler';
import { WebpackChunk } from './WebpackChunk';
import { FileHandler } from './FileHandler';
import { LicenseTypeIdentifier } from './LicenseTypeIdentifier';
import { FileSystem } from './FileSystem';
import { LicenseTextReader } from './LicenseTextReader';
import { ModuleCache } from './ModuleCache';
import { LicensePolicy } from './LicensePolicy';
import { LicenseIdentifiedModule } from './LicenseIdentifiedModule';
import { WebpackCompilation } from './WebpackCompilation';
import { Logger } from './Logger';
import { WebpackStats } from './WebpackStats';
declare class PluginChunkReadHandler implements WebpackChunkHandler {
    private logger;
    private fileHandler;
    private licenseTypeIdentifier;
    private licenseTextReader;
    private licensePolicy;
    private fileSystem;
    private moduleIterator;
    private innerModuleIterator;
    constructor(logger: Logger, fileHandler: FileHandler, licenseTypeIdentifier: LicenseTypeIdentifier, licenseTextReader: LicenseTextReader, licensePolicy: LicensePolicy, fileSystem: FileSystem);
    processChunk(compilation: WebpackCompilation, chunk: WebpackChunk, moduleCache: ModuleCache, stats: WebpackStats | undefined): void;
    private extractIdentifiedModule;
    private getPackageJson;
    processModule(compilation: WebpackCompilation, chunk: WebpackChunk, moduleCache: ModuleCache, module: LicenseIdentifiedModule): void;
}
export { PluginChunkReadHandler };
