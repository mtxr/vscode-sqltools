import * as fs from 'fs';
import { LoggerInterface, StorageInterface } from './interface';

export default class BaseStorage implements StorageInterface {
  public encoding: string = 'utf8';
  public storagePath: string = null;
  protected defaultSerializable: string = '{}';
  protected items: any = {};
  protected logger: any = console;
  constructor(storagePath: string, defaultSerializable: any = {}) {
    this.defaultSerializable = JSON.stringify(defaultSerializable);
    this.storagePath = storagePath;
    this.items = defaultSerializable;
    fs.stat(this.storagePath, (err, stats) => {
      if (err === null) {
        this.readFile();
      } else if (err.code === 'ENOENT') {
        this.save();
      }
      this.logger.error('Ops, we\'ve got an error', err);
    });
  }

  public readFile(): this {
    fs.readFile(this.storagePath, this.encoding, (err, content) => {
      if (content && content.length > 0) {
        this.items = JSON.parse(content);
        return;
      }
      this.clear().save();
    });
    return this;
  }

  public serializeContent(): Buffer {
    return new Buffer(JSON.stringify(this.items), 'utf8');
  }
  public save(): this {
    return this.writeFile();
  }
  public writeFile(): this {
    fs.writeFile(this.storagePath, this.serializeContent(), (err) => {
      this.logger.error('Ops, we\'ve got an error', err);
    });
    return this;
  }

  public setLogger(logger: LoggerInterface): this {
    this.logger = logger;
    return this;
  }

  public clear(): this {
    this.items = JSON.parse(this.defaultSerializable);
    return this;
  }
}
