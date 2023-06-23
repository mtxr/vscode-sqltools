import fs from 'fs';
import { NotFoundError } from '@sqltools/util/exception';

export default class SerializableStorage<Item, Key = string | number | Symbol> {
  public encoding: BufferEncoding = 'utf8';
  public storagePath: string = null;
  protected defaultSerializable: string = '{}';
  protected items: any = {};
  constructor(storagePath: string, defaultSerializable: any = {}) {
    this.defaultSerializable = JSON.stringify(defaultSerializable);
    this.storagePath = storagePath;
    this.items = defaultSerializable;
    this.read();
  }

  public read(): this {
    try {
      const content = fs.readFileSync(this.storagePath, this.encoding);
      if (content && content.length > 0) {
        this.items = JSON.parse(content);
      } else {
        this.reset().save();
      }
    } catch (e) {
      this.reset().save();
    }
    return this;
  }

  public save(): this {
    fs.writeFileSync(this.storagePath, JSON.stringify(this.items, null, 2), this.encoding);
    return this;
  }

  public reset(): this {
    this.items = JSON.parse(this.defaultSerializable);
    return this;
  }

  public set(key: Key, query: Item) {
    this.items[key] = query;
    return this.save();
  }

  public get(key: Key) {
    if (!this.items[key]) {
      throw new NotFoundError('Query not found!');
    }
    return this.items[key];
  }

  public delete(key: Key): this {
    this.get(key);
    delete this.items[key];
    return this.save();
  }

  public content(content: any) {
    this.items = content;
    return this;
  }

  public getContent() {
    return this.items;
  }
}
