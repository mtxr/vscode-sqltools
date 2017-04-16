// tslint:disable:no-reference
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import * as fs from 'fs';
import { StorageInterface } from './interface';

export default class BaseStorage implements StorageInterface {
  public encoding: string = 'utf8';
  public storagePath: string = null;
  protected defaultSerializable: string = '{}';
  protected items: any = {};
  constructor(storagePath: string, defaultSerializable: any = {}) {
    this.defaultSerializable = JSON.stringify(defaultSerializable);
    this.storagePath = storagePath;
    this.items = defaultSerializable;
    fs.stat(this.storagePath, (err, stats) => {
      if (err === null) {
        this.readFile();
      } else if (err.code === 'ENOENT') {
        this.save();
      } else if (err) {
        throw err;
      }
    });
  }

  public readFile(): this {
    fs.readFile(this.storagePath, this.encoding, (err, content) => {
      if (err) {
        throw err;
      }
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
      if (err) {
        throw err;
      }
    });
    return this;
  }

  public clear(): this {
    this.items = JSON.parse(this.defaultSerializable);
    return this;
  }
}
