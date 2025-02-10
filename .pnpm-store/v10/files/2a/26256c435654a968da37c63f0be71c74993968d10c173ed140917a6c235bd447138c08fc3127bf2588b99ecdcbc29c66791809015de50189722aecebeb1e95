/// <reference types="node" />
import { promises, exists, Stats } from 'fs';
import { exec as exec$1 } from 'child_process';
import { globFiles as globFiles$1, mkdirp as mkdirp$1, clean as clean$1, copyFiles as copyFiles$1 } from 'aria-fs';
import { CompilerOptions, CustomTransformers } from 'typescript';
import * as _mp_rt14typescript___CompilerOptions from 'typescript';
export { _mp_rt14typescript___CompilerOptions as ts };
import { Options } from 'rollup-plugin-terser';
import { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import { WatcherOptions as WatcherOptions$1, ModuleFormat as ModuleFormat$1, rollup as rollup$1, watch as watch$1, RollupOutput } from 'rollup';
import * as pluginUrl from '@rollup/plugin-url';
export { pluginUrl as url };
export { default as minifyHTML } from 'rollup-plugin-minify-html-literals';
export { default as json } from '@rollup/plugin-json';
import { SourceMap } from 'magic-string';
export { default as MagicString } from 'magic-string';
export { default as nodeResolve } from '@rollup/plugin-node-resolve';
import { JscConfig, Output } from '@swc/core';
import { TransformOptions, Service } from 'esbuild';
import { EventEmitter } from 'events';

declare const copyFile: typeof promises.copyFile;
declare const writeFile: typeof promises.writeFile;
declare const rename: typeof promises.rename;
declare const readdir: typeof promises.readdir;
declare const readFile: typeof promises.readFile;
declare const stats: typeof promises.stat;
declare const unlink: typeof promises.unlink;
declare const symlink: typeof promises.symlink;
declare const fstat: typeof promises.fstat;
declare const readlink: typeof promises.readlink;
declare const mkdir: typeof promises.mkdir;
declare const lstat: typeof promises.lstat;

declare const nodeMajorVersion: number;
declare const exist: typeof exists.__promisify__;
declare const exec: typeof exec$1.__promisify__;
declare const globFiles: typeof globFiles$1;
declare const mkdirp: typeof mkdirp$1;
declare const clean: typeof clean$1;
declare const copyFiles: typeof copyFiles$1;
declare const symlinkDir: (src: string, dest: string) => Promise<void>;
declare const unlinkDir: (dest: string) => Promise<void>;
declare const unlinkFile: (dest: string) => Promise<void>;
declare const symlinkFile: (src: string, dest: string) => Promise<void>;

declare const replacePlugin: any;
declare type WatcherOptions = WatcherOptions$1;
declare type ModuleFormat = ModuleFormat$1;
declare const rollup: typeof rollup$1;
declare const watch: typeof watch$1;
declare function commonjs(options?: RollupCommonJSOptions): any;
declare function terser(options?: Options): any;

interface PackageFile {
    filePath?: string;
    entry?: string;
    output?: string;
    format?: string;
    name?: string;
    main?: string;
    module?: string;
    typings?: string;
    dependencies?: KeyValue;
    devDependencies?: KeyValue;
    peerDependencies?: KeyValue;
}
interface KeyValue {
    [key: string]: string;
}
declare type PluginOptions = any[] | PluginBeforeAfter;
interface PluginBeforeAfter {
    before?: any[];
    after?: any[];
}
interface CreateRollupConfigOptions {
    config: RollupConfigBase | TSRollupConfig | RollupConfigBase[] | TSRollupConfig[];
    name?: string;
    esbuild?: boolean;
    swc?: boolean;
    write?: boolean;
}
interface OutputOptions extends RollupConfigOutput {
}
interface RollupConfigBase {
    input?: string | string[];
    external?: string[];
    plugins?: PluginOptions;
    output?: RollupConfigOutput | RollupConfigOutput[];
    resolveOpts?: NodeResolveOptions;
    commonOpts?: CommonJsOptions;
    replace?: KeyValue;
    compress?: boolean;
    watch?: WatcherOptions;
    hmr?: boolean;
}
interface TSRollupConfig extends RollupConfigBase {
    tsconfig?: TSConfigOptions;
}
interface NodeResolveOptions {
    extensions?: string[];
    mainFields?: string[];
}
interface CommonJsOptions {
    extensions?: string[];
    include?: string | string[];
    exclude?: string | string[];
}
interface RollupConfigOutput {
    sourcemap?: boolean | 'inline' | 'hidden';
    file?: string;
    format?: ModuleFormat;
    name?: string;
    exports?: string;
    globals?: KeyValue;
    plugins?: PluginOptions;
}
interface TSConfigOptions {
    compilerOptions?: CompilerOptions;
    transformers?: CustomTransformers;
    exclude?: string[];
    include?: string[];
}
interface CreateTSConfigOptions {
    input?: string | string[];
    file?: string;
    tsconfig?: TSConfigOptions;
    pluginOpts?: any;
}
interface TSRollupPluginResult {
    tsconfigDefaults: {
        compilerOptions?: Omit<CompilerOptions, 'module' | 'moduleResolution' | 'target'>;
        exclude?: string[];
        include?: string[];
    };
    transformers?: any[];
    check?: boolean;
    objectHashIgnoreUnknownHack?: boolean;
    useTsconfigDeclarationDir?: boolean;
    cacheRoot?: string;
}

declare const DEFAULT_DEST = "dist";
declare const DEFAULT_SOURCE = "src";
declare const DEFAULT_VALUES: Readonly<{
    DIST_FOLDER: string;
    SOURCE_FOLDER: string;
    ROLLUP_EXTERNALS: string[];
}>;
declare function baseDir(): string;
declare function getInputEntryFile(input: string): string;
declare function getPackageNameSync(filePath?: string): any;
declare function onwarn(options: {
    code: string;
    message: string;
}): void;

declare function copyPackageFile(options?: PackageFile): Promise<void>;

interface CopyReadmeOptions {
    filePath?: string;
    output?: string;
}
declare function copyReadMeFile(options?: CopyReadmeOptions): Promise<void>;

declare function findTargetBuild(target: string, config: RollupConfigBase[] | TSRollupConfig[]): Promise<void>;

declare function getPackage(filePath?: string): Promise<any>;
declare function getPackageName(filePath?: string): Promise<any>;

declare const DEFAULT_OUT_DIR = "dist";
declare type OutputFormat = 'es' | 'cjs' | 'umd' | 'iife';
interface BuildOptions {
    entry?: string;
    d?: boolean;
    declaration?: boolean;
    format?: string;
    external?: string;
    name?: string;
    globals?: string;
    clean?: string;
    sourcemap?: boolean | 'inline' | 'hidden';
    config?: string;
    output?: string;
    compress?: boolean | string;
    resolve?: boolean | string;
    watch?: boolean;
    target?: string;
    expirement?: boolean;
    bundler?: 'esbuild' | 'swc' | 'ts';
    esbuild?: boolean;
    swc?: boolean;
    write?: boolean;
}
interface TestAriaConfigOptions extends Omit<AriaConfigOptions, 'test'> {
    scripts?: string[];
}
interface AriaConfigOptions {
    external?: string[];
    plugins?: PluginOptions;
    output?: {
        globals?: KeyValue;
    };
    test?: TestAriaConfigOptions;
}
interface BuildFormatOptions extends BuildOptions {
    pkgName?: string;
    plugins?: PluginOptions;
    dependencies?: string[];
}

declare function getAriaConfig(config?: string): Promise<AriaConfigOptions>;

declare function getEntryFile(pkgName: string): string;

declare function bundlerOptions(options?: Pick<BuildOptions, 'swc' | 'esbuild'>): {
    swc: boolean;
    esbuild: boolean;
};
declare function handler(options?: BuildOptions): Promise<void>;

declare const getCliOptions: () => {
    package: string;
    command: string;
    options: ({
        alias: string;
        description: string;
        defaultValue?: undefined;
    } | {
        alias: string;
        description: string;
        defaultValue: boolean;
    } | {
        alias: string;
        description: string;
        defaultValue: string;
    })[];
};

declare function run(version: string): Promise<void>;

interface ExternalDepsOptions {
    external?: string;
    dependencies?: string[];
}
declare function getExternalDeps(options: ExternalDepsOptions): string[];
declare function entryFile(formats: string[] | string, entry: string, module?: string): string;
declare function updateExternalWithResolve(options?: {
    resolve?: boolean | string;
    external?: string[];
}): string[];
declare function parseConfig(options?: {
    config?: string;
    entry?: string;
}): string;
declare function getPkgDependencies(pkgJson: PackageFile): string[];
declare function mergeGlobals(globals?: KeyValue, optionGlobals?: string): string;
declare function parsePlugins(plugins?: PluginOptions): any[] | {
    before: any[];
    after: any[];
};

interface GetFileOptions {
    outDir: string;
    name: string;
    formats: string[];
    format?: ModuleFormat;
    entry?: string;
}
declare function buildConfig(options: BuildFormatOptions): TSRollupConfig;

declare function isGlob(file: string): boolean;
interface TargetCopyOptions {
    src: string;
    dest: string;
    recursive?: boolean;
    replace?: (filename: string) => Promise<void>;
}
interface RollupPluginCopyOptions {
    hook?: string;
    targets?: TargetCopyOptions[];
    copyEnd?: () => Promise<void>;
}
declare function replaceContent(options?: {
    filename?: string;
    strToFind?: string;
    strToReplace?: string;
    extensions?: string[];
}): Promise<void>;
declare function createOutfile(file: string, dest: string, recursive: boolean): string;
declare function copyAssets(options?: RollupPluginCopyOptions): Promise<void>;

declare function copy(options?: RollupPluginCopyOptions): {
    [x: string]: string | (() => Promise<void>);
    name: string;
};

interface LinkOptions {
    hook?: string;
    moduleDir?: string;
    outDir?: string;
    targets?: {
        package?: string;
        dest?: string;
    }[];
}
declare function linkToPackages(options: LinkOptions): {
    [x: string]: string | (() => Promise<void>);
    name: string;
};

declare function transform(file: string, content: string, specifiers: KeyValue): {
    code: string;
    map: SourceMap;
};
declare function transformImport(specifiers?: KeyValue): {
    name: string;
    transform(code: string, id: string): {
        code: string;
        map: SourceMap;
    };
};

declare function swcPlugin(options?: JscConfig): {
    name: string;
    buildStart: () => Promise<void>;
    transform(code: string, id: string): Promise<Output>;
};

declare function pathResolver(extensions?: string[]): (id: string, origin: string | undefined) => string;
declare function resolvePathPlugin(extenstions?: string[]): {
    name: string;
    resolveId: (id: string, origin: string) => string;
};

interface EsBuildPluginOptions {
    transformOptions?: TransformOptions;
    extensions?: string[];
}
declare function transformCode(service: Service, options?: TransformOptions): (code: string, id: string) => Promise<{
    code: string;
    map: string;
}>;
declare function esBuildPlugin(options?: EsBuildPluginOptions): {
    name: string;
    buildStart: () => Promise<void>;
    transform(code: string, id: string): Promise<{
        code: string;
        map: string;
    }>;
    buildEnd: (error?: Error) => void;
    generateBundle: () => void;
    writeBundle: () => void;
};

declare function esbuild(options: CreateRollupConfigOptions): Promise<RollupOutput[][]>;

declare function esbuildDts(options: CreateRollupConfigOptions): Promise<RollupOutput[]>;

interface CreateRollupConfigBuilderOptions extends CreateRollupConfigOptions {
    pkg?: PackageFile;
}
declare function createOptions(options: CreateRollupConfigBuilderOptions | BuildFormatOptions): Promise<CreateRollupConfigBuilderOptions>;
declare function bundle(options: CreateRollupConfigBuilderOptions | BuildFormatOptions): Promise<void>;

interface Listener {
    (file?: string, stats?: Stats): void;
}
interface ReadyListener {
    (files: string[]): void;
}
interface WatchOptions {
    onChange?: Listener;
    onCreate?: Listener;
    onDelete?: Listener;
    onReady?: ReadyListener;
}
declare class Watcher extends EventEmitter {
    private watchers;
    private store;
    constructor(options?: WatchOptions);
    get watchFiles(): any[];
    watch(src: string): Promise<void>;
    unwatch(src: string): Promise<void>;
}
declare const watcher: (src: string, options?: WatchOptions) => Promise<void>;

export { AriaConfigOptions, BuildFormatOptions, BuildOptions, CommonJsOptions, CopyReadmeOptions, CreateRollupConfigBuilderOptions, CreateRollupConfigOptions, CreateTSConfigOptions, DEFAULT_DEST, DEFAULT_OUT_DIR, DEFAULT_SOURCE, DEFAULT_VALUES, EsBuildPluginOptions, ExternalDepsOptions, GetFileOptions, KeyValue, LinkOptions, Listener, ModuleFormat, NodeResolveOptions, OutputFormat, OutputOptions, PackageFile, PluginBeforeAfter, PluginOptions, ReadyListener, RollupConfigBase, RollupConfigOutput, RollupPluginCopyOptions, TSConfigOptions, TSRollupConfig, TSRollupPluginResult, TargetCopyOptions, TestAriaConfigOptions, WatchOptions, Watcher, WatcherOptions, baseDir, buildConfig, bundle, bundlerOptions, clean, commonjs, copy, copyAssets, copyFile, copyFiles, copyPackageFile, copyReadMeFile, createOptions, createOutfile, entryFile, esBuildPlugin, esbuild, esbuildDts, exec, exist, findTargetBuild, fstat, getAriaConfig, getCliOptions, getEntryFile, getExternalDeps, getInputEntryFile, getPackage, getPackageName, getPackageNameSync, getPkgDependencies, globFiles, handler, isGlob, linkToPackages, lstat, mergeGlobals, mkdir, mkdirp, nodeMajorVersion, onwarn, parseConfig, parsePlugins, pathResolver, readFile, readdir, readlink, rename, replaceContent, replacePlugin, resolvePathPlugin, rollup, run, stats, swcPlugin, symlink, symlinkDir, symlinkFile, terser, transform, transformCode, transformImport, unlink, unlinkDir, unlinkFile, updateExternalWithResolve, watch, watcher, writeFile };
