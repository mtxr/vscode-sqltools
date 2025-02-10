import { FileHandler } from './FileHandler';
import { FileSystem } from './FileSystem';
import { LicenseIdentifiedModule } from './LicenseIdentifiedModule';
declare class PluginFileHandler implements FileHandler {
    private fileSystem;
    private buildRoot;
    private modulesDirectories;
    excludedPackageTest: (packageName: string) => boolean;
    private cache;
    constructor(fileSystem: FileSystem, buildRoot: string, modulesDirectories: string[] | null, excludedPackageTest: (packageName: string) => boolean);
    static PACKAGE_JSON: string;
    getModule(filename: string): LicenseIdentifiedModule | null;
    isInModuleDirectory(filename: string): boolean;
    isBuildRoot(filename: string): boolean;
    private getModuleInternal;
    private findModuleDir;
    private parsePackageJson;
    private dirContainsValidPackageJson;
}
export { PluginFileHandler };
