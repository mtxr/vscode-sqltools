/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import fs = require('fs');
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
    this.readFile();
  }

  public readFile(): this {
    try {
      const content = fs.readFileSync(this.storagePath, this.encoding);
      if (content && content.length > 0) {
        this.items = JSON.parse(content);
      } else {
        this.clear().save();
      }
    } catch (e) {
      this.clear().save();
    }
    return this;
  }

  public serializeContent(): Buffer {
    return new Buffer(JSON.stringify(this.items), 'utf8');
  }
  public save(): this {
    return this.writeFile();
  }
  public writeFile(): this {
    fs.writeFileSync(this.storagePath, this.serializeContent());
    return this;
  }

  public clear(): this {
    this.items = JSON.parse(this.defaultSerializable);
    return this;
  }
}
