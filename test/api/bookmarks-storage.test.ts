// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { stub } from 'sinon';
import * as vscode from 'vscode';
import { BookmarksStorage, Utils } from './../../src/api';
import { NotFoundException, SizeException } from './../../src/api/exception';

describe('BookmarksStorage', () => {
  const filepath = path.join(Utils.getHome(), 'Testing.SQLToolsStorage.json');
  beforeEach(() => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  });

  it('create bookmarks', () => {
    const bookmarks = new BookmarksStorage('Testing');
    expect(bookmarks).to.be.instanceof(BookmarksStorage);
  });

  it('re-create bookmarks with file was truncated', () => {
    fs.writeFileSync(filepath, '');
    const bookmarks = new BookmarksStorage('Testing');
    expect(bookmarks).to.be.instanceof(BookmarksStorage);
  });

  it('should add and get size correctly', () => {
    const bookmarks = new BookmarksStorage('Testing');
    expect(bookmarks.getSize()).to.be.eql(0);
    bookmarks.add('alias', 'Query');
    expect(bookmarks.getSize()).to.be.eql(1);
    bookmarks.add('alias1', 'Query');
    expect(bookmarks.getSize()).to.be.eql(2);
  });

  it('should return all items', () => {
    const bookmarks = new BookmarksStorage('Testing');
    bookmarks.add('alias', 'Query');
    expect(bookmarks.all()).to.be.eql({alias: 'Query'});
  });

  it('should return query for a given alias', () => {
    const bookmarks = new BookmarksStorage('Testing');
    bookmarks.add('alias', 'Query');
    expect(bookmarks.get('alias')).to.be.eql('Query');
  });

  it('should delete query for a give nalias', () => {
    const bookmarks = new BookmarksStorage('Testing');
    bookmarks.add('alias', 'Query');
    expect(bookmarks.get('alias')).to.be.eql('Query');
    bookmarks.delete('alias');
    expect(bookmarks.getSize()).to.be.eql(0);
    expect(() => bookmarks.get('alias')).to.throw(NotFoundException, 'No query selected');
  });
});
