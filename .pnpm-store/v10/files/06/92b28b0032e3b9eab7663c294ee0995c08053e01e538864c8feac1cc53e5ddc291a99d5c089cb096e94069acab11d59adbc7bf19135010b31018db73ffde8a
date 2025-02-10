import { PackageJson } from './PackageJson';
export interface WebpackChunkModule {
    resource?: string;
    rootModule?: {
        resource?: string;
    };
    originModule?: {
        resource?: string;
    };
    fileDependencies?: string[];
    dependencies?: WebpackChunkModule[];
    resourceResolveData?: {
        descriptionFileRoot: string;
        descriptionFileData: PackageJson;
    };
}
