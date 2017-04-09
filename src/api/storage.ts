import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import BaseStorage from './base-storage';
import { NotFoundException } from './exception';
import { LoggerInterface } from './interface';
import Utils from './utils';

export default class Storage extends BaseStorage {

  constructor() {
    super(path.join(Utils.getHome(), '.SQLToolsStorage.json'), {});
  }

  public add(name: string, query: string): Storage {
    this.items[name] = query;
    return this.save();
  }

  public get(key): Object {
    if (!this.items[key]) {
      throw new NotFoundException('No query selected');
    }
    return this.items[key];
  }

  public delete(key): this {
    this.get(key);
    delete this.items[key];
    return this.save();
  }

  public getSize = (): number => Object.keys(this.items).length;

  public all = (): Object => this.items;
}
