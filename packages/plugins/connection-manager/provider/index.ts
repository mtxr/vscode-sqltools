import {
  FileSystemProvider,
  ExtensionContext,
  EventEmitter,
  FileChangeEvent,
  Disposable,
  Uri,
  FileStat,
  FileType,
} from 'vscode';
import { promises as fs } from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { EXT_NAME } from '@sqltools/core/constants';

export default class SQLToolsFSProvider implements FileSystemProvider {
  onDidChangeFileEmitter = new EventEmitter<FileChangeEvent[]>();
  onDidChangeFile = this.onDidChangeFileEmitter.event;
  watch(uri: Uri, options: { recursive: boolean; excludes: string[]; }): Disposable {
    throw new Error('Method not implemented.');
  }
  async stat(uri: Uri): Promise<FileStat> {
    return fs.stat(await this.getConnFile(uri.fsPath)).then(stat => ({
      ...stat,
      mtime: +stat.mtime,
      ctime: +stat.ctime,
      type: FileType.File
    }));
  }
  async readDirectory(uri: Uri): Promise<[string, FileType][]> {
    throw new Error('Method not implemented.');
  }
  async createDirectory(uri: Uri): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async readFile(uri: Uri): Promise<Uint8Array> {
    return fs.readFile(await this.getConnFile(uri.fsPath));
  }
  async writeFile(uri: Uri, content: Uint8Array): Promise<void> {
    return fs.writeFile(await this.getConnFile(uri.fsPath), content);
  }
  async delete(uri: Uri) {
    let p = uri.scheme === EXT_NAME.toLowerCase() ? await this.getConnFile(uri.fsPath) : uri.fsPath;
    await new Promise((resolve,reject) => rimraf(p, { disableGlob: true }, (err) => err ? reject(err) : resolve()));
  }
  async rename(oldUri: Uri, newUri: Uri) {
    const [ oldPath, newPath ] = await Promise.all([
      this.getConnFile(oldUri.fsPath),
      this.getConnFile(newUri.fsPath),
    ]);
    return fs.rename(oldPath, newPath);
  }

  private connFileCacheDir: string;

  public async getConnFile(connName: string) {
    const dir = await this.getOrCreateCacheDir();
    const connFile = path.join(dir, `${connName} Session.sql`);
    await fs.appendFile(connFile, Buffer.from(''));
    return connFile;
  }

  public clearCache() {
    return this.delete(Uri.file(this.connFileCacheDir));
  }
  private async getOrCreateCacheDir() {
    try {
      await fs.stat(this.connFileCacheDir)
    } catch (error) {
      await fs.mkdir(this.connFileCacheDir, { recursive: true })
        .catch(async () => {
          this.connFileCacheDir = await fs.mkdtemp('sqltoolsConns');
        });
    }
    return this.connFileCacheDir;
  }
  constructor(private context: ExtensionContext) {
    this.connFileCacheDir = this.context.asAbsolutePath('./connFileCaches');
  }
}