declare function globFiles(src: string | string[], relative?: boolean): Promise<any[]>;

declare function mkdirp(directory: string): void;

declare function clean(dir: string): Promise<void>;

declare function copyFiles(src: string | string[], destRootDir: string): Promise<void>;

declare const symlinkDir: (src: string, dest: string) => Promise<void>;
declare const symlinkFile: (src: string, dest: string) => Promise<void>;
declare const unlinkFile: (dest: string) => Promise<void>;
declare const unlinkDir: (dest: string) => Promise<void>;

export { clean, copyFiles, globFiles, mkdirp, symlinkDir, symlinkFile, unlinkDir, unlinkFile };
