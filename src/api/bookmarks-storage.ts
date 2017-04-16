// tslint:disable:no-reference
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import BaseStorage from './base-storage';
import { NotFoundException } from './exception';
import { LoggerInterface } from './interface';
import Utils from './utils';

export default class BookmarksStorage extends BaseStorage {
  constructor(public name: string = '.Bookmarks') {
    super(path.join(Utils.getHome(), `${name}.SQLToolsStorage.json`), {});
  }

  public add(name: string, query: string): BookmarksStorage {
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
